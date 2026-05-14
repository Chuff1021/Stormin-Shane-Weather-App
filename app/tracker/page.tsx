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

const TornadoMap = dynamic(() => import("../components/TornadoMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] glass rounded-2xl shimmer" aria-busy />
  ),
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

type Chaser = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  reportedAt?: string;
};

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
    <main className="storm-canvas min-h-screen flex flex-col">
      <header className="safe-top px-4 pb-3 flex items-center gap-3">
        <Link
          href="/"
          aria-label="Back"
          className="glass rounded-2xl p-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-white/50">
            Live storm map
          </div>
          <div className="text-lg font-semibold flex items-center gap-2">
            <Tornado className="w-5 h-5 text-siren-500" />
            Tornado Tracker
          </div>
        </div>
        <button
          onClick={refresh}
          aria-label="Refresh"
          className="glass rounded-2xl p-3"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Counters */}
      <div className="px-4 grid grid-cols-3 gap-2">
        <CountTile
          tone="siren"
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
          tone="bolt"
          label="Severe T-Storm"
          value={counts.sv}
          icon={<Wind className="w-4 h-4" />}
        />
      </div>

      {/* Map */}
      <div className="flex-1 px-4 mt-3">
        <div className="rounded-2xl overflow-hidden border border-white/10 h-[60vh]">
          <TornadoMap
            alerts={alerts}
            chasers={showChasers ? chasers : []}
            showRadar={showRadar}
          />
        </div>
      </div>

      {/* Layer toggles */}
      <div className="px-4 mt-3 flex gap-2 flex-wrap">
        <Toggle
          on={showRadar}
          onChange={setShowRadar}
          label="NEXRAD Radar"
          icon={<Layers className="w-4 h-4" />}
        />
        <Toggle
          on={showChasers}
          onChange={setShowChasers}
          label={`Chasers (${chasers.length})`}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Active alert list */}
      <section className="px-4 mt-4 mb-32 space-y-2">
        <div className="text-xs uppercase tracking-wider text-white/40">
          Active alerts ({alerts.length})
          {updatedAt && (
            <span className="ml-2 text-white/30">
              · updated {new Date(updatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
        {alerts.length === 0 && !loading && (
          <div className="glass rounded-2xl p-4 text-sm text-white/70">
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

      <footer className="px-6 pb-10 text-center text-xs text-white/40">
        Sources: <a className="underline" href="https://api.weather.gov/">NWS</a> · <a className="underline" href="https://www.spotternetwork.org/">Spotter Network</a> · <a className="underline" href="https://mesonet.agron.iastate.edu/ogc/">Iowa Mesonet NEXRAD</a> · <a className="underline" href="https://www.rainviewer.com/api.html">RainViewer</a>
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
  tone: "siren" | "amber" | "bolt";
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  const toneClass =
    tone === "siren"
      ? "bg-siren-600/20 border-siren-600/40 text-siren-500"
      : tone === "amber"
      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
      : "bg-bolt-500/15 border-bolt-500/40 text-bolt-400";
  return (
    <div className={`rounded-2xl border ${toneClass} p-3`}>
      <div className="text-[10px] uppercase tracking-wider flex items-center gap-1 opacity-90">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-0.5 text-white">{value}</div>
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
          ? "bg-bolt-500/20 border-bolt-500/40 text-bolt-400"
          : "bg-white/5 border-white/10 text-white/60"
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
          ? "bg-siren-600/15 border-siren-600/40"
          : "bg-amber-500/10 border-amber-500/30"
      }`}
    >
      <div className="text-xs uppercase tracking-wider opacity-80">
        {alert.severity}
      </div>
      <div className="font-semibold">{alert.event}</div>
      <div className="text-xs text-white/70 mt-0.5">{alert.areaDesc}</div>
      <p className="text-[13px] text-white/85 mt-1 line-clamp-3">
        {alert.headline}
      </p>
      <div className="text-[10px] text-white/50 mt-1">
        Expires {new Date(alert.expires).toLocaleString()}
      </div>
    </div>
  );
}
