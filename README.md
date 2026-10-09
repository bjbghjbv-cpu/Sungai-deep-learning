# 🌊 SungaiMata — Sistem Pemantauan Pencemaran Sungai Berbasis AI

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **📷 Analisis Foto AI** | Upload foto permukaan air → Vision model (GPT-5.6) klasifikasi 6 jenis pencemaran: *keruh_sedimen, sampah_domestik, berbusa_kimia, alga_eutrofikasi, limbah_minyak, normal* |
| **📍 Peta Hotspot Interaktif** | Leaflet + OpenStreetMap (gratis, no API key). Lingkaran = jumlah laporan, Warna = rata-rata skor kualitas air (hijau→orange→merah) |
| **📊 Dashboard Statistik** | Total laporan, kelurahan terpantau, rata-rata skor air, checklist tindakan selesai |
| **🤖 Skor Kualitas Air Otomatis** | Algoritma scoring berbasis jenis pencemaran + keparahan + confidence AI (0–100) |
| **📋 Rekomendasi & Checklist** | Tindakan harian/mingguan/bulanan + instansi terkait (DLH, KLHK, PDAM, dll) per jenis pencemaran |
| **💾 Penyimpanan Data** | Prisma ORM + SQLite (dev) / PostgreSQL (prod). Riwayat laporan lengkap dengan metadata lokasi & waktu |

---

## 🏗️ Arsitektur Teknis

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Next.js 16     │────▶│  /api/analyze    │────▶│  Relink Gateway     │
│  (App Router)   │     │  (Server Action) │     │  • Vision: gpt-5.6  │
└─────────────────┘     └──────────────────┘     │  • LLM: deepseek-v4 │
       ▲                       │                 └─────────────────────┘
       │                       ▼
       │              ┌──────────────────┐
       │              │  Prisma + SQLite │
       │              │  (Report, Stats) │
       │              └──────────────────┘
       │
       ▼
┌─────────────────┐
│  Leaflet Map    │
│  (Client Comp)  │
└─────────────────┘
```

**Stack:**
- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Runtime:** React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 (+ CSS variables theming)
- **Map:** Leaflet 1.9 + OpenStreetMap tiles
- **Database:** Prisma 6 + SQLite (dev) / PostgreSQL (prod)
- **AI Gateway:** Relink Gateway (OpenAI-compatible API)
- **Validation:** Zod

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone  https://github.com/bjbghjbv-cpu/Sungai-deep-learning.git
cd C:\namafolder\Sungai-deep-learning
npm install
```

### 2. Environment Variables
Buat file `.env.local` di root project:
```env
# Wajib: API Key Relink Gateway (Dapatkan dari penyedia layanan)
RELINK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
RELINK_BASE_URL=https://api.relink-gateway.biz.id/v1

# Opsional (sudah ada default)
VISION_MODEL=gpt-5.6
LLM_MODEL=deepseek-v4-pro

# Database (default: SQLite file di prisma/dev.db)
DATABASE_URL="file:./dev.db"
```

### 3. Setup Database
```bash
'DATABASE_URL="file:./dev.db"' | Out-File -Encoding utf8 .env
type .env harus ada DATABASE_URL="file:./dev.db"
npx prisma generate
npx prisma db push
npm run seed          # Optional: isi data dummy
```

