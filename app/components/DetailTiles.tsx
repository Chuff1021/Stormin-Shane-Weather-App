"use client";

import { Compass, Droplets, Eye, Gauge, Sun, Wind } from "lucide-react";
import { compass } from "@/lib/weather";

function Tile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1">
      <div className="text-white/50 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-white/60">{sub}</div>}
    </div>
  );
}

export default function DetailTiles({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl h-24 shimmer glass" />
        ))}
      </div>
    );
  }
  const c = weather.forecast.current;
  const aqi = weather.airQuality?.current?.us_aqi;
  const visibilityMi = c.visibility ? Math.round(c.visibility / 1609) : null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile
        icon={<Wind className="w-3.5 h-3.5" />}
        label="Wind"
        value={`${Math.round(c.wind_speed_10m ?? 0)} mph`}
        sub={`Gusts ${Math.round(c.wind_gusts_10m ?? 0)} · ${compass(c.wind_direction_10m ?? 0)}`}
      />
      <Tile
        icon={<Droplets className="w-3.5 h-3.5" />}
        label="Humidity"
        value={`${c.relative_humidity_2m}%`}
        sub={`Dew point ${Math.round(c.dew_point_2m)}${symbol}`}
      />
      <Tile
        icon={<Sun className="w-3.5 h-3.5" />}
        label="UV index"
        value={Math.round(c.uv_index ?? 0)}
        sub={uvDesc(c.uv_index ?? 0)}
      />
      <Tile
        icon={<Gauge className="w-3.5 h-3.5" />}
        label="Air quality"
        value={aqi ?? "—"}
        sub={aqiDesc(aqi)}
      />
      <Tile
        icon={<Compass className="w-3.5 h-3.5" />}
        label="Pressure"
        value={`${Math.round(c.surface_pressure)}`}
        sub="hPa"
      />
      <Tile
        icon={<Eye className="w-3.5 h-3.5" />}
        label="Visibility"
        value={visibilityMi !== null ? `${visibilityMi} mi` : "—"}
        sub={c.is_day ? "Daytime" : "Overnight"}
      />
    </div>
  );
}

function uvDesc(uv: number) {
  if (uv >= 11) return "Extreme";
  if (uv >= 8) return "Very high";
  if (uv >= 6) return "High";
  if (uv >= 3) return "Moderate";
  return "Low";
}
function aqiDesc(aqi?: number) {
  if (aqi == null) return "Unavailable";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
}
