// National Weather Service API — api.weather.gov
// No key required. Requires a User-Agent header per their policy.

const BASE = "https://api.weather.gov";
const UA = "StorminShane/1.0 (https://stormin-shane-weather-app.vercel.app)";

export type NWSAlert = {
  id: string;
  event: string;
  severity: "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
  certainty: string;
  urgency: string;
  headline: string;
  description: string;
  instruction: string | null;
  areaDesc: string;
  effective: string;
  expires: string;
  sender: string;
  geometry: GeoJSON.Geometry | null;
};

export async function activeAlerts(opts: {
  point?: { lat: number; lon: number };
  area?: string; // e.g. "MO"
  event?: string; // e.g. "Tornado Warning"
} = {}): Promise<NWSAlert[]> {
  const params = new URLSearchParams();
  if (opts.point) params.set("point", `${opts.point.lat},${opts.point.lon}`);
  if (opts.area) params.set("area", opts.area);
  if (opts.event) params.set("event", opts.event);
  params.set("status", "actual");
  params.set("message_type", "alert,update");

  const url = `${BASE}/alerts/active?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/geo+json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features ?? []).map((f: any) => ({
    id: f.id,
    event: f.properties.event,
    severity: f.properties.severity,
    certainty: f.properties.certainty,
    urgency: f.properties.urgency,
    headline: f.properties.headline,
    description: f.properties.description,
    instruction: f.properties.instruction,
    areaDesc: f.properties.areaDesc,
    effective: f.properties.effective,
    expires: f.properties.expires,
    sender: f.properties.senderName,
    geometry: f.geometry,
  }));
}

// All active tornado-related alerts nationwide.
export async function activeTornadoes(): Promise<NWSAlert[]> {
  const events = ["Tornado Warning", "Tornado Watch", "Severe Thunderstorm Warning"];
  const all = await Promise.all(events.map((event) => activeAlerts({ event })));
  return all.flat();
}

export function alertSeverityScore(a: NWSAlert) {
  return { Extreme: 4, Severe: 3, Moderate: 2, Minor: 1, Unknown: 0 }[a.severity] ?? 0;
}
