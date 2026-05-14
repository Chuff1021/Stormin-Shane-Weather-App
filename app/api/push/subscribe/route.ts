import { NextRequest, NextResponse } from "next/server";
import { idForEndpoint, isConfigured, upsert, type Subscriber } from "@/lib/subscriptions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Push not configured — attach Vercel Blob to enable." },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const subscription = body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys) {
    return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  }

  const id = idForEndpoint(subscription.endpoint);
  const now = new Date().toISOString();
  const sub: Subscriber = {
    id,
    subscription,
    lat: typeof body?.lat === "number" ? body.lat : undefined,
    lon: typeof body?.lon === "number" ? body.lon : undefined,
    label: body?.label,
    topics: {
      shaneVideos: body?.topics?.shaneVideos ?? true,
      tornadoAlerts: body?.topics?.tornadoAlerts ?? true,
    },
    createdAt: now,
    lastSeenAt: now,
  };

  await upsert(sub);
  return NextResponse.json({ ok: true, id });
}
