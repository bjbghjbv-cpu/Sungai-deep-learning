import { listReports } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET() {
  const reports = await listReports();
  return Response.json({ reports });
}
