import "server-only";
import { prisma } from "./prisma";
import type { Hotspot, PollutionType, Severity } from "./types";

const SEVERITY_RANK: Record<Severity, number> = {
  ringan: 1,
  sedang: 2,
  berat: 3,
};

export async function getHotspots(): Promise<Hotspot[]> {
  const reports = await prisma.report.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
    },
    select: {
      kelurahan: true,
      lat: true,
      lng: true,
      waterScore: true,
      severity: true,
      pollutionType: true,
    },
  });

  const groups = new Map<
    string,
    {
      latSum: number;
      lngSum: number;
      count: number;
      scoreSum: number;
      worstSeverity: Severity;
      typeCount: Map<string, number>;
    }
  >();

  for (const report of reports) {
    if (report.lat === null || report.lng === null) continue;
    const key = report.kelurahan?.trim() || "Tak Diketahui";
    let group = groups.get(key);
    if (!group) {
      group = {
        latSum: 0,
        lngSum: 0,
        count: 0,
        scoreSum: 0,
        worstSeverity: "ringan",
        typeCount: new Map(),
      };
      groups.set(key, group);
    }
    group.latSum += report.lat;
    group.lngSum += report.lng;
    group.count += 1;
    group.scoreSum += report.waterScore;

    const severity = report.severity as Severity;
    if (SEVERITY_RANK[severity] > SEVERITY_RANK[group.worstSeverity]) {
      group.worstSeverity = severity;
    }

    group.typeCount.set(
      report.pollutionType,
      (group.typeCount.get(report.pollutionType) ?? 0) + 1
    );
  }

  const hotspots: Hotspot[] = [];
  for (const [kelurahan, group] of groups) {
    let dominantType = "normal";
    let dominantCount = -1;
    for (const [type, count] of group.typeCount) {
      if (count > dominantCount) {
        dominantType = type;
        dominantCount = count;
      }
    }
    hotspots.push({
      kelurahan,
      lat: group.latSum / group.count,
      lng: group.lngSum / group.count,
      count: group.count,
      avgWaterScore: Math.round(group.scoreSum / group.count),
      worstSeverity: group.worstSeverity,
      dominantType: dominantType as PollutionType,
    });
  }

  return hotspots;
}
