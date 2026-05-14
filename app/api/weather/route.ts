import { NextRequest, NextResponse } from "next/server";
import { forecast, airQuality, type Unit } from "@/lib/weather";
import { activeAlerts } from "@/lib/nws";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  const unit = (url.searchParams.get("unit") || "fahrenheit") as Unit;
  const label = url.searchParams.get("label") || "";

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  try {
    const [fc, aqi, alerts] = await Promise.all([
      forecast(lat, lon, unit),
      airQuality(lat, lon),
      activeAlerts({ point: { lat, lon } }),
    ]);
    return NextResponse.json({
      label,
      unit,
      lat,
      lon,
      updatedAt: new Date().toISOString(),
      forecast: fc,
      airQuality: aqi,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "weather failed" }, { status: 502 });
  }
}
