# Kontrak Agen - SungaiMata

Stack: Next.js 16 (App Router, TS, Tailwind v4) + Prisma 6 (SQLite). UI Bahasa Indonesia.
Alias `@/*` -> `src/*`.

## Modul bersama (SUDAH ADA - jangan ubah, cukup impor)
- `@/lib/types` - PollutionType, Severity, Recommendations, ChecklistItem, VisionResult, AnalyzeResult, ReportListItem, Hotspot, AnalyzeInput, POLLUTION_LABELS, SEVERITY_LABELS.
- `@/lib/gateway` - visionChat(messages), llmChat(messages), extractJson<T>(raw). Server-only.
- `@/lib/prisma` - `prisma` (PrismaClient singleton). Server-only.
- `@/lib/scoring` - computeWaterScore, deriveSeverity, normalizeType.
- `@/lib/knowledge-base` - KNOWLEDGE_BASE, SEVERITY_ACTION_PREFIX.
- `@/components/site-nav` - navigasi (dipakai layout).

## Model DB (prisma/schema.prisma)
Report { id, createdAt, imageUrl?, lat?, lng?, locationLabel?, kelurahan?, pollutionType, confidence, severity, waterScore, summary?, recommendations(String JSON), checklist(String JSON), agencies(String JSON), status }
recommendations/checklist/agencies disimpan String JSON -> JSON.stringify / JSON.parse.

## Kontrak API (WAJIB sama lintas agen)
- POST /api/analyze - body AnalyzeInput {imageBase64, mimeType, lat?, lng?, locationLabel?, kelurahan?, notes?} -> AnalyzeResult
- GET  /api/reports -> { reports: ReportListItem[] }
- GET  /api/reports/[id] -> AnalyzeResult
- PATCH /api/reports/[id]/checklist - body {id, done} -> { checklist: ChecklistItem[] }
- GET  /api/hotspots -> { hotspots: Hotspot[] }

## Konvensi Route Handler Next 16
export async function GET(request: Request) {}
Context dinamis: `context: RouteContext<'/api/reports/[id]'>`, `const { id } = await ctx.params` (params Promise).
Return `Response.json(...)`. Handler tidak di-cache default. Set `export const runtime = "nodejs"` bila pakai Prisma.

## Kepemilikan file (JANGAN tulis file di luar daftar ini)
- Agen 1: src/lib/analyze.ts, src/app/api/analyze/route.ts
- Agen 2: src/app/api/reports/route.ts, src/app/api/reports/[id]/route.ts, src/app/api/reports/[id]/checklist/route.ts, src/lib/reports.ts
- Agen 3: src/lib/hotspots.ts, src/app/api/hotspots/route.ts, scripts/seed.ts
- Agen 4: src/app/page.tsx, src/components/upload-scanner.tsx, src/components/result-card.tsx
- Agen 5: src/app/peta/page.tsx, src/components/hotspot-map.tsx, src/components/dashboard-stats.tsx, src/app/tentang/page.tsx

## Definisi tipe penting
AnalyzeResult = { id, createdAt, imageUrl, lat, lng, locationLabel, kelurahan, pollutionType, confidence, severity, waterScore, summary, recommendations, checklist }
Hotspot = { kelurahan, lat, lng, count, avgWaterScore, worstSeverity, dominantType }
ChecklistItem = { id, label, done }

## Aturan
- TypeScript strict. Tanpa komentar berlebihan. Tanpa dependency baru.
- Semua teks UI Bahasa Indonesia.
- Import `@/lib/prisma` dan `@/lib/gateway` hanya di server (route handler / lib server).
- Verifikasi dengan `npx tsc --noEmit` bila memungkinkan.
