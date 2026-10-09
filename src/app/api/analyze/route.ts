import { analyzeImage } from "@/lib/analyze";
import type { AnalyzeInput } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeInput>;

    if (!body?.imageBase64) {
      return Response.json(
        { error: "imageBase64 wajib diisi" },
        { status: 400 }
      );
    }

    const input: AnalyzeInput = {
      imageBase64: body.imageBase64,
      mimeType: body.mimeType ?? "image/jpeg",
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      locationLabel: body.locationLabel ?? null,
      kelurahan: body.kelurahan ?? null,
      notes: body.notes ?? null,
    };

    const result = await analyzeImage(input);
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
    return Response.json({ error: message }, { status: 500 });
  }
}
