"use client";

export default function AQICard({ weather }: { weather: any }) {
  const aqi = weather?.airQuality?.current?.us_aqi;
  if (aqi == null) return null;

  const { label, color, advice } = aqiInfo(aqi);
  const pct = Math.min(1, Math.max(0, aqi / 300));
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="card p-4 text-white">
      <div className="label">Air quality</div>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative w-[120px] h-[120px] flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ - dash}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-medium leading-none">{aqi}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-75 mt-1">
              US AQI
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-medium" style={{ color }}>
            {label}
          </div>
          <p className="text-xs opacity-80 mt-1 leading-snug">{advice}</p>
        </div>
      </div>
    </div>
  );
}

function aqiInfo(aqi: number): { label: string; color: string; advice: string } {
  if (aqi <= 50)
    return {
      label: "Good",
      color: "#86efac",
      advice: "Air quality is satisfactory. Enjoy the outdoors.",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      color: "#fde68a",
      advice: "Acceptable for most people. Sensitive groups: take it easy.",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for sensitive groups",
      color: "#fdba74",
      advice: "People with respiratory or heart conditions should limit time outside.",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      color: "#fca5a5",
      advice: "Everyone may begin to feel effects. Limit prolonged outdoor exertion.",
    };
  if (aqi <= 300)
    return {
      label: "Very unhealthy",
      color: "#f87171",
      advice: "Health alert: serious effects likely. Stay indoors when possible.",
    };
  return {
    label: "Hazardous",
    color: "#c084fc",
    advice: "Emergency conditions. Avoid outdoor activity entirely.",
  };
}
