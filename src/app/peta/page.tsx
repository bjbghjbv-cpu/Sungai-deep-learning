import { getHotspots } from "@/lib/hotspots";
import { DashboardStats } from "@/components/dashboard-stats";
import { MapView } from "@/components/map-view";

export const dynamic = "force-dynamic";

export default async function PetaPage() {
  const hotspots = await getHotspots();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <header className="space-y-2 border-b border-line pb-6">
        <span className="tabular text-xs font-semibold uppercase tracking-widest text-accent">
          Dashboard
        </span>
        <h1 className="display text-3xl font-bold sm:text-4xl">Peta & data</h1>
        <p className="max-w-2xl text-muted">
          Titik-titik pencemaran sungai berdasarkan laporan warga. Ukuran
          lingkaran menunjukkan jumlah laporan, sedangkan warnanya mencerminkan
          rata-rata skor air di tiap kelurahan—semakin merah, semakin kritis.
        </p>
      </header>

      <DashboardStats hotspots={hotspots} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sebaran titik pantau</h2>
        <MapView hotspots={hotspots} />
      </section>
    </div>
  );
}
