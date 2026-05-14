import { NextResponse } from "next/server";
import { activeTornadoes } from "@/lib/nws";

export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  try {
    const alerts = await activeTornadoes();
    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      count: alerts.length,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "tornado feed failed" }, { status: 502 });
  }
}
