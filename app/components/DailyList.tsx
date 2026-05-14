"use client";

import { describeCode } from "@/lib/weather";

export default function DailyList({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) {
    return (
      <div className="mx-4">
        <div className="card h-72 shimmer-bg" />
      </div>
    );
  }
  const d = weather.forecast.daily;
  const days = d.time.map((date: string, i: number) => ({
    date,
    high: Math.round(d.temperature_2m_max[i]),
    low: Math.round(d.temperature_2m_min[i]),
    code: d.weather_code[i],
    pop: d.precipitation_probability_max[i] ?? 0,
  }));

  const allMin = Math.min(...days.map((x: any) => x.low));
  const allMax = Math.max(...days.map((x: any) => x.high));

  return (
    <div className="mx-4 text-white">
      <div className="label px-1 mb-2">10-day forecast</div>
      <div className="card overflow-hidden divide-y divide-white/15">
        {days.map((day: any, i: number) => {
          const cond = describeCode(day.code);
          const startPct =
            ((day.low - allMin) / Math.max(1, allMax - allMin)) * 100;
          const endPct =
            ((day.high - allMin) / Math.max(1, allMax - allMin)) * 100;
          const label =
            i === 0
              ? "Today"
              : new Date(`${day.date}T12:00:00`).toLocaleDateString([], {
                  weekday: "short",
                });
          return (
            <div
              key={day.date}
              className="px-4 py-3 grid grid-cols-12 items-center gap-3 text-sm"
            >
              <div className="col-span-3 font-medium">{label}</div>
              <div className="col-span-2 text-xl leading-none" aria-hidden>
                {cond.emoji}
              </div>
              <div className="col-span-1 text-[11px] opacity-80">
                {day.pop}%
              </div>
              <div className="col-span-1 text-right opacity-75 tabular-nums">
                {day.low}°
              </div>
              <div className="col-span-3 relative h-1.5 rounded-full bg-white/20">
                <span
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-300 via-amber-200 to-rose-300"
                  style={{
                    left: `${startPct}%`,
                    width: `${Math.max(6, endPct - startPct)}%`,
                  }}
                />
              </div>
              <div className="col-span-2 text-right font-medium tabular-nums">
                {day.high}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
