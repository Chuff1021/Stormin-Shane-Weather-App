"use client";

import { Thermometer } from "lucide-react";
import { compass, describeCode } from "@/lib/weather";

const TONE_BG: Record<string, string> = {
  clear: "from-amber-500/30 via-bolt-500/20 to-transparent",
  wet: "from-bolt-600/40 via-bolt-500/15 to-transparent",
  severe: "from-siren-600/50 via-amber-500/30 to-transparent",
  cold: "from-cyan-400/30 via-bolt-500/15 to-transparent",
  neutral: "from-ink-700/60 via-ink-800/20 to-transparent",
};

export default function WeatherHero({
  loading,
  weather,
  condition,
  symbol,
  placeLabel,
}: {
  loading: boolean;
  weather: any;
  condition: ReturnType<typeof describeCode> | null;
  symbol: string;
  placeLabel: string;
}) {
  if (loading && !weather) {
    return (
      <div className="rounded-3xl p-6 shimmer h-56 glass" aria-busy>
        <div className="h-4 w-24 bg-white/10 rounded mb-4" />
        <div className="h-16 w-40 bg-white/10 rounded mb-2" />
        <div className="h-4 w-32 bg-white/10 rounded" />
      </div>
    );
  }

  if (!weather) return null;

  const c = weather.forecast.current;
  const today = weather.forecast.daily;
  const high = Math.round(today.temperature_2m_max[0]);
  const low = Math.round(today.temperature_2m_min[0]);
  const temp = Math.round(c.temperature_2m);
  const feels = Math.round(c.apparent_temperature);
  const dir = compass(c.wind_direction_10m ?? 0);
  const tone = condition?.tone || "neutral";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 glass border border-white/5 bg-gradient-to-b ${TONE_BG[tone] || TONE_BG.neutral}`}
    >
      {/* Decorative blob */}
      <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-bolt-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">
            {placeLabel}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-7xl font-light tracking-tight">{temp}</span>
            <span className="text-3xl font-light text-white/70">{symbol}</span>
          </div>
          <div className="mt-1 text-lg text-white/80">
            {condition?.label} <span className="opacity-50">·</span> Feels {feels}{symbol}
          </div>
        </div>
        <div className="text-6xl leading-none mt-2" aria-hidden>
          {condition?.emoji || "—"}
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-3 text-sm text-white/70">
        <span className="inline-flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-amber-400" />
          H {high}{symbol}
        </span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-bolt-400" />
          L {low}{symbol}
        </span>
        <span>·</span>
        <span>
          Wind {Math.round(c.wind_speed_10m ?? 0)} mph {dir}
        </span>
      </div>
    </div>
  );
}