### 4. Run Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Project (Ringkas)

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # POST: analisis foto → AI → simpan DB
│   │   ├── hotspots/route.ts     # GET: data agregat per kelurahan untuk peta
│   │   └── reports/              # CRUD laporan + checklist
│   ├── peta/page.tsx             # Halaman peta hotspot
│   ├── tentang/page.tsx          # Info project
│   └── page.tsx                  # Landing + UploadScanner
├── components/
│   ├── upload-scanner.tsx        # Form upload foto + lokasi + kirim ke /api/analyze
│   ├── hotspot-map.tsx           # Leaflet map (client-side)
│   ├── map-view.tsx              # Wrapper dynamic import (no SSR)
│   ├── result-card.tsx           # Tampilkan hasil analisis + checklist
│   └── dashboard-stats.tsx       # Kartu statistik
├── lib/
│   ├── analyze.ts                # Orchestrasi: visionChat → scoring → summary → DB
│   ├── gateway.ts                # Client Relink Gateway (chat/completions)
│   ├── scoring.ts                # Algoritma waterScore, severity, confidence
│   ├── hotspots.ts               # Agregasi laporan per kelurahan
│   ├── knowledge-base.ts         # Rekomendasi per jenis pencemaran
│   ├── types.ts                  # TypeScript types (Hotspot, Report, dll)
│   ├── prisma.ts                 # Prisma singleton
│   └── impact.ts                 # Statistik dashboard
└── prisma/schema.prisma          # Schema DB
```

---

## 🧠 Alur Analisis AI

1. **Vision Prompt** → Foto + system prompt 6 kategori → Output JSON: `{pollutionType, confidence, indicators[]}`
2. **Normalisasi** → Map ke enum `PollutionType` valid, clamp confidence 0–1
3. **Scoring** → `computeWaterScore(type, severity, confidence)` → 0–100
4. **Severity** → `deriveSeverity(type, confidence)` → `ringan/sedang/berat`
5. **LLM Summary** → Ringkasan naratif 1–2 kalimat untuk warga (fallback ke template kalau gagal)
6. **Simpan DB** → `prisma.report.create()` + checklist + rekomendasi
7. **Return** → `AnalyzeResult` ke frontend

---

## 🗺️ Peta Hotspot

- **Tile Layer:** OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) — **gratis, no API key**
- **Agregasi:** `getHotspots()` group by `kelurahan` → rata-rata lat/lng, count, avg score, dominant type, worst severity
- **Marker:** `L.circleMarker` radius ∝ jumlah laporan, color ∝ avgWaterScore
- **Popup:** Detail kelurahan, jumlah laporan, skor rata-rata, jenis dominan, tingkat terburuk

---

## 📝 Schema Database (Prisma)

```prisma
model Report {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  imageUrl        String?
  lat             Float?
  lng             Float?
  locationLabel   String?
  kelurahan       String?
  pollutionType   String   // enum slug
  confidence      Float
  severity        String   // ringan/sedang/berat
  waterScore      Int      // 0-100
  summary         String
  recommendations Json     // KnowledgeBase entry
  checklist       Json     // ChecklistItem[]
  agencies        Json     // String[]
}
```

---

## 🔧 Scripts

```bash
npm run dev        # Development server (Turbopack)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run seed       # Seed database dengan data dummy
npx prisma studio  # GUI database
```

---

## 🌍 Deployment

**Vercel (Recommended):**
1. Push ke GitHub
2. Import di Vercel → tambah `RELINK_API_KEY` di Environment Variables
3. Database: gunakan **Vercel Postgres** / **Neon** / **Supabase** → update `DATABASE_URL`
4. `prisma generate` otomatis di build

**Docker (Optional):**
```dockerfile
# Dockerfile.example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Kontribusi

1. Fork → buat branch `feature/nama-fitur`
2. Commit dengan pesan jelas (`feat:`, `fix:`, `docs:`, `refactor:`)
3. Pastikan `npm run lint` & `npm run build` lolos
4. Pull Request ke `main`

---

## 📄 Lisensi

MIT License — bebas gunakan, modifikasi, distribusi.

---

## 🙏 Acknowledgments

- **Relink Gateway** — AI inference hosting
- **OpenStreetMap & Contributors** — Tile map gratis
- **Leaflet** — Library peta ringan
- **Next.js Team** — Framework React full-stack
- **Prisma** — Type-safe database ORM

---

> **SungaiMata** — *Warga memantau, AI menganalisis, bersama memulihkan sungai.*
