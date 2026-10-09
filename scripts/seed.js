const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const RECOMMENDATIONS = {
  hariIni: ["Dokumentasikan titik pencemaran", "Hindari kontak langsung dengan air"],
  mingguan: ["Bersihkan sampah di sekitar aliran", "Laporkan ke kelurahan setempat"],
  bulanan: ["Pantau kualitas air secara berkala", "Sosialisasi warga bantaran sungai"],
  instansi: [
    {
      nama: "Dinas Lingkungan Hidup",
      kontak: "dlh@kotaku.go.id",
      alasan: "Penanganan pencemaran air skala kota",
    },
  ],
};

const CHECKLIST = [
  { id: "c1", label: "Foto kondisi air terbaru", done: false },
  { id: "c2", label: "Catat koordinat lokasi", done: false },
  { id: "c3", label: "Laporkan ke instansi terkait", done: false },
];

const REPORTS = [
  {
    kelurahan: "Sukamaju",
    lat: -6.9147,
    lng: 107.6098,
    locationLabel: "Sungai Cikapundung - Sukamaju",
    pollutionType: "sampah_domestik",
    confidence: 0.82,
    severity: "sedang",
    waterScore: 45,
    summary: "Tumpukan sampah domestik menghambat aliran sungai.",
    status: "baru",
  },
  {
    kelurahan: "Sukamaju",
    lat: -6.9162,
    lng: 107.6112,
    locationLabel: "Saluran Sukamaju",
    pollutionType: "keruh_sedimen",
    confidence: 0.71,
    severity: "sedang",
    waterScore: 51,
    summary: "Air keruh dengan endapan sedimen tinggi.",
    status: "diproses",
  },
  {
    kelurahan: "Babakan",
    lat: -6.9051,
    lng: 107.6203,
    locationLabel: "Sungai Babakan",
    pollutionType: "berbusa_kimia",
    confidence: 0.88,
    severity: "berat",
    waterScore: 25,
    summary: "Busa putih menandakan limbah kimia rumah tangga.",
    status: "baru",
  },
  {
    kelurahan: "Babakan",
    lat: -6.9039,
    lng: 107.6188,
    locationLabel: "Anak Sungai Babakan",
    pollutionType: "berbusa_kimia",
    confidence: 0.79,
    severity: "berat",
    waterScore: 28,
    summary: "Busa dan bau menyengat di permukaan air.",
    status: "baru",
  },
  {
    kelurahan: "Cipaganti",
    lat: -6.8951,
    lng: 107.6042,
    locationLabel: "Kolam Cipaganti",
    pollutionType: "alga_eutrofikasi",
    confidence: 0.68,
    severity: "sedang",
    waterScore: 48,
    summary: "Permukaan air tertutup alga hijau.",
    status: "diproses",
  },
  {
    kelurahan: "Dago",
    lat: -6.8874,
    lng: 107.6132,
    locationLabel: "Sungai Dago",
    pollutionType: "limbah_minyak",
    confidence: 0.74,
    severity: "berat",
    waterScore: 37,
    summary: "Lapisan minyak terlihat di permukaan sungai.",
    status: "baru",
  },
];

async function main() {
  await prisma.report.deleteMany();

  for (const report of REPORTS) {
    await prisma.report.create({
      data: {
        kelurahan: report.kelurahan,
        lat: report.lat,
        lng: report.lng,
        locationLabel: report.locationLabel,
        pollutionType: report.pollutionType,
        confidence: report.confidence,
        severity: report.severity,
        waterScore: report.waterScore,
        summary: report.summary,
        recommendations: JSON.stringify(RECOMMENDATIONS),
        checklist: JSON.stringify(CHECKLIST),
        agencies: JSON.stringify(RECOMMENDATIONS.instansi),
        status: report.status,
      },
    });
  }

  const count = await prisma.report.count();
  console.log(`Seed selesai: ${count} report dibuat.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
