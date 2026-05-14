import { NextRequest, NextResponse } from "next/server";
import { login, logout } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.logout) {
    await logout();
    return NextResponse.json({ ok: true });
  }
  const ok = await login(String(body?.password || ""));
  if (!ok) return NextResponse.json({ error: "wrong password" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
