"use client";

import { describeCode } from "@/lib/weather";

export default function HourlyStrip({
  weather,
  symbol,
}: {
  weather: any;
  symbol: string;
}) {
  if (!weather) {
    return (
      <div className="mx-4">
        <div className="card h-[170px] shimmer-bg" />
      </div>
    );
  }
  const h = weather.forecast.hourly;
  const nowIso = weather.forecast.current.time;
  const startIdx = Math.max(0, h.time.findIndex((t: string) => t >= nowIso));
  const slice = (arr: any[]) => arr.slice(startIdx, startIdx + 24);

  const times = slice(h.time);
  const temps = slice(h.temperature_2m).map((t: number) => Math.round(t));
  const pops = slice(h.precipitation_probability);
  const codes = slice(h.weather_code);

  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const cellW = 58;
  const width = 24 * cellW;
  const chartH = 56;
  const padY = 8;
  const pts = temps
    .map((t: number, i: number) => {
      const x = i * cellW + cellW / 2;
      const y =
        padY +
        (chartH - padY * 2) *
          (1 - (t - min) / Math.max(1, max - min));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mx-4 text-white">
      <div className="label px-1 mb-2">Hourly forecast</div>
      <div className="card p-3 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div className="relative" style={{ width, height: 168 }}>
            <svg
              className="absolute left-0 top-0"
              width={width}
              height={chartH}
              viewBox={`0 0 ${width} ${chartH}`}
            >
              <defs>
                <linearGradient id="hourlyfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={`0,${chartH} ${pts} ${width},${chartH}`}
                fill="url(#hourlyfill)"
                stroke="none"
              />
              <polyline
                points={pts}
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            </svg>
            <div className="absolute inset-x-0" style={{ top: chartH }}>
              <div className="flex">
                {times.map((t: string, i: number) => {
                  const d = new Date(t);
                  const cond = describeCode(codes[i]);
                  const isNow = i === 0;
                  return (
                    <div
                      key={t}
                      style={{ width: cellW }}
                      className="flex flex-col items-center text-center gap-1.5 pt-2"
                    >
                      <div className="text-[11px] opacity-80">
                        {isNow ? "Now" : d.toLocaleTimeString([], { hour: "numeric" })}
                      </div>
                      <div className="text-lg leading-none" aria-hidden>
                        {cond.emoji}
                      </div>
                      <div className="text-sm font-medium leading-none">
                        {temps[i]}
                        {symbol}
                      </div>
                      <div className="text-[10px] opacity-80 leading-none flex items-center gap-0.5">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M12 2s7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13z" />
                        </svg>
                        {pops[i] ?? 0}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
