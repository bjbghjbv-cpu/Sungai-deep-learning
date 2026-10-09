import { getHotspots } from "@/lib/hotspots";

export const runtime = "nodejs";

export async function GET() {
  const hotspots = await getHotspots();
  return Response.json({ hotspots });
}
