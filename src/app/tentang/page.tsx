import type { PollutionType } from "@/lib/types";
import { POLLUTION_LABELS } from "@/lib/types";
import { PollutionIcon } from "@/components/illustrations/pollution-icon";

const KATEGORI: { type: PollutionType; desc: string }[] = [
  { type: "keruh_sedimen", desc: "Air keruh pekat, banyak lumpur/sedimen tersuspensi." },
  { type: "sampah_domestik", desc: "Sampah plastik dan limbah padat mengapung." },
  { type: "berbusa_kimia", desc: "Permukaan berbusa, indikasi limbah kimia atau deterjen." },
  { type: "alga_eutrofikasi", desc: "Air kehijauan pekat, lapisan alga (blooming)." },
  { type: "limbah_minyak", desc: "Lapisan minyak dengan kilap pelangi di permukaan." },
  { type: "normal", desc: "Air relatif jernih tanpa tanda pencemaran." },
];

const LANGKAH = [
  {
    n: "01",
    judul: "Warga memotret",
    isi: "Unggah foto permukaan sungai lengkap dengan lokasi. Tidak perlu alat khusus, cukup kamera ponsel.",
  },
  {
    n: "02",
    judul: "AI menganalisis",
    isi: "Model visi membaca citra untuk mengenali jenis pencemaran, tingkat keyakinan, dan tingkat keparahan.",
  },
  {
    n: "03",
    judul: "Terima solusi",
    isi: "Dapatkan skor kualitas air, ringkasan kondisi, serta langkah harian, mingguan, dan bulanan beserta instansi yang bisa dihubungi.",
  },
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="border-b border-line pb-6">
        <span className="tabular text-xs font-semibold uppercase tracking-widest text-accent">
          Tentang
        </span>
        <h1 className="display mt-1 text-3xl font-bold sm:text-4xl">SungaiMata</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Kanal warga untuk memantau kondisi air sungai secara cepat dan
          sederhana, lalu mengubah temuan menjadi tindakan nyata.
        </p>
      </header>

      <div className="divide-y divide-line">
        <section className="py-8">
          <h2 className="text-lg font-semibold">Masalah</h2>
          <p className="mt-2 text-muted">
            Pencemaran sungai sering tidak terdeteksi sejak dini. Warga melihat
            air keruh, sampah menumpuk, atau busa di permukaan, tetapi tidak tahu
            seberapa parah dampaknya dan harus melapor ke siapa. Akibatnya,
            penanganan terlambat dan sumber pencemaran terus berlanjut.
          </p>
        </section>

        <section className="py-8">
          <h2 className="text-lg font-semibold">Solusi</h2>
          <p className="mt-2 text-muted">
            SungaiMata memakai kecerdasan buatan untuk membaca foto sungai,
            mengklasifikasikan jenis pencemaran, menilai tingkat keparahan, dan
            menyusun rekomendasi tindakan yang membumi. Laporan warga juga
            dipetakan sebagai titik panas (hotspot) agar prioritas penanganan
            wilayah lebih jelas.
          </p>
        </section>

        <section className="py-8">
          <h2 className="text-lg font-semibold">Cara kerja</h2>
          <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {LANGKAH.map((l) => (
              <div key={l.n} className="bg-background p-5">
                <p className="tabular text-sm font-semibold text-accent">{l.n}</p>
                <p className="mt-1 font-semibold">{l.judul}</p>
                <p className="mt-1 text-sm text-muted">{l.isi}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-lg font-semibold">Kategori pencemaran</h2>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {KATEGORI.map((k) => (
              <li key={k.type} className="flex gap-3 bg-background p-4">
                <span className="mt-0.5 text-accent">
                  <PollutionIcon type={k.type} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{POLLUTION_LABELS[k.type]}</p>
                  <p className="mt-0.5 text-sm text-muted">{k.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-8">
          <div className="rounded-2xl border-l-2 border-warn bg-surface-2 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-warn">
              Disclaimer
            </h2>
            <p className="mt-2 text-sm text-muted">
              Hasil analisis AI bersifat indikatif dan tidak menggantikan
              pengujian laboratorium atau penilaian resmi instansi lingkungan.
              Selalu utamakan keselamatan dan gunakan hasil ini sebagai panduan
              awal untuk melapor dan bertindak.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
