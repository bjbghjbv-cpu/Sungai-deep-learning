import { getReport } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/reports/[id]">,
) {
  const { id } = await ctx.params;
  const report = await getReport(id);
  if (!report) {
    return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }
  return Response.json(report);
}
