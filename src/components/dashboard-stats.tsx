import type { Hotspot } from "@/lib/types";
import { POLLUTION_LABELS, SEVERITY_LABELS } from "@/lib/types";

function tone(score: number): string {
  if (score >= 70) return "text-ok";
  if (score >= 45) return "text-warn";
  return "text-danger";
}

export function DashboardStats({ hotspots }: { hotspots: Hotspot[] }) {
  const totalLaporan = hotspots.reduce((acc, h) => acc + h.count, 0);
  const jumlahKelurahan = hotspots.length;
  const rataSkor =
    hotspots.length > 0
      ? Math.round(
          hotspots.reduce((acc, h) => acc + h.avgWaterScore * h.count, 0) /
            Math.max(totalLaporan, 1)
        )
      : 0;

  const kritis = [...hotspots]
    .sort((a, b) => a.avgWaterScore - b.avgWaterScore)
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        <div className="bg-background p-5">
          <p className="text-sm text-muted">Total laporan</p>
          <p className="tabular mt-1 text-3xl font-bold">{totalLaporan}</p>
        </div>
        <div className="bg-background p-5">
          <p className="text-sm text-muted">Kelurahan terpantau</p>
          <p className="tabular mt-1 text-3xl font-bold">{jumlahKelurahan}</p>
        </div>
        <div className="bg-background p-5">
          <p className="text-sm text-muted">Rata-rata skor air</p>
          <p className={`tabular mt-1 text-3xl font-bold ${tone(rataSkor)}`}>
            {rataSkor}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-background p-5">
        <h3 className="font-semibold">Titik paling kritis</h3>
        {kritis.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Belum ada data laporan.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {kritis.map((h) => (
              <li
                key={h.kelurahan}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <p className="font-medium">{h.kelurahan}</p>
                  <p className="text-sm text-muted">
                    {h.count} laporan · {POLLUTION_LABELS[h.dominantType]} ·{" "}
                    {SEVERITY_LABELS[h.worstSeverity]}
                  </p>
                </div>
                <span
                  className={`tabular rounded-full border border-line px-3 py-1 text-sm font-semibold ${tone(
                    h.avgWaterScore
                  )}`}
                >
                  Skor {h.avgWaterScore}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ok" /> Baik (≥70)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-warn" /> Perlu perhatian
            (45–69)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" /> Kritis (&lt;45)
          </span>
        </div>
      </div>
    </section>
  );
}
