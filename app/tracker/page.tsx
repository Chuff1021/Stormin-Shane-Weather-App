"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Layers,
  RefreshCw,
  Tornado,
  Users,
  Wind,
} from "lucide-react";
import Sky from "../components/Sky";

const TornadoMap = dynamic(() => import("../components/TornadoMap"), {
  ssr: false,
  loading: () => <div className="h-[60vh] card shimmer-bg" aria-busy />,
});

type Alert = {
  id: string;
  event: string;
  severity: string;
  headline: string;
  areaDesc: string;
  expires: string;
  geometry: any;
};

type Chaser = { id: string; name: string; lat: number; lon: number; reportedAt?: string };

export default function TrackerPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chasers, setChasers] = useState<Chaser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChasers, setShowChasers] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch("/api/tornadoes", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/chasers", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setAlerts(tRes.alerts ?? []);
      setChasers(cRes.chasers ?? []);
      setUpdatedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const counts = useMemo(() => {
    const tw = alerts.filter((a) => /Tornado Warning/i.test(a.event)).length;
    const tt = alerts.filter((a) => /Tornado Watch/i.test(a.event)).length;
    const sv = alerts.filter((a) => /Severe Thunderstorm/i.test(a.event)).length;
    return { tw, tt, sv };
  }, [alerts]);

  return (
    <main className="min-h-screen flex flex-col text-white pb-20">
      {/* Use a stormy sky for the tracker — sets the tone */}
      <Sky mood="storm-day" />

      <header className="safe-top px-4 pb-3 flex items-center gap-3">
        <Link href="/" aria-label="Back" className="chip p-2.5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="label">Live storm map</div>
          <div className="text-lg font-semibold flex items-center gap-2">
            <Tornado className="w-5 h-5 text-rose-300" />
            Tornado Tracker
          </div>
        </div>
        <button onClick={refresh} aria-label="Refresh" className="chip p-2.5">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      <div className="px-4 grid grid-cols-3 gap-2">
        <CountTile
          tone="rose"
          label="Tornado Warnings"
          value={counts.tw}
          icon={<Tornado className="w-4 h-4" />}
        />
        <CountTile
          tone="amber"
          label="Tornado Watches"
          value={counts.tt}
          icon={<Wind className="w-4 h-4" />}
        />
        <CountTile
          tone="sky"
          label="Severe T-Storm"
          value={counts.sv}
          icon={<Wind className="w-4 h-4" />}
        />
      </div>

      <div className="flex-1 px-4 mt-3">
        <div className="rounded-3xl overflow-hidden border border-white/15 h-[60vh] shadow-2xl">
          <TornadoMap
            alerts={alerts}
            chasers={showChasers ? chasers : []}
            showRadar={showRadar}
          />
        </div>
      </div>

      <div className="px-4 mt-3 flex gap-2 flex-wrap">
        <Toggle on={showRadar} onChange={setShowRadar} label="NEXRAD Radar" icon={<Layers className="w-4 h-4" />} />
        <Toggle on={showChasers} onChange={setShowChasers} label={`Chasers (${chasers.length})`} icon={<Users className="w-4 h-4" />} />
      </div>

      <section className="px-4 mt-4 mb-10 space-y-2">
        <div className="label">
          Active alerts ({alerts.length})
          {updatedAt && <span className="ml-2 opacity-70">· updated {new Date(updatedAt).toLocaleTimeString()}</span>}
        </div>
        {alerts.length === 0 && !loading && (
          <div className="card p-4 text-sm">
            All quiet — no active tornado-related alerts from the NWS right now.
          </div>
        )}
        {alerts
          .slice()
          .sort((a, b) => severityScore(b) - severityScore(a))
          .map((a) => (
            <AlertRow key={a.id} alert={a} />
          ))}
      </section>

      <footer className="px-6 pb-8 text-center text-[11px] opacity-70">
        NWS · Spotter Network · Iowa State Mesonet · RainViewer
      </footer>
    </main>
  );
}

function CountTile({
  tone,
  label,
  value,
  icon,
}: {
  tone: "rose" | "amber" | "sky";
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const toneClass =
    tone === "rose"
      ? "from-rose-500/85 to-rose-400/85"
      : tone === "amber"
      ? "from-amber-500/85 to-amber-300/85"
      : "from-sky-500/85 to-sky-300/85";
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${toneClass} text-white p-3 shadow-lg`}>
      <div className="text-[10px] uppercase tracking-wider flex items-center gap-1 opacity-95">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
  icon,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border ${
        on
          ? "bg-white/85 text-[#0F1B2D] border-white"
          : "bg-white/10 text-white border-white/25"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function severityScore(a: Alert) {
  if (/Tornado Warning/i.test(a.event)) return 4;
  if (/Tornado Watch/i.test(a.event)) return 3;
  if (/Severe Thunderstorm Warning/i.test(a.event)) return 2;
  return 1;
}

function AlertRow({ alert }: { alert: Alert }) {
  const isWarn = /Warning/i.test(alert.event);
  return (
    <div
      className={`rounded-2xl p-3 border ${
        isWarn
          ? "bg-rose-500/30 border-rose-300/40"
          : "bg-amber-500/25 border-amber-300/40"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider opacity-90">
        {alert.severity}
      </div>
      <div className="font-semibold">{alert.event}</div>
      <div className="text-xs opacity-90 mt-0.5">{alert.areaDesc}</div>
      <p className="text-[13px] opacity-95 mt-1 line-clamp-3">{alert.headline}</p>
      <div className="text-[10px] opacity-80 mt-1">
        Expires {new Date(alert.expires).toLocaleString()}
      </div>
    </div>
  );
}
