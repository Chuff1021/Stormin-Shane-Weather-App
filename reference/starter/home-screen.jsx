// home-screen.jsx — Current conditions + hourly + 10-day + details

function HourlyStrip({ accent, theme }) {
  const t = THEMES[theme] || THEMES.clear;
  const data = theme === 'tornado'
    ? [{h:'Now',t:74,p:90,i:'storm'},{h:'8PM',t:73,p:95,i:'storm'},{h:'9PM',t:71,p:80,i:'rain'},{h:'10PM',t:70,p:60,i:'rain'},{h:'11PM',t:69,p:40,i:'rain'},{h:'12AM',t:68,p:20,i:'cloud'},{h:'1AM',t:67,p:10,i:'cloud'},{h:'2AM',t:66,p:0,i:'cloud'}]
    : theme === 'storm'
    ? [{h:'Now',t:71,p:70,i:'storm'},{h:'5PM',t:70,p:80,i:'storm'},{h:'6PM',t:68,p:70,i:'rain'},{h:'7PM',t:67,p:50,i:'rain'},{h:'8PM',t:66,p:30,i:'rain'},{h:'9PM',t:65,p:10,i:'cloud'},{h:'10PM',t:64,p:0,i:'cloud'},{h:'11PM',t:63,p:0,i:'cloud'}]
    : theme === 'night'
    ? [{h:'Now',t:58,p:0,i:'moon'},{h:'1AM',t:56,p:0,i:'moon'},{h:'2AM',t:55,p:0,i:'moon'},{h:'3AM',t:54,p:0,i:'moon'},{h:'4AM',t:53,p:0,i:'moon'},{h:'5AM',t:53,p:0,i:'moon'},{h:'6AM',t:55,p:0,i:'sunrise'},{h:'7AM',t:60,p:0,i:'sun'}]
    : [{h:'Now',t:78,p:0,i:'sun'},{h:'2PM',t:80,p:0,i:'sun'},{h:'3PM',t:81,p:5,i:'partlysunny'},{h:'4PM',t:80,p:10,i:'partlysunny'},{h:'5PM',t:78,p:20,i:'partlysunny'},{h:'6PM',t:75,p:10,i:'cloud'},{h:'7PM',t:71,p:0,i:'cloud'},{h:'8PM',t:68,p:0,i:'moon'}];

  return (
    <Glass dark padding={0} radius={22}>
      <div style={{ padding: '14px 16px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Hourly Forecast</div>
        {theme === 'tornado' && <div style={{ fontSize: 10, fontWeight: 600, color: '#fbbf24' }}>⚡ severe</div>}
      </div>
      <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ display: 'flex', overflow: 'hidden', padding: '12px 8px 14px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 7, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: i===0?'#fff':'rgba(255,255,255,0.7)' }}>{d.h}</div>
            <div style={{ position:'relative' }}>
              <WIcon kind={d.i} size={26} color="#fff" accent={d.i==='storm'?'#fbbf24':d.i==='sun'?'#fde047':'#fff'} />
            </div>
            {d.p > 0 && (
              <div style={{ fontSize: 10, fontWeight: 600, color: '#7dd3fc' }}>{d.p}%</div>
            )}
            {d.p === 0 && <div style={{ height: 13 }} />}
            <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: -0.4 }}>{d.t}°</div>
          </div>
        ))}
      </div>
    </Glass>
  );
}

function TenDayForecast({ theme }) {
  const days = [
    { d: 'Today', i: theme === 'tornado' ? 'storm' : theme === 'storm' ? 'storm' : 'partlysunny', lo: 64, hi: 81, rng: [.25,.85], pop: theme==='tornado'?90:40 },
    { d: 'Tue', i: 'rain', lo: 60, hi: 74, rng: [.18,.7], pop: 70 },
    { d: 'Wed', i: 'storm', lo: 62, hi: 76, rng: [.2,.74], pop: 80 },
    { d: 'Thu', i: 'partlysunny', lo: 65, hi: 79, rng: [.26,.81], pop: 20 },
    { d: 'Fri', i: 'sun', lo: 67, hi: 84, rng: [.3,.92], pop: 0 },
    { d: 'Sat', i: 'sun', lo: 68, hi: 86, rng: [.32,.96], pop: 0 },
    { d: 'Sun', i: 'partlysunny', lo: 66, hi: 82, rng: [.28,.86], pop: 10 },
    { d: 'Mon', i: 'cloud', lo: 63, hi: 75, rng: [.22,.72], pop: 30 },
    { d: 'Tue', i: 'rain', lo: 59, hi: 71, rng: [.16,.66], pop: 60 },
    { d: 'Wed', i: 'partlysunny', lo: 61, hi: 76, rng: [.2,.78], pop: 15 },
  ];
  return (
    <Glass dark padding={0} radius={22}>
      <div style={{ padding: '14px 16px 8px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase' }}>10-Day Forecast</div>
      <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ padding: '4px 16px' }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '54px 28px 36px 1fr 36px', gap: 8, alignItems: 'center', padding: '10px 0', borderBottom: i < days.length-1 ? '0.5px solid rgba(255,255,255,0.07)':'none' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{d.d}</div>
            <WIcon kind={d.i} size={22} color="#fff" accent={d.i==='storm'?'#fbbf24':d.i==='sun'?'#fde047':d.i==='rain'?'#7dd3fc':'#fff'} />
            <div style={{ fontSize: 11, fontWeight: 600, color: '#7dd3fc', textAlign:'right' }}>{d.pop > 0 ? d.pop+'%':''}</div>
            <div style={{ position:'relative', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }}>
              <div style={{ position:'absolute', left: d.rng[0]*100+'%', right: (1-d.rng[1])*100+'%', top:0, bottom:0, borderRadius: 2, background: 'linear-gradient(90deg, #38bdf8, #fbbf24, #ef4444)' }} />
              {i===0 && <div style={{ position:'absolute', left: '64%', top: -3, width: 10, height: 10, borderRadius:'50%', background:'#fff', border:'2px solid rgba(0,0,0,0.4)' }} />}
            </div>
            <div style={{ fontSize: 16, color: '#fff', textAlign: 'right', fontWeight: 500 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{d.lo}°</span>
              <span style={{ marginLeft: 4 }}>{d.hi}°</span>
            </div>
          </div>
        ))}
      </div>
    </Glass>
  );
}

