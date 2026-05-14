// Proxies the Spotter Network public spotters feed so the browser can avoid CORS.
// The endpoint returns the public JSON list of active spotters/chasers.
//
// SpotterNetwork publishes a public KML/JSON of active positions used by tools
// like RadarScope and GR2. We treat this as best-effort and fail soft.

import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 120;

const UA = "StorminShane/1.0 (https://stormin-shane-weather-app.vercel.app)";

// Endpoint can be overridden via env if SpotterNetwork rotates URLs.
const FEED_URL =
  process.env.SPOTTER_FEED_URL ||
  "https://www.spotternetwork.org/feeds/positions.txt";

type Chaser = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  callsign?: string;
  reportedAt?: string;
};

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": UA, Accept: "text/plain, application/json" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return NextResponse.json({ chasers: [] as Chaser[], note: "feed unavailable" });

    const text = await res.text();
    // The public positions.txt is line-oriented:
    // id|name|lat|lon|heading|speed|reported_at|callsign
    // Be defensive — fall through to empty if format changes.
    const chasers: Chaser[] = text
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#"))
      .map((line) => {
        const parts = line.split("|");
        const lat = Number(parts[2]);
        const lon = Number(parts[3]);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
        return {
          id: parts[0] || crypto.randomUUID(),
          name: parts[1] || "Unknown",
          lat,
          lon,
          callsign: parts[7],
          reportedAt: parts[6],
        } as Chaser;
      })
      .filter((x): x is Chaser => Boolean(x))
      .slice(0, 300);

    return NextResponse.json({ chasers, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ chasers: [] as Chaser[], note: "feed error" });
  }
}
