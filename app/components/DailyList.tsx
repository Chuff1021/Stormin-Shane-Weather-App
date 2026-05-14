"use client";

import { describeCode } from "@/lib/weather";

export default function DailyList({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) return <div className="mx-4 glass rounded-2xl h-72 shimmer" />;
  const d = weather.forecast.daily;
  const days = d.time.map((date: string, i: number) => ({
    date,
    high: Math.round(d.temperature_2m_max[i]),
    low: Math.round(d.temperature_2m_min[i]),
    code: d.weather_code[i],
    pop: d.precipitation_probability_max[i] ?? 0,
    sun: d.sunrise[i],
    set: d.sunset[i],
    uv: Math.round(d.uv_index_max[i] ?? 0),
  }));

  const allMin = Math.min(...days.map((x: any) => x.low));
  const allMax = Math.max(...days.map((x: any) => x.high));

  return (
    <div className="mx-4 glass rounded-2xl overflow-hidden divide-y divide-white/5">
      {days.map((day: any, i: number) => {
        const cond = describeCode(day.code);
        const startPct = ((day.low - allMin) / Math.max(1, allMax - allMin)) * 100;
        const endPct = ((day.high - allMin) / Math.max(1, allMax - allMin)) * 100;
        const label =
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : new Date(`${day.date}T12:00:00`).toLocaleDateString([], {
                weekday: "short",
              });
        return (
          <div key={day.date} className="px-4 py-3 grid grid-cols-12 items-center gap-3 text-sm">
            <div className="col-span-3 font-medium text-white/90">{label}</div>
            <div className="col-span-2 text-lg" aria-hidden>
              {cond.emoji}
            </div>
            <div className="col-span-1 text-bolt-400 text-[11px]">{day.pop}%</div>
            <div className="col-span-1 text-white/60 text-right">{day.low}{symbol}</div>
            <div className="col-span-3 relative h-1.5 rounded-full bg-white/10">
              <span
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-bolt-500 to-amber-400"
                style={{
                  left: `${startPct}%`,
                  width: `${Math.max(6, endPct - startPct)}%`,
                }}
              />
            </div>
            <div className="col-span-2 text-white text-right font-medium">
              {day.high}{symbol}
            </div>
          </div>
        );
      })}
    </div>
  );
}
