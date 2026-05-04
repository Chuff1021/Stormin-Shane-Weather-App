// shared.jsx — design tokens, icons, and small primitives used by all screens

// ─────────────────────────────────────────────────────────────
// Theme tokens — Apple-native premium with storm-cloud base
// ─────────────────────────────────────────────────────────────
const THEMES = {
  // calm: clear afternoon
  clear: {
    sky: ['#3a7fb8', '#5ea0d6', '#8fc4e8'],
    accent: '#7dd3fc',
    label: 'Mostly sunny',
    icon: 'sun',
    isDark: false,
  },
  // dramatic: severe storm rolling in
  storm: {
    sky: ['#1a2332', '#2d3b4f', '#3d4d63'],
    accent: '#fbbf24',
    label: 'Severe Thunderstorm',
    icon: 'storm',
    isDark: true,
  },
  // emergency: tornado warning active
  tornado: {
    sky: ['#1a0e0e', '#3d1818', '#5b1e1e'],
    accent: '#ef4444',
    label: 'Tornado Warning',
    icon: 'tornado',
    isDark: true,
  },
  // night calm
  night: {
    sky: ['#0b1726', '#1a2942', '#2c3e5e'],
    accent: '#a78bfa',
    label: 'Clear · Cool',
    icon: 'moon',
    isDark: true,
  },
};

const ACCENTS = {
  cyan: { hi: '#22d3ee', lo: '#0891b2', glow: 'rgba(34,211,238,.4)' },
  amber: { hi: '#fbbf24', lo: '#d97706', glow: 'rgba(251,191,36,.4)' },
  magenta: { hi: '#e879f9', lo: '#a21caf', glow: 'rgba(232,121,249,.4)' },
};

