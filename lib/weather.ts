// Open-Meteo client — no API key required.
// Docs: https://open-meteo.com/en/docs

const FORECAST = "https://api.open-meteo.com/v1/forecast";
const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
const AQI = "https://air-quality-api.open-meteo.com/v1/air-quality";

export type Unit = "fahrenheit" | "celsius";

export type Place = {
  label: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
  timezone?: string;
};

export async function geocode(query: string): Promise<Place[]> {
  const url = `${GEOCODE}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error("geocode failed");
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    label: [r.name, r.admin1, r.country_code].filter(Boolean).join(", "),
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1,
    country: r.country_code,
    timezone: r.timezone,
  }));
}

export async function forecast(lat: number, lon: number, unit: Unit = "fahrenheit") {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: "auto",
    temperature_unit: unit,
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure,visibility,uv_index,is_day",
    hourly:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,precipitation_sum,uv_index_max,sunrise,sunset,wind_speed_10m_max",
    forecast_days: "10",
  });
  const url = `${FORECAST}?${params}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("forecast failed");
  return res.json();
}

export async function airQuality(lat: number, lon: number) {
  const url = `${AQI}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return null;
  return res.json();
}

// WMO weather code → friendly label + icon hint
export function describeCode(code: number) {
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorms", tone: "severe", emoji: "⛈️" };
  if ([80, 81, 82].includes(code)) return { label: "Rain showers", tone: "wet", emoji: "🌧️" };
  if ([61, 63, 65].includes(code)) return { label: "Rain", tone: "wet", emoji: "🌧️" };
  if ([66, 67].includes(code)) return { label: "Freezing rain", tone: "cold", emoji: "🧊" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", tone: "cold", emoji: "❄️" };
  if ([45, 48].includes(code)) return { label: "Fog", tone: "neutral", emoji: "🌫️" };
  if (code === 0) return { label: "Clear", tone: "clear", emoji: "☀️" };
  if ([1, 2].includes(code)) return { label: "Partly cloudy", tone: "clear", emoji: "🌤️" };
  if (code === 3) return { label: "Overcast", tone: "neutral", emoji: "☁️" };
  return { label: "Cloudy", tone: "neutral", emoji: "☁️" };
}

export function compass(deg: number) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];
}
