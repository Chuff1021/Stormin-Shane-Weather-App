'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  CloudRain,
  Compass,
  Gauge,
  Home,
  Loader2,
  LocateFixed,
  Map,
  MapPin,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  ThermometerSun,
  Trash2,
  Video,
  Wind,
  X,
} from 'lucide-react';

const RadarMap = dynamic(() => import('./components/RadarMap'), { ssr: false });

type Tab = 'now' | 'hourly' | 'radar' | 'daily' | 'alerts' | 'shane';
type Unit = 'fahrenheit' | 'celsius';
type Place = { label: string; latitude: number; longitude: number };
type SavedState = { place: Place; saved: Place[]; unit: Unit };

type Hour = {
  stamp: string;
  time: string;
  temp: number;
  feels: number;
  humidity: number;
  pop: number;
  precip: number;
  code: number;
  wind: number;
  gust: number;
};

type Day = {
  date: string;
  day: string;
  high: number;
  low: number;
  code: number;
  rainChance: number;
  rainTotal: number;
  uv: number;
  sunrise: string;
  sunset: string;
};

type AppWeather = {
  placeLabel: string;
  unit: Unit;
  symbol: string;
  updated: string;
  temp: number;
  feels: number;
  condition: string;
  code: number;
  wind: number;
  gust: number;
  windDir: string;
  humidity: number;
  dew: number;
  pressure: number;
  visibility: number;
  uv: number;
  aqi: number | null;
  nextRain: Hour | null;
  hourly: Hour[];
  days: Day[];
  alerts: any[];
};

const DEFAULT_PLACE: Place = { label: 'Republic, Missouri', latitude: 37.1201, longitude: -93.4802 };
const STORE_KEY = 'stormin-shane-state-v3';
const DEFAULT_STATE: SavedState = { place: DEFAULT_PLACE, saved: [], unit: 'fahrenheit' };

