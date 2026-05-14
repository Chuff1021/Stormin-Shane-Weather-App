import { NextRequest, NextResponse } from "next/server";
import { del, list } from "@vercel/blob";
import { isShane } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isShane())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!id || /[^a-zA-Z0-9._-]/.test(id)) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }
  try {
    const { blobs } = await list({ prefix: `videos/${id}` });
    await Promise.all(blobs.map((b) => del(b.url)));
    return NextResponse.json({ deleted: blobs.length });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "delete failed" }, { status: 500 });
  }
}
