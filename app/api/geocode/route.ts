import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/weather";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ results: [] });
  try {
    const results = await geocode(q);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "geocode failed" }, { status: 502 });
  }
}
