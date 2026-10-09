import type { PollutionType, Recommendations, Severity, Instansi } from "./types";

const DINAS_LINGKUNGAN: Instansi = {
  nama: "Dinas Lingkungan Hidup setempat",
  kontak: "Lapor via kanal pengaduan DLH kota/kabupaten (mis. 112 / aplikasi pengaduan daerah)",
  alasan: "Berwenang menindak pencemaran dan melakukan pengawasan kualitas air.",
};

const PDAM: Instansi = {
  nama: "PDAM / penyedia air bersih",
  kontak: "Hubungi call center PDAM setempat",
  alasan: "Perlu memberi tahu potensi gangguan kualitas air baku.",
};

const SATPOL_PP: Instansi = {
  nama: "Satpol PP / aparat kelurahan",
  kontak: "Hubungi kantor kelurahan atau 112",
  alasan: "Untuk penertiban pembuangan sampah/limbah liar di bantaran.",
};

export const KNOWLEDGE_BASE: Record<PollutionType, Recommendations> = {
  keruh_sedimen: {
    hariIni: [
      "Dokumentasikan foto air dari beberapa sudut sebagai bukti.",
      "Hindari penggunaan air sungai untuk mandi, mencuci, atau memasak.",
      "Cek apakah ada aktivitas pengerukan atau galian tanah di sekitar aliran.",
    ],
    mingguan: [
      "Buat lubang atau kolam pengendap sederhana sebelum air masuk ke sungai.",
      "Tanam vegetasi penahan erosi di sepanjang tepi sungai.",
      "Lapor ke dinas jika kekeruhan berasal dari proyek/tambang di hulu.",
    ],
    bulanan: [
      "Ikut gotong royong penghijauan bantaran sungai (penanaman pohon).",
      "Pantau dan catat tingkat kekeruhan secara berkala sebagai data warga.",
      "Edukasi tetangga agar tidak membuang tanah/galian ke aliran air.",
    ],
    instansi: [DINAS_LINGKUNGAN],
  },
  sampah_domestik: {
    hariIni: [
      "Ambil dan pisahkan sampah yang menumpuk di permukaan sungai.",
      "Siapkan jaring/keranjang penangkap sampah di titik yang mudah dijangkau.",
      "Hindari membakar sampah plastik; kumpulkan untuk dibuang ke TPS.",
    ],
    mingguan: [
      "Adakan kerja bakti bersih sungai bersama warga RT/RW.",
      "Aktifkan bank sampah di lingkungan sekitar.",
      "Pasang papan imbauan 'Dilarang Buang Sampah ke Sungai'.",
    ],
    bulanan: [
      "Sediakan tempat sampah terpilah di titik rawan pembuangan.",
      "Jadwalkan pengangkutan sampah rutin bersama kelurahan.",
      "Program edukasi pengurangan plastik sekali pakai untuk warga.",
    ],
    instansi: [SATPOL_PP, DINAS_LINGKUNGAN],
  },
  berbusa_kimia: {
    hariIni: [
      "Jangan menyentuh air berbusa tanpa sarung tangan; jauhkan anak-anak.",
      "Catat lokasi, waktu, dan ciri busa (warna, bau) sebagai bukti.",
      "Cari sumber buangan (saluran pabrik/usaha) di sekitar titik busa.",
    ],
    mingguan: [
      "Laporkan dugaan limbah kimia ke DLH agar diuji laboratorium.",
      "Hentikan sementara penggunaan air hilir untuk kebutuhan rumah tangga.",
      "Pasang penghalang sementara agar busa tidak menyebar lebih jauh.",
    ],
    bulanan: [
      "Dorong pengawasan izin pembuangan limbah industri setempat.",
      "Minta pemasangan IPAL (instalasi pengolahan air limbah) bagi usaha terkait.",
      "Ajak komunitas melakukan pemantauan kualitas air berkala.",
    ],
    instansi: [DINAS_LINGKUNGAN, PDAM],
  },
  alga_eutrofikasi: {
    hariIni: [
      "Jangan mengonsumsi ikan yang mati mengapung di area alga.",
      "Hindari kontak langsung dengan air berwarna hijau pekat.",
      "Catat luas area yang tertutup alga sebagai data.",
    ],
    mingguan: [
      "Kurangi pembuangan deterjen dan pupuk berlebih ke saluran air.",
      "Angkat sebagian alga secara manual agar tidak membusuk massal.",
      "Perbaiki drainase agar air tidak menggenang dan kaya nutrisi.",
    ],
    bulanan: [
      "Tanam tanaman penyerap nutrisi (mis. eceng gondok terkendali) atau restorasi vegetasi.",
      "Kendalikan pencemaran pupuk dari lahan pertanian sekitar.",
      "Pantau kadar hara (nitrogen/fosfor) air secara berkala.",
    ],
    instansi: [DINAS_LINGKUNGAN],
  },
  limbah_minyak: {
    hariIni: [
      "Jangan membuang minyak; tabur bahan penyerap (pasir/serbuk) di permukaan.",
      "Jauhkan sumber api—minyak di air mudah terbakar.",
      "Jangan gunakan air untuk mencucikan peralatan berminyak ke saluran.",
    ],
    mingguan: [
      "Pasang grease trap sederhana di dapur rumah/usaha.",
      "Kumpulkan minyak jelantah untuk ditukar ke pengepul/biodiesel.",
      "Bersihkan sisa lapisan minyak dengan alat penyerap.",
    ],
    bulanan: [
      "Sosialisasikan pengelolaan minyak jelantah ke warga dan warung.",
      "Buat program pengepulan minyak jelantah rutin.",
      "Lapor ke dinas jika sumber minyak berasal dari bengkel/industri.",
    ],
    instansi: [DINAS_LINGKUNGAN, SATPOL_PP],
  },
  normal: {
    hariIni: [
      "Pertahankan kebersihan—jangan buang sampah atau limbah ke sungai.",
      "Dokumentasikan kondisi baik sebagai data pemantauan warga.",
    ],
    mingguan: [
      "Lanjutkan gotong royong pembersihan bantaran secara berkala.",
      "Pantau agar tidak muncul sumber pencemaran baru.",
    ],
    bulanan: [
      "Jaga program bank sampah dan edukasi lingkungan tetap berjalan.",
      "Bagikan kondisi sungai yang sehat untuk menginspirasi wilayah lain.",
    ],
    instansi: [],
  },
};

export const SEVERITY_ACTION_PREFIX: Record<Severity, string> = {
  ringan: "Pantau dan lakukan pencegahan dini:",
  sedang: "Perlu tindakan segera dalam minggu ini:",
  berat: "Kondisi darurat—tindakan cepat dan pelaporan resmi diperlukan:",
};
