"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  CloudRain,
  Compass,
  Droplets,
  Gauge,
  LocateFixed,
  Radar,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Thermometer,
  Tornado,
  Video,
  Wind,
} from "lucide-react";
import { describeCode, compass, type Unit, type Place } from "@/lib/weather";
import WeatherHero from "./components/WeatherHero";
import AlertBanner from "./components/AlertBanner";
import HourlyStrip from "./components/HourlyStrip";
import DailyList from "./components/DailyList";
import DetailTiles from "./components/DetailTiles";
import ShaneFeed from "./components/ShaneFeed";
import LocationPicker from "./components/LocationPicker";

const DEFAULT_PLACE: Place = {
  label: "Republic, Missouri, US",
  latitude: 37.1201,
  longitude: -93.4802,
};

const STORE_KEY = "stormin-shane-state-v4";

type SavedState = { place: Place; unit: Unit; saved: Place[] };

const DEFAULT_STATE: SavedState = {
  place: DEFAULT_PLACE,
  unit: "fahrenheit",
  saved: [],
};

function readState(): SavedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: SavedState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
}

export default function Home() {
  const [state, setState] = useState<SavedState>(DEFAULT_STATE);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = useCallback(
    async (place: Place, unit: Unit) => {
      setError(null);
      try {
        const res = await fetch(
          `/api/weather?lat=${place.latitude}&lon=${place.longitude}&label=${encodeURIComponent(place.label)}&unit=${unit}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Weather is temporarily unavailable.");
        setWeather(await res.json());
      } catch (e: any) {
        setError(e?.message || "Couldn't load weather.");
      }
    },
    []
  );

  // initial load
  useEffect(() => {
    const initial = readState();
    setState(initial);
    setLoading(true);
    loadWeather(initial.place, initial.unit).finally(() => setLoading(false));
  }, [loadWeather]);

  // background refresh every 5 min
  useEffect(() => {
    const t = setInterval(() => {
      loadWeather(state.place, state.unit);
    }, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [state.place, state.unit, loadWeather]);

  function persist(next: SavedState) {
    setState(next);
    writeState(next);
  }

  async function selectPlace(place: Place) {
    persist({ ...state, place });
    setPickerOpen(false);
    setLoading(true);
    await loadWeather(place, state.unit);
    setLoading(false);
  }

  async function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectPlace({
          label: "Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => setError("Location permission denied. Try searching by city."),
      { enableHighAccuracy: true, timeout: 9000 }
    );
  }

  async function manualRefresh() {
    setRefreshing(true);
    await loadWeather(state.place, state.unit);
    setRefreshing(false);
  }

  function toggleUnit() {
    const unit: Unit = state.unit === "fahrenheit" ? "celsius" : "fahrenheit";
    persist({ ...state, unit });
    setLoading(true);
    loadWeather(state.place, unit).finally(() => setLoading(false));
  }

  const symbol = state.unit === "celsius" ? "°C" : "°";
  const condition = useMemo(() => {
    const code = weather?.forecast?.current?.weather_code;
    return code !== undefined ? describeCode(code) : null;
  }, [weather]);

  const tornadoAlerts = useMemo(
    () =>
      (weather?.alerts ?? []).filter((a: any) =>
        /Tornado/i.test(a.event)
      ),
    [weather]
  );

  return (
    <main className="storm-canvas min-h-screen relative">
      {/* Top bar */}
      <header className="safe-top px-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => setPickerOpen(true)}
          className="flex-1 flex items-center gap-2 glass rounded-2xl px-4 py-3 text-left"
        >
          <Search className="w-4 h-4 text-bolt-400" />
          <span className="text-sm text-white/80 truncate">
            {state.place.label}
          </span>
        </button>
        <button
          onClick={manualRefresh}
          aria-label="Refresh"
          className="glass rounded-2xl p-3"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={toggleUnit}
          aria-label="Toggle unit"
          className="glass rounded-2xl px-3 py-3 text-xs font-medium tracking-wide"
        >
          {state.unit === "fahrenheit" ? "°F" : "°C"}
        </button>
      </header>

      {/* Error notice */}
      {error && (
        <div className="mx-4 my-2 flex items-center gap-2 rounded-xl bg-siren-600/20 border border-siren-600/40 text-siren-500 px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Active tornado banner — always pinned at top if present */}
      {tornadoAlerts.length > 0 && (
        <div className="px-4 mt-2">
          <AlertBanner alerts={tornadoAlerts} />
        </div>
      )}

      {/* Hero */}
      <section className="px-4 pt-4">
        <WeatherHero
          loading={loading}
          weather={weather}
          condition={condition}
          symbol={symbol}
          placeLabel={state.place.label}
        />
      </section>

      {/* Quick actions row */}
      <section className="px-4 mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/tracker"
          className="glass rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition"
        >
          <div className="w-10 h-10 rounded-xl bg-siren-pulse flex items-center justify-center">
            <Tornado className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm text-white/60">Tornado Tracker</div>
            <div className="font-semibold">Live storms & chasers</div>
          </div>
        </Link>
        <Link
          href="/dashboard"
          className="glass rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition"
        >
          <div className="w-10 h-10 rounded-xl bg-bolt-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-bolt-400" />
          </div>
          <div>
            <div className="text-sm text-white/60">Shane's Studio</div>
            <div className="font-semibold">Post a video update</div>
          </div>
        </Link>
      </section>

      {/* Shane's latest video feed */}
      <section className="mt-6">
        <SectionHeader title="From Shane" subtitle="Latest field updates" icon={<Video className="w-4 h-4" />} />
        <ShaneFeed />
      </section>

      {/* Hourly */}
      <section className="mt-6">
        <SectionHeader title="Next 24 hours" subtitle="Temperature & precipitation" icon={<CloudRain className="w-4 h-4" />} />
        <HourlyStrip weather={weather} symbol={symbol} />
      </section>

      {/* Detail tiles */}
      <section className="mt-6 px-4">
        <DetailTiles weather={weather} symbol={symbol} />
      </section>

      {/* Daily */}
      <section className="mt-6 mb-32">
        <SectionHeader title="10-day forecast" subtitle="Highs, lows & rain chance" icon={<Sun className="w-4 h-4" />} />
        <DailyList weather={weather} symbol={symbol} />
      </section>

      {/* Footer attribution */}
      <footer className="px-6 pb-10 text-center text-xs text-white/40">
        <p>Forecast: Open-Meteo · Alerts: NWS api.weather.gov · Radar: RainViewer + Iowa State Mesonet</p>
        <p className="mt-1">Made for Stormin' Shane. Add to home screen → premier weather PWA.</p>
      </footer>

      {/* Location picker sheet */}
      {pickerOpen && (
        <LocationPicker
          state={state}
          onClose={() => setPickerOpen(false)}
          onSelect={selectPlace}
          onUseMyLocation={useMyLocation}
          onRemove={(p) =>
            persist({ ...state, saved: state.saved.filter((x) => x.label !== p.label) })
          }
          onSaveCurrent={() =>
            persist({
              ...state,
              saved: [state.place, ...state.saved.filter((p) => p.label !== state.place.label)].slice(0, 10),
            })
          }
        />
      )}

      {/* Floating bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 safe-bottom pointer-events-none">
        <div className="mx-auto max-w-xl px-4">
          <div className="glass-strong rounded-3xl flex items-center justify-around p-2 pointer-events-auto shadow-2xl">
            <NavBtn href="/" label="Home" icon={<Sun className="w-5 h-5" />} active />
            <NavBtn href="/tracker" label="Tracker" icon={<Radar className="w-5 h-5" />} />
            <NavBtn href="/dashboard" label="Studio" icon={<Video className="w-5 h-5" />} />
          </div>
        </div>
      </nav>
    </main>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="px-4 mb-2 flex items-end justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-white/40 flex items-center gap-2">
          {icon}
          {title}
        </div>
        {subtitle && <div className="text-sm text-white/60">{subtitle}</div>}
      </div>
    </div>
  );
}

function NavBtn({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl ${
        active ? "bg-white/10 text-white" : "text-white/60"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
