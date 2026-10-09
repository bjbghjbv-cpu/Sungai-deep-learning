import { toggleChecklist } from "@/lib/reports";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/reports/[id]/checklist">,
) {
  const { id } = await ctx.params;
  const body = (await request.json()) as { id?: string; done?: boolean };

  if (typeof body.id !== "string" || typeof body.done !== "boolean") {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  try {
    const checklist = await toggleChecklist(id, body.id, body.done);
    return Response.json({ checklist });
  } catch {
    return Response.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }
}
