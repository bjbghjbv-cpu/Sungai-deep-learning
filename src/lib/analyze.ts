import "server-only";

import { prisma } from "./prisma";
import { visionChat, llmChat, extractJson, type ChatMessage } from "./gateway";
import { computeWaterScore, deriveSeverity, normalizeType, clamp } from "./scoring";
import { KNOWLEDGE_BASE } from "./knowledge-base";
import { POLLUTION_LABELS, SEVERITY_LABELS } from "./types";
import type {
  AnalyzeInput,
  AnalyzeResult,
  ChecklistItem,
  PollutionType,
  Recommendations,
} from "./types";

interface VisionJson {
  pollutionType?: string;
  confidence?: number;
  indicators?: string[];
}

const SYSTEM_PROMPT = [
  "Anda adalah pemerhati lingkungan dan kualitas air sungai di Indonesia.",
  "Tugas Anda menganalisis foto permukaan air sungai dan menentukan jenis pencemaran.",
  "Klasifikasikan ke salah satu dari 6 kategori berikut (gunakan nilai slug persis):",
  "- keruh_sedimen: air keruh kecoklatan pekat, banyak lumpur/sedimen tersuspensi.",
  "- sampah_domestik: sampah plastik, rumah tangga, atau limbah padat mengapung.",
  "- berbusa_kimia: permukaan berbusa, berwarna tidak wajar, indikasi limbah kimia/deterjen.",
  "- alga_eutrofikasi: air kehijauan pekat, lapisan alga atau blooming tanaman air.",
  "- limbah_minyak: lapisan minyak/kilap pelangi di permukaan air.",
  "- normal: air relatif jernih dan tidak menunjukkan tanda pencemaran.",
  "Jika ragu, pilih kategori yang paling mungkin berdasarkan bukti visual.",
].join("\n");

const VALID_TYPES: PollutionType[] = [
  "keruh_sedimen",
  "sampah_domestik",
  "berbusa_kimia",
  "alga_eutrofikasi",
  "limbah_minyak",
  "normal",
];

function buildUserText(input: AnalyzeInput): string {
  const lines = [
    "Analisis foto sungai berikut dan balas HANYA dengan JSON valid berbentuk:",
    '{"pollutionType": "<slug>", "confidence": <0..1>, "indicators": ["...", "..."]}',
    "pollutionType harus salah satu dari:",
    VALID_TYPES.join(", "),
    "confidence adalah tingkat keyakinan 0 sampai 1.",
    "indicators berisi 2-5 ciri visual singkat (Bahasa Indonesia) yang mendukung kesimpulan.",
  ];
  if (input.notes && input.notes.trim()) {
    lines.push(`Catatan dari pelapor: ${input.notes.trim()}`);
  }
  const lokasi: string[] = [];
  if (input.locationLabel) lokasi.push(input.locationLabel);
  if (input.kelurahan) lokasi.push(`Kelurahan ${input.kelurahan}`);
  if (input.lat != null && input.lng != null) {
    lokasi.push(`koordinat ${input.lat}, ${input.lng}`);
  }
  if (lokasi.length) {
    lines.push(`Lokasi: ${lokasi.join(" - ")}`);
  }
  return lines.join("\n");
}

function buildChecklist(type: PollutionType, severity: string): ChecklistItem[] {
  const rec: Recommendations = KNOWLEDGE_BASE[type];
  const labels = [...rec.hariIni];
  if (severity === "berat") labels.push(...rec.mingguan);
  return labels.map((label) => ({
    id: crypto.randomUUID(),
    label,
    done: false,
  }));
}

function fallbackSummary(
  type: PollutionType,
  severity: string,
  indicators: string[]
): string {
  const label = POLLUTION_LABELS[type];
  const sev = SEVERITY_LABELS[severity as keyof typeof SEVERITY_LABELS] ?? severity;
  const ciri = indicators.slice(0, 3).join(", ");
  const dasar = ciri ? ` Ciri yang teramati antara lain: ${ciri}.` : "";
  return `Hasil analisis menunjukkan indikasi ${label} dengan tingkat keparahan ${sev}.${dasar}`;
}

async function buildSummary(
  type: PollutionType,
  severity: string,
  indicators: string[]
): Promise<string> {
  try {
    const raw = await llmChat([
      {
        role: "system",
        content:
          "Anda menulis ringkasan singkat berbahasa Indonesia untuk laporan pencemaran sungai. Tulis 1-2 kalimat, lugas, tanpa daftar.",
      },
      {
        role: "user",
        content: [
          `Jenis pencemaran: ${POLLUTION_LABELS[type]} (${type}).`,
          `Tingkat keparahan: ${severity}.`,
          indicators.length
            ? `Ciri visual: ${indicators.join(", ")}.`
            : "Ciri visual tidak terinci.",
          "Buat narasi 1-2 kalimat yang merangkum kondisi ini untuk warga.",
        ].join("\n"),
      },
    ]);
    const text = (raw ?? "").trim();
    if (text) return text;
    return fallbackSummary(type, severity, indicators);
  } catch {
    return fallbackSummary(type, severity, indicators);
  }
}

export async function analyzeImage(input: AnalyzeInput): Promise<AnalyzeResult> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: buildUserText(input) },
        {
          type: "image_url",
          image_url: {
            url: `data:${input.mimeType};base64,${input.imageBase64}`,
          },
        },
      ],
    },
  ];

  const raw = await visionChat(messages);
  let parsed: VisionJson = {};
  try {
    parsed = extractJson<VisionJson>(raw);
  } catch {
    parsed = {};
  }

  const pollutionType = normalizeType(parsed.pollutionType);
  const confidence = clamp(
    typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
      ? parsed.confidence
      : 0.5,
    0,
    1
  );
  const indicators = Array.isArray(parsed.indicators)
    ? parsed.indicators.filter((i): i is string => typeof i === "string").slice(0, 5)
    : [];

  const severity = deriveSeverity(pollutionType, confidence);
  const waterScore = computeWaterScore(pollutionType, severity, confidence);

  const recommendations = KNOWLEDGE_BASE[pollutionType];
  const checklist = buildChecklist(pollutionType, severity);
  const summary = await buildSummary(pollutionType, severity, indicators);

  const created = await prisma.report.create({
    data: {
      imageUrl: null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      locationLabel: input.locationLabel ?? null,
      kelurahan: input.kelurahan ?? null,
      pollutionType,
      confidence,
      severity,
      waterScore,
      summary,
      recommendations: JSON.stringify(recommendations),
      checklist: JSON.stringify(checklist),
      agencies: JSON.stringify(recommendations.instansi),
    },
  });

  return {
    id: created.id,
    createdAt: created.createdAt.toISOString(),
    imageUrl: created.imageUrl,
    lat: created.lat,
    lng: created.lng,
    locationLabel: created.locationLabel,
    kelurahan: created.kelurahan,
    pollutionType,
    confidence,
    severity,
    waterScore,
    indicators,
    summary,
    recommendations,
    checklist,
  };
}