// ─────────────────────────────────────────────────────────────
// Glass surface — used everywhere
// ─────────────────────────────────────────────────────────────
function Glass({ children, style = {}, dark = true, strength = 1, radius = 22, padding = 16, onClick }) {
  const tint = dark
    ? `rgba(255,255,255,${0.06 * strength})`
    : `rgba(255,255,255,${0.55 * strength})`;
  const border = dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.6)';
  return (
    <div onClick={onClick} style={{
      borderRadius: radius,
      padding,
      position: 'relative',
      overflow: 'hidden',
      background: tint,
      backdropFilter: 'blur(24px) saturate(170%)',
      WebkitBackdropFilter: 'blur(24px) saturate(170%)',
      border: `0.5px solid ${border}`,
      boxShadow: dark
        ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.3)'
        : 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Weather icons (SF Symbols-style, hand-drawn SVG)
// ─────────────────────────────────────────────────────────────
function WIcon({ kind = 'sun', size = 28, color = '#fff', accent }) {
  const a = accent || color;
  const s = size;
  const stroke = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (kind) {
    case 'sun':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="6" fill={a} />
          {[...Array(8)].map((_, i) => {
            const θ = (i * Math.PI) / 4;
            const x1 = 16 + Math.cos(θ) * 9, y1 = 16 + Math.sin(θ) * 9;
            const x2 = 16 + Math.cos(θ) * 13, y2 = 16 + Math.sin(θ) * 13;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth="1.8" strokeLinecap="round" />;
          })}
        </svg>
      );
    case 'cloud':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M9 22 Q4 22 4 17 Q4 13 8 12 Q9 7 14 7 Q20 7 21 12 Q26 12 26 17 Q26 22 21 22 Z" fill={color} fillOpacity="0.85" />
        </svg>
      );
    case 'partlysunny':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <circle cx="11" cy="11" r="4.5" fill={a} />
          {[...Array(6)].map((_, i) => {
            const θ = (i * Math.PI) / 3 - Math.PI / 2;
            return <line key={i} x1={11 + Math.cos(θ) * 6.5} y1={11 + Math.sin(θ) * 6.5} x2={11 + Math.cos(θ) * 9} y2={11 + Math.sin(θ) * 9} stroke={a} strokeWidth="1.6" strokeLinecap="round" />;
          })}
          <path d="M12 23 Q8 23 8 19 Q8 16 11 15 Q12 11 17 11 Q22 11 23 15 Q27 15 27 19 Q27 23 23 23 Z" fill={color} fillOpacity="0.92" />
        </svg>
      );
    case 'rain':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M9 18 Q4 18 4 13 Q4 9 8 8 Q9 4 14 4 Q20 4 21 9 Q26 9 26 13 Q26 18 21 18 Z" fill={color} fillOpacity="0.8" />
          <line x1="11" y1="22" x2="9" y2="27" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="16" y1="22" x2="14" y2="27" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="21" y1="22" x2="19" y2="27" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'storm':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M9 17 Q4 17 4 12 Q4 8 8 7 Q9 3 14 3 Q20 3 21 8 Q26 8 26 12 Q26 17 21 17 Z" fill={color} fillOpacity="0.9" />
          <path d="M16 18 L12 25 L15 25 L13 30 L19 22 L16 22 Z" fill={a} />
        </svg>
      );
    case 'snow':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M9 17 Q4 17 4 12 Q4 8 8 7 Q9 3 14 3 Q20 3 21 8 Q26 8 26 12 Q26 17 21 17 Z" fill={color} fillOpacity="0.85" />
          {[[10, 24], [16, 27], [22, 24]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <line x1="-2" y1="0" x2="2" y2="0" stroke={a} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="0" y1="-2" x2="0" y2="2" stroke={a} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="-1.5" y1="-1.5" x2="1.5" y2="1.5" stroke={a} strokeWidth="1.4" strokeLinecap="round" />
              <line x1="1.5" y1="-1.5" x2="-1.5" y2="1.5" stroke={a} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );
    case 'moon':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M22 18 A10 10 0 1 1 14 6 A8 8 0 0 0 22 18 Z" fill={a} />
        </svg>
      );
    case 'tornado':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M5 6 H27 M6 10 H26 M8 14 H24 M10 18 H22 M13 22 H19 M15 26 H17" stroke={a} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'wind':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M4 11 H20 A3 3 0 1 0 17 8" />
          <path d="M4 16 H24 A3.5 3.5 0 1 1 21 19.5" />
          <path d="M4 22 H14 A2.5 2.5 0 1 1 11.5 24.5" />
        </svg>
      );
    case 'compass':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <circle cx="16" cy="16" r="11" />
          <path d="M16 8 L19 16 L16 14 L13 16 Z" fill={color} stroke="none" />
        </svg>
      );
    case 'drop':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M16 4 Q9 13 9 19 A7 7 0 0 0 23 19 Q23 13 16 4 Z" fill={a} />
        </svg>
      );
    case 'eye':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M3 16 Q9 8 16 8 Q23 8 29 16 Q23 24 16 24 Q9 24 3 16 Z" />
          <circle cx="16" cy="16" r="3.5" fill={color} stroke="none" />
        </svg>
      );
    case 'gauge':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M5 22 A12 12 0 0 1 27 22" />
          <line x1="16" y1="22" x2="22" y2="13" />
          <circle cx="16" cy="22" r="1.5" fill={color} stroke="none" />
        </svg>
      );
    case 'sunrise':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M5 24 H27" />
          <path d="M9 20 A7 7 0 0 1 23 20" fill={a} stroke="none" />
          <line x1="16" y1="6" x2="16" y2="10" />
          <line x1="7" y1="13" x2="9.5" y2="15" />
          <line x1="25" y1="13" x2="22.5" y2="15" />
        </svg>
      );
    case 'uv':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="5" fill={a} />
          {[...Array(8)].map((_, i) => {
            const θ = (i * Math.PI) / 4;
            return <line key={i} x1={16 + Math.cos(θ) * 7.5} y1={16 + Math.sin(θ) * 7.5} x2={16 + Math.cos(θ) * 11} y2={16 + Math.sin(θ) * 11} stroke={a} strokeWidth="1.6" strokeLinecap="round" />;
          })}
        </svg>
      );
    case 'aqi':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M16 5 Q20 12 20 16 Q20 20 16 20 Q12 20 12 16 Q12 12 16 5 Z" fill={a} stroke="none" />
          <path d="M8 24 Q14 22 16 24 Q18 26 24 24" />
        </svg>
      );
    case 'alert':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M16 4 L29 26 H3 Z" fill={a} />
          <line x1="16" y1="13" x2="16" y2="20" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="23" r="1.4" fill="#000" />
        </svg>
      );
    case 'pin':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M16 3 Q7 3 7 13 Q7 21 16 29 Q25 21 25 13 Q25 3 16 3 Z" fill={a} />
          <circle cx="16" cy="13" r="3.5" fill="#fff" />
        </svg>
      );
    case 'plus':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke} strokeWidth="2.4">
          <line x1="16" y1="6" x2="16" y2="26" />
          <line x1="6" y1="16" x2="26" y2="16" />
        </svg>
      );
    case 'search':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke} strokeWidth="2">
          <circle cx="14" cy="14" r="8" />
          <line x1="20" y1="20" x2="26" y2="26" />
        </svg>
      );
    case 'list':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke} strokeWidth="2">
          <line x1="6" y1="9" x2="26" y2="9" />
          <line x1="6" y1="16" x2="26" y2="16" />
          <line x1="6" y1="23" x2="26" y2="23" />
        </svg>
      );
    case 'play':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <path d="M11 7 L24 16 L11 25 Z" fill={a} />
        </svg>
      );
    case 'record':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="16" cy="16" r="9" fill={a} />
        </svg>
      );
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Tab bar — bottom nav with liquid glass
// ─────────────────────────────────────────────────────────────
function TabBar({ active, onChange, accent = '#22d3ee', dark = true }) {
  const tabs = [
    { id: 'home', label: 'Weather', icon: 'partlysunny' },
    { id: 'radar', label: 'Radar', icon: 'cloud' },
    { id: 'tornado', label: 'Tornado', icon: 'tornado' },
    { id: 'feed', label: "Shane", icon: 'play' },
    { id: 'locations', label: 'Locations', icon: 'list' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 24, zIndex: 40,
      borderRadius: 28,
      background: dark ? 'rgba(20,20,28,0.55)' : 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: `0.5px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
      padding: '8px 4px',
      display: 'flex',
    }}>
      {tabs.map((t) => {
        const on = active === t.id;
        const c = on ? accent : (dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)');
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '6px 4px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, color: c,
            fontFamily: '-apple-system, system-ui', fontSize: 10, fontWeight: 600,
            letterSpacing: 0.1,
          }}>
            <WIcon kind={t.icon} size={22} color={c} accent={c} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic background — gradient + animated atmosphere
// ─────────────────────────────────────────────────────────────
function DynamicBg({ theme = 'clear', children }) {
  const t = THEMES[theme] || THEMES.clear;
  const [a, b, c] = t.sky;
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: `linear-gradient(180deg, ${a} 0%, ${b} 55%, ${c} 100%)`,
    }}>
      {/* atmospheric layer */}
      {theme === 'storm' && <RainLayer />}
      {theme === 'tornado' && <LightningLayer />}
      {theme === 'clear' && <SunHaze />}
      {theme === 'night' && <StarLayer />}
      {/* vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

function RainLayer() {
  const drops = React.useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    dur: 0.5 + Math.random() * 0.5,
    h: 14 + Math.random() * 10,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
      <style>{`@keyframes rain {0%{transform:translateY(-30px)}100%{transform:translateY(900px)}}`}</style>
      {drops.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left + '%', top: 0,
          width: 1, height: d.h,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.7))',
          animation: `rain ${d.dur}s linear ${d.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function LightningLayer() {
  return (
    <>
      <RainLayer />
      <style>{`@keyframes flash {0%,93%,100%{opacity:0}94%,96%{opacity:.5}95%{opacity:.85}}`}</style>
      <div style={{
        position: 'absolute', inset: 0, background: '#fff',
        animation: 'flash 6s linear infinite', pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />
      {/* dust / debris swirl */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 70%, rgba(120,40,40,0.25), transparent 70%)',
      }} />
    </>
  );
}

function SunHaze() {
  return (
    <div style={{
      position: 'absolute', top: -40, right: -40, width: 240, height: 240,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,230,170,0.55) 0%, rgba(255,200,120,0.2) 40%, transparent 70%)',
      pointerEvents: 'none',
    }} />
  );
}

function StarLayer() {
  const stars = React.useMemo(() => Array.from({ length: 60 }, () => ({
    x: Math.random() * 100, y: Math.random() * 70,
    s: Math.random() * 1.5 + 0.5,
    o: 0.3 + Math.random() * 0.6,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.x + '%', top: s.y + '%',
          width: s.s, height: s.s, borderRadius: '50%',
          background: '#fff', opacity: s.o,
          boxShadow: `0 0 ${s.s * 2}px rgba(255,255,255,${s.o})`,
        }} />
      ))}
    </div>
  );
}

Object.assign(window, { THEMES, ACCENTS, Glass, WIcon, TabBar, DynamicBg });
