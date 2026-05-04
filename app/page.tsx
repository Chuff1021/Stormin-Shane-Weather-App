import { AlertTriangle, Bell, CloudLightning, Compass, Droplets, Eye, Gauge, Map, Moon, Play, Radio, ShieldAlert, Sun, Tornado, Video, Wind } from 'lucide-react';

const hours = [
  ['Now', '72°', '55%', '⛈'],
  ['5 PM', '71°', '70%', '🌧'],
  ['6 PM', '69°', '82%', '⛈'],
  ['7 PM', '67°', '48%', '🌦'],
  ['8 PM', '65°', '20%', '☁️'],
];

const days = [
  ['Today', 'Strong storms', '78°', '61°'],
  ['Tue', 'Showers', '70°', '55°'],
  ['Wed', 'Partly cloudy', '73°', '52°'],
  ['Thu', 'Sunny', '76°', '54°'],
  ['Fri', 'Storm chance', '79°', '63°'],
];

const metrics = [
  ['Wind', '18 mph SW', Wind],
  ['Humidity', '68%', Droplets],
  ['Dew Point', '61°', Gauge],
  ['Visibility', '9 mi', Eye],
  ['UV Index', 'Moderate', Sun],
  ['Moon', 'Waxing', Moon],
];

export default function Page() {
  return (
    <main className="shell">
      <section className="phone" aria-label="Stormin Shane app preview">
        <div className="storm-bg" />
        <header className="topbar">
          <div>
            <p className="eyebrow">Live storm desk</p>
            <h1>Stormin&apos; Shane</h1>
          </div>
          <div className="logo"><CloudLightning size={28} /></div>
        </header>

        <div className="alert"><AlertTriangle size={20} /><div><b>Severe Thunderstorm Watch</b><span>Until 9:00 PM • Tap for timing</span></div></div>

        <section className="hero card">
          <div>
            <p className="location">Columbus, Ohio</p>
            <div className="temp">72°</div>
            <h2>Storms Developing</h2>
            <p>Feels like 74° • H:78° L:61°</p>
          </div>
          <div className="weather-mark"><CloudLightning size={74} /></div>
        </section>

        <section className="hourly">
          {hours.map(([time, temp, pop, icon]) => <div className="hour card" key={time}><span>{time}</span><strong>{icon}</strong><b>{temp}</b><i style={{height: pop}} /></div>)}
        </section>

        <section className="grid">
          <div className="radar card feature-card"><Map /><div><b>Radar</b><span>RainViewer playback + warning polygons</span></div><Play className="play" /></div>
          <div className="tornado card feature-card"><Tornado /><div><b>Tornado Tracker</b><span>NWS alerts, SPC outlooks, chasers</span></div></div>
        </section>

        <section className="daily card">
          {days.map(([day, desc, hi, lo]) => <div className="day" key={day}><b>{day}</b><span>{desc}</span><strong>{hi} / {lo}</strong></div>)}
        </section>

        <section className="metrics">
          {metrics.map(([label, value, Icon]) => <div className="metric card" key={label as string}><Icon size={18}/><span>{label as string}</span><b>{value as string}</b></div>)}
        </section>

        <section className="creator card">
          <div className="record"><Video size={26}/></div>
          <div><b>Shane&apos;s Dashboard</b><span>Quick-record update, auto-tag conditions, publish to the feed.</span></div>
          <button>Unlock</button>
        </section>

        <nav className="tabbar">
          <CloudLightning/><Map/><Tornado/><Video/><Bell/>
        </nav>
      </section>

      <aside className="brief">
        <p className="eyebrow">Preview build</p>
        <h2>Flagship weather brand, not a generic forecast app.</h2>
        <p>This Vercel preview is the visual target while the real product remains native SwiftUI for iPhone.</p>
        <div className="pillrow"><span>iOS 17+</span><span>Radar-first</span><span>Creator mode</span><span>Severe alerts</span></div>
        <div className="quality"><ShieldAlert/><p><b>Quality bar:</b> fast glanceability, high contrast, one-handed storm use, native-feeling motion, and zero legal shortcuts on chaser/public weather data.</p></div>
      </aside>
    </main>
  );
}
