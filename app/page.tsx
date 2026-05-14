"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, RefreshCw, Bell, Tornado, Video } from "lucide-react";
import { type Unit, type Place } from "@/lib/weather";
import Sky, { moodFromCode } from "./components/Sky";
import WeatherHero from "./components/WeatherHero";
import ChipStrip from "./components/ChipStrip";
import HourlyStrip from "./components/HourlyStrip";
import DailyList from "./components/DailyList";
import AQICard from "./components/AQICard";
import WindCard from "./components/WindCard";
import RadarPeek from "./components/RadarPeek";
import AlertBanner from "./components/AlertBanner";
import ShaneFeed from "./components/ShaneFeed";
import LocationPicker from "./components/LocationPicker";

const DEFAULT_PLACE: Place = {
  label: "Republic, Missouri",
  latitude: 37.1201,
  longitude: -93.4802,
};

const STORE_KEY = "stormin-shane-state-v5";

type SavedState = { place: Place; unit: Unit; saved: Place[] };
const DEFAULT_STATE: SavedState = { place: DEFAULT_PLACE, unit: "fahrenheit", saved: [] };

function readState(): SavedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
  } catch {
    return DEFAULT_STATE;
  }
}
function writeState(s: SavedState) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
}

export default function Home() {
  const [state, setState] = useState<SavedState>(DEFAULT_STATE);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = useCallback(async (place: Place, unit: Unit) => {
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
  }, []);

  useEffect(() => {
    const initial = readState();
    setState(initial);
    setLoading(true);
    loadWeather(initial.place, initial.unit).finally(() => setLoading(false));
  }, [loadWeather]);

  useEffect(() => {
    const t = setInterval(() => loadWeather(state.place, state.unit), 5 * 60 * 1000);
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

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        selectPlace({
          label: "Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => setError("Location permission denied. Try searching."),
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

  const mood = useMemo(() => {
    if (!weather) return "clear-day" as const;
    return moodFromCode(weather.forecast.current.weather_code, weather.forecast.current.is_day);
  }, [weather]);

  const tornadoAlerts = useMemo(
    () => (weather?.alerts ?? []).filter((a: any) => /Tornado|Severe Thunderstorm Warning/i.test(a.event)),
    [weather]
  );

  return (
    <main className="min-h-screen text-white pb-32">
      <Sky mood={mood} />

      {/* Top bar */}
      <header className="safe-top px-4 pb-3 flex items-center gap-2">
        <button
          onClick={() => setPickerOpen(true)}
          className="flex-1 flex items-center gap-2 chip px-3 py-2 text-left text-white"
        >
          <MapPin className="w-4 h-4 opacity-90" />
          <span className="text-sm truncate font-medium">{state.place.label}</span>
        </button>
        <button onClick={toggleUnit} aria-label="Toggle unit" className="chip px-3 py-2 text-xs font-semibold">
          {state.unit === "fahrenheit" ? "°F" : "°C"}
        </button>
        <button onClick={manualRefresh} aria-label="Refresh" className="chip p-2.5">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Error */}
      {error && (
        <div className="mx-4 my-2 flex items-center gap-2 rounded-2xl bg-rose-600/30 border border-rose-300/30 text-white px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Active severe banner */}
      {tornadoAlerts.length > 0 && (
        <div className="px-4 mt-1 mb-2">
          <AlertBanner alerts={tornadoAlerts} />
        </div>
      )}

      {/* Hero */}
      <WeatherHero
        loading={loading}
        weather={weather}
        symbol={symbol}
        placeLabel={state.place.label}
      />

      {/* Chip strip */}
      <div className="mt-2">
        <ChipStrip weather={weather} symbol={symbol} />
      </div>

      {/* Hourly */}
      <div className="mt-6">
        <HourlyStrip weather={weather} symbol={symbol} />
      </div>

      {/* AQI + Wind dual cards */}
      <div className="mt-6 mx-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AQICard weather={weather} />
        <WindCard weather={weather} />
      </div>

      {/* Radar peek */}
      <div className="mt-6">
        <RadarPeek
          lat={state.place.latitude}
          lon={state.place.longitude}
          label={state.place.label}
        />
      </div>

      {/* 10-day */}
      <div className="mt-6">
        <DailyList weather={weather} symbol={symbol} />
      </div>

      {/* Shortcuts to Tracker + Studio */}
      <div className="mt-6 mx-4 grid grid-cols-2 gap-3">
        <Link href="/tracker" className="card p-4 text-white flex items-center gap-3 active:scale-[0.99] transition">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/85 flex items-center justify-center">
            <Tornado className="w-5 h-5" />
          </div>
          <div>
            <div className="label">Tornado tracker</div>
            <div className="font-medium text-sm">Live storms & chasers</div>
          </div>
        </Link>
        <Link href="/dashboard" className="card p-4 text-white flex items-center gap-3 active:scale-[0.99] transition">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/85 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="label">Shane's studio</div>
            <div className="font-medium text-sm">Post a video update</div>
          </div>
        </Link>
      </div>

      {/* Shane's posted videos */}
      <div className="mt-6">
        <ShaneFeed />
      </div>

      {/* Footer */}
      <footer className="px-6 pt-8 text-center text-[11px] opacity-70">
        <p>Open-Meteo · NWS · Iowa State Mesonet · Made for Stormin' Shane.</p>
      </footer>

      {/* Picker */}
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
    </main>
  );
}
