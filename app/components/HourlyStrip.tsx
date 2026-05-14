"use client";

import { describeCode } from "@/lib/weather";

export default function HourlyStrip({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) return <Skeleton />;
  const h = weather.forecast.hourly;
  const nowIso = weather.forecast.current.time;
  const startIdx = Math.max(0, h.time.findIndex((t: string) => t >= nowIso));
  const slice = (arr: any[]) => arr.slice(startIdx, startIdx + 24);

  const times = slice(h.time);
  const temps = slice(h.temperature_2m);
  const pops = slice(h.precipitation_probability);
  const codes = slice(h.weather_code);

  // Compute polyline points for an inline temperature curve
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const width = 24 * 56; // each hour cell is ~56px wide
  const height = 56;
  const padY = 8;
  const pts = temps
    .map((t: number, i: number) => {
      const x = i * 56 + 28;
      const y =
        padY +
        (height - padY * 2) *
          (1 - (t - min) / Math.max(1, max - min));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mx-4 glass rounded-2xl p-3 overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <div className="relative" style={{ width, height: 160 }}>
          <svg
            className="absolute inset-x-0 top-0"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="tempfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={`0,${height} ${pts} ${width},${height}`}
              fill="url(#tempfill)"
              stroke="none"
            />
            <polyline
              points={pts}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="absolute inset-x-0 top-[56px] flex">
            {times.map((t: string, i: number) => {
              const d = new Date(t);
              const cond = describeCode(codes[i]);
              const isNow = i === 0;
              return (
                <div
                  key={t}
                  style={{ width: 56 }}
                  className="flex flex-col items-center text-center text-xs gap-1"
                >
                  <div className="text-[11px] text-white/60">
                    {isNow
                      ? "Now"
                      : d.toLocaleTimeString([], { hour: "numeric" })}
                  </div>
                  <div className="text-base" aria-hidden>
                    {cond.emoji}
                  </div>
                  <div className="font-medium">
                    {Math.round(temps[i])}
                    {symbol}
                  </div>
                  <div className="text-[10px] text-bolt-400">
                    {pops[i] ?? 0}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return <div className="mx-4 glass rounded-2xl h-40 shimmer" />;
}