function DetailTile({ icon, label, value, sub, accent='#7dd3fc', children }) {
  return (
    <Glass dark padding={14} radius={20}>
      <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
        <WIcon kind={icon} size={13} color="rgba(255,255,255,0.55)" accent="rgba(255,255,255,0.55)" />
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 400, color: '#fff', letterSpacing: -0.6, lineHeight: 1.05 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{sub}</div>}
      {children}
    </Glass>
  );
}

function WindCompass() {
  return (
    <DetailTile icon="wind" label="Wind" value="" >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 120, margin: '4px auto 0' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 6" />
          {['N','E','S','W'].map((c, i) => {
            const θ = (i * Math.PI) / 2 - Math.PI/2;
            return <text key={c} x={50 + Math.cos(θ)*36} y={50 + Math.sin(θ)*36 + 3.5} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="-apple-system" fontWeight="600">{c}</text>;
          })}
          <g transform="rotate(225 50 50)">
            <path d="M50 14 L54 50 L50 46 L46 50 Z" fill="#fbbf24" />
            <path d="M50 86 L54 50 L50 54 L46 50 Z" fill="rgba(255,255,255,0.4)" />
          </g>
          <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="500" fill="#fff" fontFamily="-apple-system" letterSpacing="-1">14</text>
          <text x="50" y="60" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="-apple-system">mph SW</text>
        </svg>
      </div>
    </DetailTile>
  );
}

