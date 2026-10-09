import "server-only";

import { prisma } from "./prisma";

export interface ImpactStats {
  totalLaporan: number;
  kelurahan: number;
  avgScore: number;
  checklistSelesai: number;
}

function countDone(raw: string | null): number {
  if (!raw) return 0;
  try {
    const arr = JSON.parse(raw) as Array<{ done?: boolean }>;
    if (!Array.isArray(arr)) return 0;
    return arr.filter((i) => i?.done).length;
  } catch {
    return 0;
  }
}

export async function getImpactStats(): Promise<ImpactStats> {
  const reports = await prisma.report.findMany({
    select: { kelurahan: true, waterScore: true, checklist: true },
  });

  const totalLaporan = reports.length;
  const kelurahanSet = new Set(
    reports.map((r) => r.kelurahan).filter((k): k is string => Boolean(k))
  );
  const avgScore =
    totalLaporan > 0
      ? Math.round(
          reports.reduce((acc, r) => acc + r.waterScore, 0) / totalLaporan
        )
      : 0;
  const checklistSelesai = reports.reduce(
    (acc, r) => acc + countDone(r.checklist),
    0
  );

  return {
    totalLaporan,
    kelurahan: kelurahanSet.size,
    avgScore,
    checklistSelesai,
  };
}
