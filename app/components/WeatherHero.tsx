"use client";

import { describeCode } from "@/lib/weather";

export default function WeatherHero({
  loading,
  weather,
  symbol,
  placeLabel,
}: {
  loading: boolean;
  weather: any;
  symbol: string;
  placeLabel: string;
}) {
  if (loading && !weather) {
    return (
      <section className="px-6 pt-8 pb-2 text-white">
        <div className="h-3 w-28 rounded-full shimmer-bg" />
        <div className="h-24 w-44 rounded-2xl shimmer-bg mt-3" />
        <div className="h-4 w-40 rounded-full shimmer-bg mt-3" />
      </section>
    );
  }
  if (!weather) return null;

  const c = weather.forecast.current;
  const today = weather.forecast.daily;
  const cond = describeCode(c.weather_code);
  const temp = Math.round(c.temperature_2m);
  const high = Math.round(today.temperature_2m_max[0]);
  const low = Math.round(today.temperature_2m_min[0]);
  const feels = Math.round(c.apparent_temperature);

  return (
    <section className="px-6 pt-6 pb-3 text-white">
      <div className="text-[13px] uppercase tracking-[0.18em] opacity-80">
        {placeLabel}
      </div>
      <div className="mt-1 flex items-start gap-2">
        <span className="text-[96px] leading-none font-ultralight tracking-tight">
          {temp}
        </span>
        <span className="text-3xl font-ultralight mt-2 opacity-80">{symbol}</span>
      </div>
      <div className="mt-1 text-lg font-medium drop-shadow-sm">{cond.label}</div>
      <div className="mt-0.5 text-sm opacity-80">
        H {high}{symbol} &nbsp;·&nbsp; L {low}{symbol} &nbsp;·&nbsp; Feels {feels}{symbol}
      </div>
    </section>
  );
}
