"use client";

import { Droplets, Eye, Gauge, Sun, Wind } from "lucide-react";
import { compass } from "@/lib/weather";

export default function ChipStrip({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) {
    return (
      <div className="px-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="chip h-[78px] shimmer-bg" />
        ))}
      </div>
    );
  }
  const c = weather.forecast.current;
  const aqi = weather.airQuality?.current?.us_aqi;

  const items = [
    {
      icon: <Wind className="w-3.5 h-3.5" />,
      label: "Wind",
      value: Math.round(c.wind_speed_10m ?? 0),
      unit: "mph",
      sub: compass(c.wind_direction_10m ?? 0),
    },
    {
      icon: <Droplets className="w-3.5 h-3.5" />,
      label: "Humidity",
      value: c.relative_humidity_2m,
      unit: "%",
      sub: `Dew ${Math.round(c.dew_point_2m)}${symbol}`,
    },
    {
      icon: <Sun className="w-3.5 h-3.5" />,
      label: "UV",
      value: Math.round(c.uv_index ?? 0),
      unit: "",
      sub: uvLabel(c.uv_index ?? 0),
    },
    {
      icon: <Gauge className="w-3.5 h-3.5" />,
      label: "AQI",
      value: aqi ?? "—",
      unit: "",
      sub: aqiLabel(aqi),
    },
  ];

  return (
    <div className="px-4 grid grid-cols-4 gap-2 text-white">
      {items.map((it) => (
        <div key={it.label} className="chip p-2.5">
          <div className="flex items-center gap-1 opacity-85 text-[10px] uppercase tracking-wider">
            {it.icon}
            {it.label}
          </div>
          <div className="mt-1 font-medium text-lg leading-none">
            {it.value}
            {it.unit && <span className="text-xs ml-0.5 opacity-80">{it.unit}</span>}
          </div>
          <div className="text-[10px] opacity-75 mt-0.5 truncate">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

function uvLabel(uv: number) {
  if (uv >= 11) return "Extreme";
  if (uv >= 8) return "Very high";
  if (uv >= 6) return "High";
  if (uv >= 3) return "Moderate";
  return "Low";
}
function aqiLabel(aqi?: number) {
  if (aqi == null) return "—";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
}