function readState(): SavedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: SavedState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function icon(code: number) {
  if ([95, 96, 99].includes(code)) return '⛈️';
  if ([80, 81, 82, 61, 63, 65].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([45, 48].includes(code)) return '🌫️';
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  return '☁️';
}

function describe(code: number) {
  if ([95, 96, 99].includes(code)) return 'Thunderstorms';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([61, 63, 65].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([45, 48].includes(code)) return 'Fog';
  if (code === 0) return 'Clear';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  return 'Cloudy';
}

function compass(deg: number) {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
}

function dayName(date: string, i: number) {
  if (i === 0) return 'Today';
  if (i === 1) return 'Tomorrow';
  return new Date(`${date}T12:00:00`).toLocaleDateString([], { weekday: 'short' });
}

function timeShort(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function normalize(payload: any): AppWeather {
  const f = payload.forecast;
  const c = f.current;
  const start = Math.max(0, f.hourly.time.findIndex((t: string) => t >= c.time));
  const hourly: Hour[] = f.hourly.time.slice(start, start + 48).map((stamp: string, off: number) => {
    const i = start + off;
    return {
      stamp,
      time: off === 0 ? 'Now' : new Date(stamp).toLocaleTimeString([], { hour: 'numeric' }),
      temp: Math.round(f.hourly.temperature_2m[i]),
      feels: Math.round(f.hourly.apparent_temperature[i]),
      humidity: f.hourly.relative_humidity_2m[i],
      pop: f.hourly.precipitation_probability[i] ?? 0,
      precip: f.hourly.precipitation[i] ?? 0,
      code: f.hourly.weather_code[i],
      wind: Math.round(f.hourly.wind_speed_10m[i] ?? 0),
      gust: Math.round(f.hourly.wind_gusts_10m[i] ?? 0),
    };
  });
  const days: Day[] = f.daily.time.map((date: string, i: number) => ({
    date,
    day: dayName(date, i),
    high: Math.round(f.daily.temperature_2m_max[i]),
    low: Math.round(f.daily.temperature_2m_min[i]),
    code: f.daily.weather_code[i],
    rainChance: f.daily.precipitation_probability_max[i] ?? 0,
    rainTotal: f.daily.precipitation_sum[i] ?? 0,
    uv: Math.round(f.daily.uv_index_max[i] ?? 0),
    sunrise: f.daily.sunrise[i],
    sunset: f.daily.sunset[i],
  }));
  return {
    placeLabel: payload.label,
    unit: payload.unit,
    symbol: payload.unit === 'celsius' ? '°C' : '°',
    updated: timeShort(payload.updatedAt),
    temp: Math.round(c.temperature_2m),
    feels: Math.round(c.apparent_temperature),
    condition: describe(c.weather_code),
    code: c.weather_code,
    wind: Math.round(c.wind_speed_10m ?? 0),
    gust: Math.round(c.wind_gusts_10m ?? 0),
    windDir: compass(c.wind_direction_10m ?? 0),
    humidity: c.relative_humidity_2m,
    dew: Math.round(c.dew_point_2m),
    pressure: Math.round(c.surface_pressure),
    visibility: Math.round((c.visibility || 0) / 1609),
    uv: Math.round(c.uv_index ?? 0),
    aqi: payload.airQuality?.current?.us_aqi ?? null,
    nextRain: hourly.find((h) => h.pop >= 35 || h.precip > 0) || null,
    hourly,
    days,
    alerts: payload.alerts || [],
  };
}

function severity(weather: AppWeather | null) {
  if (!weather) return { label: 'Loading', tone: 'neutral', detail: 'Checking live conditions…' };
  if (weather.alerts.length) return { label: `${weather.alerts.length} active alert${weather.alerts.length > 1 ? 's' : ''}`, tone: 'danger', detail: weather.alerts[0].title };
  if (weather.gust >= 40) return { label: 'Wind watch', tone: 'watch', detail: `Gusts near ${weather.gust} mph` };
  if (weather.nextRain?.pop && weather.nextRain.pop >= 70) return { label: 'Rain likely', tone: 'watch', detail: `${weather.nextRain.pop}% around ${weather.nextRain.time}` };
  return { label: 'All clear', tone: 'good', detail: 'No active warnings for this location.' };
}

export default function StorminShaneApp() {
  const [state, setState] = useState<SavedState>(DEFAULT_STATE);
  const [tab, setTab] = useState<Tab>('now');
  const [weather, setWeather] = useState<AppWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [sheet, setSheet] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    navigator.serviceWorker?.register('/sw.js').catch(() => {});
    const initial = readState();
    setState(initial);
    loadWeather(initial.place, initial.unit);
  }, []);

  function persist(next: SavedState) {
    setState(next);
    writeState(next);
  }

  async function loadWeather(place = state.place, unit = state.unit) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/weather?lat=${place.latitude}&lon=${place.longitude}&label=${encodeURIComponent(place.label)}&unit=${unit}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Weather data is temporarily unavailable.');
      const data = normalize(await res.json());
      setWeather(data);
      persist({ ...state, place, unit });
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong loading weather.');
    } finally {
      setLoading(false);
    }
  }

  async function search(event?: React.FormEvent) {
    event?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const data = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`).then((r) => r.json());
      const rows = data.results || [];
      setResults(rows);
      if (rows[0]) await loadWeather(rows[0], state.unit);
      else setMessage('No location found. Try city + state, like “Republic MO.”');
    } catch {
      setMessage('Location search failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function useLocation() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => loadWeather({ label: 'Current Location', latitude: pos.coords.latitude, longitude: pos.coords.longitude }, state.unit),
      () => setMessage('Location permission denied. Search a city instead.'),
      { enableHighAccuracy: true, timeout: 9000 },
    );
  }

  function saveCurrent() {
    const current = state.place;
    const saved = [current, ...state.saved.filter((p) => p.label !== current.label)].slice(0, 8);
    persist({ ...state, saved });
  }

  function removeSaved(place: Place) {
    persist({ ...state, saved: state.saved.filter((p) => p.label !== place.label) });
  }

  function changeUnit(unit: Unit) {
    persist({ ...state, unit });
    loadWeather(state.place, unit);
  }

  const status = useMemo(() => severity(weather), [weather]);
  const today = weather?.days[0];

  return (
    <main className="phone-shell">
      <div className="storm-bg" />
      <header className="app-header">
        <button className="ghost location-button" onClick={() => setSettingsOpen(true)}>
          <MapPin />
          <span>{state.place.label}</span>
        </button>
        <div className="header-actions">
          <button className="ghost icon-button" onClick={() => loadWeather()} aria-label="Refresh weather">{loading ? <Loader2 className="spin" /> : <RefreshCw />}</button>
          <button className="ghost icon-button" onClick={() => setSettingsOpen(true)} aria-label="Open settings"><Settings /></button>
        </div>
      </header>

      <form className="command-bar" onSubmit={search}>
        <Search />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city, ZIP, or place" />
        <button type="submit">Go</button>
      </form>

      {message && <div className="notice danger"><AlertTriangle /> {message}</div>}
      {results.length > 1 && <SearchResults rows={results} choose={(p: Place) => loadWeather(p, state.unit)} />}

      <section className={`risk-card ${status.tone}`}>
        <div>
          <span>Storm status</span>
          <strong>{status.label}</strong>
          <p>{status.detail}</p>
        </div>
        {status.tone === 'danger' ? <ShieldAlert /> : status.tone === 'watch' ? <CloudRain /> : <Check />}
      </section>

      {tab === 'now' && <NowView weather={weather} today={today} loading={loading} save={saveCurrent} locate={useLocation} openSettings={() => setSettingsOpen(true)} />}
      {tab === 'hourly' && <HourlyView weather={weather} />}
      {tab === 'radar' && <RadarView place={state.place} />}
      {tab === 'daily' && <DailyView weather={weather} open={setSheet} />}
      {tab === 'alerts' && <AlertsView weather={weather} open={setSheet} />}
      {tab === 'shane' && <ShaneView weather={weather} />}

      <nav className="tab-bar">
        {([
          ['now', Home],
          ['hourly', CalendarDays],
          ['radar', Map],
          ['daily', Sun],
          ['alerts', ShieldAlert],
          ['shane', Video],
        ] as const).map(([id, Icon]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            <Icon />
            <span>{id}</span>
          </button>
        ))}
      </nav>

      {settingsOpen && (
        <SettingsSheet
          state={state}
          weather={weather}
          close={() => setSettingsOpen(false)}
          changeUnit={changeUnit}
          choose={(p: Place) => loadWeather(p, state.unit)}
          remove={removeSaved}
          locate={useLocation}
        />
      )}
      {sheet && <DetailSheet data={sheet} close={() => setSheet(null)} symbol={weather?.symbol || '°'} />}
    </main>
  );
}

function SearchResults({ rows, choose }: { rows: Place[]; choose: (p: Place) => void }) {
  return <section className="search-results panel"><p>Best matches</p>{rows.slice(0, 5).map((r) => <button key={`${r.label}-${r.latitude}`} onClick={() => choose(r)}>{r.label}<ChevronRight /></button>)}</section>;
}

function LoadingCard() {
  return <section className="panel loading"><Loader2 className="spin" /> Loading live weather…</section>;
}

function NowView({ weather, today, loading, save, locate, openSettings }: any) {
  if (!weather) return <LoadingCard />;
  return <section className="view-stack">
    <section className="hero-weather panel">
      <div className="hero-topline"><span>{weather.condition}</span><button onClick={save}><Bookmark /> Save</button></div>
      <div className="hero-main"><div><strong>{weather.temp}{weather.symbol}</strong><p>Feels like {weather.feels}{weather.symbol}</p></div><i>{icon(weather.code)}</i></div>
      <div className="today-range"><span>High {today?.high}{weather.symbol}</span><span>Low {today?.low}{weather.symbol}</span><span>Updated {weather.updated}</span></div>
    </section>
    <section className="next-card panel">
      <CloudRain />
      <div><span>Next precipitation</span><strong>{weather.nextRain ? `${weather.nextRain.pop}% around ${weather.nextRain.time}` : 'None likely soon'}</strong><p>{weather.nextRain ? `${weather.nextRain.precip} in expected this hour` : 'Next 24 hours look mostly dry.'}</p></div>
    </section>
    <section className="metrics-grid">
      <Metric icon={<Wind />} label="Wind" value={`${weather.wind} mph ${weather.windDir}`} sub={`Gust ${weather.gust}`} />
      <Metric icon={<ThermometerSun />} label="Humidity" value={`${weather.humidity}%`} sub={`Dew ${weather.dew}${weather.symbol}`} />
      <Metric icon={<Gauge />} label="AQI" value={weather.aqi ?? '—'} sub="US AQI" />
      <Metric icon={<Compass />} label="Pressure" value={`${weather.pressure}`} sub="hPa" />
    </section>
    <section className="quick-actions">
      <button onClick={locate}><LocateFixed /> Use my location</button>
      <button onClick={openSettings}><Settings /> Locations & units</button>
    </section>
  </section>;
}

function Metric({ icon, label, value, sub }: any) {
  return <div className="metric panel">{icon}<span>{label}</span><strong>{value}</strong><small>{sub}</small></div>;
}

function HourlyView({ weather }: { weather: AppWeather | null }) {
  if (!weather) return <LoadingCard />;
  return <section className="view-stack"><h2>Next 48 hours</h2><div className="timeline panel">{weather.hourly.map((h) => <div key={h.stamp} className="hour-row"><span>{h.time}</span><b>{icon(h.code)}</b><strong>{h.temp}{weather.symbol}</strong><small>{h.pop}% rain</small><em>{h.wind} mph</em></div>)}</div></section>;
}

function RadarView({ place }: { place: Place }) {
  return <section className="view-stack radar-screen"><div className="radar-card panel"><RadarMap lat={place.latitude} lon={place.longitude} label={place.label} /><div className="radar-caption"><strong>Live radar</strong><span>RainViewer timeline. Pinch/drag/zoom on mobile.</span></div></div></section>;
}

function DailyView({ weather, open }: { weather: AppWeather | null; open: (x: any) => void }) {
  if (!weather) return <LoadingCard />;
  return <section className="view-stack"><h2>10-day outlook</h2><div className="daily-list panel">{weather.days.map((d) => <button key={d.date} onClick={() => open(d)}><span>{d.day}</span><b>{icon(d.code)} {describe(d.code)}</b><strong>{d.low}{weather.symbol} / {d.high}{weather.symbol}</strong><small>{d.rainChance}% rain</small></button>)}</div></section>;
}

function AlertsView({ weather, open }: { weather: AppWeather | null; open: (x: any) => void }) {
  if (!weather) return <LoadingCard />;
  return <section className="view-stack"><h2>Weather alerts</h2>{weather.alerts.length ? weather.alerts.map((a) => <button className="alert-row panel" key={`${a.title}-${a.expires}`} onClick={() => open({ ...a, alert: true })}><AlertTriangle /><span><strong>{a.title}</strong><small>{a.severity} · {a.area}</small></span><ChevronRight /></button>) : <section className="empty-state panel"><ShieldAlert /><strong>No active NWS alerts</strong><p>This location is clear right now.</p></section>}</section>;
}

function ShaneView({ weather }: { weather: AppWeather | null }) {
  const line = weather?.alerts.length ? `Lead with ${weather.alerts[0].title}.` : weather?.nextRain ? `Rain chance climbs around ${weather.nextRain.time}.` : 'Quiet weather right now.';
  return <section className="view-stack"><section className="shane-card panel"><Video /><span>Stormin’ Shane briefing</span><h2>{line}</h2><p>This is the product slot for Shane’s human forecast/video posts. The weather engine is ready; next build connects real creator posts, moderation, and notifications.</p></section><section className="panel notification-card"><Bell /><div><strong>Notify followers</strong><p>Future version: push alerts for Shane posts, tornado watches, and severe warnings.</p></div></section></section>;
}

function SettingsSheet({ state, weather, close, changeUnit, choose, remove, locate }: any) {
  return <div className="sheet"><button className="sheet-backdrop" onClick={close} /><section className="sheet-panel panel"><button className="close" onClick={close}><X /></button><h2>Locations</h2><div className="unit-switch"><button className={state.unit === 'fahrenheit' ? 'active' : ''} onClick={() => changeUnit('fahrenheit')}>°F</button><button className={state.unit === 'celsius' ? 'active' : ''} onClick={() => changeUnit('celsius')}>°C</button></div><button className="wide-action" onClick={locate}><LocateFixed /> Use current location</button><h3>Saved</h3>{state.saved.length ? state.saved.map((p: Place) => <div className="saved-row" key={p.label}><button onClick={() => choose(p)}>{p.label}</button><button onClick={() => remove(p)}><Trash2 /></button></div>) : <p className="muted">No saved locations yet. Search a place and hit Save.</p>}<h3>Current</h3><p className="muted">{weather?.placeLabel || state.place.label}</p></section></div>;
}

function DetailSheet({ data, close, symbol }: any) {
  const isAlert = data.alert;
  return <div className="sheet"><button className="sheet-backdrop" onClick={close} /><section className="sheet-panel panel"><button className="close" onClick={close}><X /></button>{isAlert ? <><h2>{data.title}</h2><p>{data.headline || data.description || 'No details provided.'}</p><small>{data.area}</small></> : <><h2>{data.day}</h2><div className="big-icon">{icon(data.code)}</div><p>{describe(data.code)} with a {data.rainChance}% rain chance. High {data.high}{symbol}, low {data.low}{symbol}. UV {data.uv}.</p><small>Sunrise {timeShort(data.sunrise)} · Sunset {timeShort(data.sunset)}</small></>}</section></div>;
}
