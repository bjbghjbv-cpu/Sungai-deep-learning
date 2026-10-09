import { UploadScanner } from "@/components/upload-scanner";
import { RiverHealthy } from "@/components/illustrations/river-healthy";
import { RiverPolluted } from "@/components/illustrations/river-polluted";
import { getImpactStats } from "@/lib/impact";

const steps = [
  {
    n: "01",
    title: "Foto sungai",
    desc: "Ambil atau unggah foto permukaan air di sekitarmu. Cukup dari ponsel.",
  },
  {
    n: "02",
    title: "Analisis AI",
    desc: "Sistem mengenali jenis pencemaran, tingkat keparahan, dan skor kualitas air.",
  },
  {
    n: "03",
    title: "Solusi nyata",
    desc: "Terima langkah harian, mingguan, bulanan, dan instansi yang bisa dihubungi.",
  },
];

export default async function Home() {
  const stats = await getImpactStats();

  const impact = [
    { label: "Laporan warga", value: stats.totalLaporan },
    { label: "Kelurahan terpantau", value: stats.kelurahan },
    { label: "Rata-rata skor air", value: stats.avgScore },
    { label: "Tindakan selesai", value: stats.checklistSelesai },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Warga memantau · AI menganalisis
          </span>
          <h1 className="display mt-5 text-4xl font-bold sm:text-6xl">
            Pindai sungai,
            <br />
            ketahui <span className="text-accent">solusinya</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Unggah satu foto sungai di sekitar Anda. SungaiMata mendiagnosis
            tingkat pencemaran dan memberi langkah nyata untuk memulihkan
            kebersihannya.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#pindai"
              className="rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Mulai pindai sungai
            </a>
            <a
              href="/peta"
              className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-2"
            >
              Lihat peta & data
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <figure className="space-y-2">
            <RiverHealthy className="w-full" />
            <figcaption className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-accent" /> Sungai sehat
            </figcaption>
          </figure>
          <figure className="space-y-2">
            <RiverPolluted className="w-full" />
            <figcaption className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-danger" /> Sungai tercemar
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {impact.map((s) => (
          <div key={s.label} className="bg-background p-6">
            <p className="tabular text-4xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="py-16">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-background p-6">
              <p className="tabular text-sm font-semibold text-accent">{s.n}</p>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pindai" className="scroll-mt-20 pb-20">
        <header className="mb-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Mulai pindai sungai</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Satu foto, satu lokasi. Sistem akan menampilkan diagnosis dan
            langkah tindakan yang bisa langsung dilakukan.
          </p>
        </header>
        <UploadScanner />
      </section>
    </div>
  );
}
