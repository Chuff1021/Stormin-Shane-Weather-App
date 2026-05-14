"use client";

import { compass } from "@/lib/weather";

export default function WindCard({ weather }: { weather: any }) {
  if (!weather) return null;
  const c = weather.forecast.current;
  const speed = Math.round(c.wind_speed_10m ?? 0);
  const gust = Math.round(c.wind_gusts_10m ?? 0);
  const deg = c.wind_direction_10m ?? 0;
  const dir = compass(deg);

  return (
    <div className="card p-4 text-white">
      <div className="label">Wind</div>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative w-[120px] h-[120px]">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
            />
            {/* N/E/S/W ticks */}
            {[0, 90, 180, 270].map((a) => (
              <line
                key={a}
                x1="60"
                y1="14"
                x2="60"
                y2="22"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                transform={`rotate(${a} 60 60)`}
              />
            ))}
            <text x="60" y="13" textAnchor="middle" fill="white" opacity="0.8" fontSize="9">N</text>
            <text x="107" y="63" textAnchor="middle" fill="white" opacity="0.8" fontSize="9">E</text>
            <text x="60" y="113" textAnchor="middle" fill="white" opacity="0.8" fontSize="9">S</text>
            <text x="13" y="63" textAnchor="middle" fill="white" opacity="0.8" fontSize="9">W</text>
            {/* Wind arrow */}
            <g transform={`rotate(${deg} 60 60)`}>
              <path
                d="M60 18 L66 36 L60 32 L54 36 Z"
                fill="white"
              />
              <line
                x1="60"
                y1="32"
                x2="60"
                y2="60"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-medium tabular-nums leading-none">
              {speed}
            </span>
            <span className="text-sm opacity-80">mph</span>
          </div>
          <div className="text-xs opacity-80 mt-1">
            From {dir} ({deg.toFixed?.(0) ?? deg}°)
          </div>
          <div className="text-xs opacity-80 mt-0.5">Gusts {gust} mph</div>
        </div>
      </div>
    </div>
  );
}