function HomeScreen({ theme = 'storm', accent = '#22d3ee', dark = true, density = 'regular' }) {
  const t = THEMES[theme] || THEMES.clear;
  const temp = theme === 'tornado' ? 74 : theme === 'storm' ? 71 : theme === 'night' ? 58 : 80;
  const feels = temp + (theme === 'tornado' ? 4 : theme === 'storm' ? 2 : 0);
  const desc = t.label;
  const hi = theme === 'night' ? 78 : 84, lo = theme === 'night' ? 56 : 64;

  return (
    <DynamicBg theme={theme}>
      <div style={{ position: 'relative', height: '100%', overflow: 'auto', paddingBottom: 110 }}>
        {/* Status bar spacer */}
        <div style={{ height: 54 }} />

        {/* Severe alert banner — only when active */}
        {theme === 'tornado' && (
          <div style={{ margin: '8px 12px 0', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              padding: '10px 14px', display:'flex', alignItems:'center', gap: 10,
              background: 'linear-gradient(90deg, #b91c1c, #dc2626)',
              boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
            }}>
              <WIcon kind="alert" size={18} color="#fff" accent="#fff" />
              <div style={{ flex: 1, color: '#fff' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Tornado Warning</div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>Take shelter now · Until 8:15 PM CDT</div>
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14"><path d="M1 1l6 6-6 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            </div>
          </div>
        )}

        {/* Hero */}
        <div style={{ padding: '18px 20px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.4, marginBottom: 2 }}>Republic</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Greene County · MO</div>
          <div style={{ fontSize: 88, fontWeight: 200, letterSpacing: -4, lineHeight: 1, fontFamily: '-apple-system, "SF Pro Display"' }}>
            {temp}°
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, opacity: 0.95, marginTop: 4 }}>{desc}</div>
          <div style={{ fontSize: 14, opacity: 0.75, marginTop: 2 }}>H: {hi}°  L: {lo}°  ·  Feels like {feels}°</div>
        </div>

        {/* Shane's update card — only when she's published recently */}
        <div style={{ padding: '0 12px 12px' }}>
          <Glass dark radius={20} padding={0}>
            <div style={{ display:'flex', alignItems:'center', gap: 12, padding: 12 }}>
              <div style={{ width: 56, height: 72, borderRadius: 12, background: `linear-gradient(135deg, ${theme==='tornado'?'#7f1d1d,#450a0a':theme==='storm'?'#1e3a5f,#0f172a':'#0c4a6e,#0369a1'})`, position: 'relative', overflow:'hidden', flexShrink: 0 }}>
                <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="9" height="11" viewBox="0 0 9 11"><path d="M0 0 L9 5.5 L0 11 Z" fill="#fff"/></svg>
                  </div>
                </div>
                <div style={{ position:'absolute', top: 6, left: 6, padding: '1px 5px', borderRadius: 4, background: '#ef4444', fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>LIVE</div>
              </div>
              <div style={{ flex: 1, color: '#fff', minWidth: 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  Stormin' Shane · 4 min ago
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical' }}>
                  {theme === 'tornado' ? 'Rotation confirmed near Brookline — heading NE at 35mph.' : 'Big storms developing west — keep eyes south of I-44.'}
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>2:42 · 1.2k watching</div>
              </div>
            </div>
          </Glass>
        </div>

        {/* Hourly */}
        <div style={{ padding: '0 12px 12px' }}>
          <HourlyStrip accent={accent} theme={theme} />
        </div>

        {/* 10-day */}
        <div style={{ padding: '0 12px 12px' }}>
          <TenDayForecast theme={theme} />
        </div>

        {/* AFD discussion (snippet) */}
        <div style={{ padding: '0 12px 12px' }}>
          <Glass dark padding={16} radius={20}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, display:'flex', justifyContent:'space-between' }}>
              <span>Forecast Discussion</span>
              <span style={{ color: accent, fontWeight: 600 }}>NWS SGF</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)' }}>
              {theme === 'tornado'
                ? '...A potent shortwave trough is overspreading the area this afternoon, with a strong LLJ and steep mid-level lapse rates supporting supercells capable of strong tornadoes through the evening...'
                : 'A subtle shortwave aloft will bring afternoon clouds with isolated showers possible. Otherwise, near-normal temperatures and light winds are anticipated through tomorrow.'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Read full discussion →</div>
          </Glass>
        </div>

        {/* Detail grid */}
        <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <WindCompass />
          <DetailTile icon="uv" label="UV Index" value={theme==='night'?'0':'5'} sub={theme==='night'?'Low':'Moderate'} >
            <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: 'linear-gradient(90deg, #34d399, #fde047, #f97316, #ef4444, #a855f7)', position:'relative' }}>
              <div style={{ position:'absolute', top: -2, left: theme==='night'?'2%':'45%', width: 9, height: 9, borderRadius:'50%', background:'#fff', boxShadow:'0 0 0 2px rgba(0,0,0,0.4)' }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>Use sun protection.</div>
          </DetailTile>
          <DetailTile icon="sunrise" label="Sunrise" value="6:24" sub="Sunset 7:48 PM">
            <div style={{ marginTop: 10, height: 28, position:'relative' }}>
              <svg viewBox="0 0 100 30" style={{ width:'100%', height:'100%' }}>
                <path d="M5 28 Q50 -10 95 28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 3" />
                <path d="M5 28 Q35 5 50 5" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <circle cx="50" cy="5" r="3" fill="#fbbf24" />
                <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
              </svg>
            </div>
          </DetailTile>
          <DetailTile icon="drop" label="Humidity" value={theme==='tornado'?'82%':'54%'} sub={theme==='tornado'?'Dew point 68°':'Dew point 60°'} accent="#7dd3fc" />
          <DetailTile icon="gauge" label="Pressure" value="29.74" sub={theme==='tornado'?'↓ Falling fast':'→ Steady'} >
            <div style={{ marginTop: 8, position:'relative', height: 22 }}>
              <svg viewBox="0 0 100 22" style={{ width:'100%' }}>
                <path d="M50 4 A18 18 0 0 1 86 18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <path d="M50 4 A18 18 0 0 1 14 18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="50" y1="18" x2={theme==='tornado'?20:54} y2={theme==='tornado'?10:5} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="18" r="2" fill="#fff" />
              </svg>
            </div>
          </DetailTile>
          <DetailTile icon="eye" label="Visibility" value={theme==='tornado'?'1.5 mi':'10 mi'} sub={theme==='tornado'?'Rain & dust':'Perfectly clear'} />
          <DetailTile icon="aqi" label="Air Quality" value="38" sub="Good · PM2.5">
            <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: 'linear-gradient(90deg, #34d399, #fde047, #f97316, #ef4444)', position:'relative' }}>
              <div style={{ position:'absolute', top: -2, left: '20%', width: 9, height: 9, borderRadius:'50%', background:'#fff', boxShadow:'0 0 0 2px rgba(0,0,0,0.4)' }} />
            </div>
          </DetailTile>
        </div>

        <div style={{ padding: '12px 16px 0', textAlign:'center', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
          Data: NWS Springfield · Open-Meteo · AirNow
        </div>
      </div>
    </DynamicBg>
  );
}

Object.assign(window, { HomeScreen, HourlyStrip, TenDayForecast, DetailTile });
