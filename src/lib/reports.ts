import "server-only";
import type { Report } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  AnalyzeResult,
  ChecklistItem,
  PollutionType,
  Recommendations,
  ReportListItem,
  Severity,
} from "@/lib/types";

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toAnalyzeResult(row: Report): AnalyzeResult {
  const recommendations = parseJson<Recommendations>(row.recommendations, {
    hariIni: [],
    mingguan: [],
    bulanan: [],
    instansi: [],
  });
  const checklist = parseJson<ChecklistItem[]>(row.checklist, []);

  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    imageUrl: row.imageUrl,
    lat: row.lat,
    lng: row.lng,
    locationLabel: row.locationLabel,
    kelurahan: row.kelurahan,
    pollutionType: row.pollutionType as PollutionType,
    confidence: row.confidence,
    severity: row.severity as Severity,
    waterScore: row.waterScore,
    summary: row.summary ?? "",
    indicators: [],
    recommendations,
    checklist,
  };
}

export async function listReports(): Promise<ReportListItem[]> {
  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    pollutionType: row.pollutionType as PollutionType,
    severity: row.severity as Severity,
    waterScore: row.waterScore,
    kelurahan: row.kelurahan,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
  }));
}

export async function getReport(id: string): Promise<AnalyzeResult | null> {
  const row = await prisma.report.findUnique({ where: { id } });
  if (!row) return null;
  return toAnalyzeResult(row);
}

export async function toggleChecklist(
  id: string,
  itemId: string,
  done: boolean,
): Promise<ChecklistItem[]> {
  const row = await prisma.report.findUnique({ where: { id } });
  if (!row) throw new Error("NOT_FOUND");

  const checklist = parseJson<ChecklistItem[]>(row.checklist, []);
  const updated = checklist.map((item) =>
    item.id === itemId ? { ...item, done } : item,
  );

  await prisma.report.update({
    where: { id },
    data: { checklist: JSON.stringify(updated) },
  });

  return updated;
}
