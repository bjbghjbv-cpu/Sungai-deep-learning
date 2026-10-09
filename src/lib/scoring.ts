import type { PollutionType, Severity } from "./types";

const BASE_SCORE: Record<PollutionType, number> = {
  normal: 90,
  keruh_sedimen: 55,
  sampah_domestik: 45,
  alga_eutrofikasi: 50,
  limbah_minyak: 40,
  berbusa_kimia: 25,
};

const SEVERITY_DELTA: Record<Severity, number> = {
  ringan: 10,
  sedang: 0,
  berat: -15,
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function computeWaterScore(
  type: PollutionType,
  severity: Severity,
  confidence: number
): number {
  const base = BASE_SCORE[type] ?? 50;
  const confAdj = (clamp(confidence, 0, 1) - 0.5) * 6;
  return Math.round(clamp(base + SEVERITY_DELTA[severity] + confAdj));
}

export function deriveSeverity(type: PollutionType, confidence: number): Severity {
  const risky: PollutionType[] = ["berbusa_kimia", "limbah_minyak"];
  if (type === "normal") return "ringan";
  if (risky.includes(type)) return confidence >= 0.5 ? "berat" : "sedang";
  if (confidence >= 0.75) return "sedang";
  return "ringan";
}

export function normalizeType(raw: string | undefined): PollutionType {
  const allowed: PollutionType[] = [
    "keruh_sedimen",
    "sampah_domestik",
    "berbusa_kimia",
    "alga_eutrofikasi",
    "limbah_minyak",
    "normal",
  ];
  if (raw && allowed.includes(raw as PollutionType)) return raw as PollutionType;
  return "normal";
}
