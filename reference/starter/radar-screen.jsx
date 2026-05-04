// radar-screen.jsx — Full-screen interactive radar with layers + scrubber

function RadarBase({ theme }) {
  // Stylized dark map: roads + state borders + city dots
  return (
    <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="rb" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a1220"/>
          <stop offset="1" stopColor="#040810"/>
        </linearGradient>
        <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M38 0H0V38" fill="none" stroke="rgba(80,120,180,0.06)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="380" height="760" fill="url(#rb)"/>
      <rect width="380" height="760" fill="url(#grid)"/>
      {/* state outlines */}
      <path d="M0 240 L380 220" stroke="rgba(120,140,180,0.25)" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
      <path d="M0 540 L380 530" stroke="rgba(120,140,180,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
      {/* highways */}
      <path d="M-10 380 Q150 360 200 400 T400 410" stroke="rgba(255,200,80,0.18)" strokeWidth="1.5" fill="none"/>
      <path d="M180 -10 Q200 200 190 400 Q180 600 200 770" stroke="rgba(255,200,80,0.14)" strokeWidth="1.2" fill="none"/>
      <path d="M50 100 Q150 250 250 350 Q300 450 350 600" stroke="rgba(80,120,160,0.18)" strokeWidth="0.8" fill="none"/>
      {/* lakes */}
      <path d="M270 480 Q310 470 320 500 Q330 530 290 540 Q260 530 270 480 Z" fill="rgba(40,80,140,0.4)"/>
      {/* cities */}
      {[
        {x:190,y:400,n:'Springfield', big:true},
        {x:175,y:412,n:'Republic', big:false, hi:true},
        {x:230,y:380,n:'Strafford'},
        {x:140,y:430,n:'Billings'},
        {x:220,y:440,n:'Ozark'},
        {x:120,y:380,n:'Halltown'},
        {x:90,y:340,n:'Carthage'},
        {x:280,y:330,n:'Lebanon'},
      ].map((c,i)=>(
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={c.hi?5:c.big?3:2} fill={c.hi?'#fff':'rgba(220,230,250,0.7)'} />
          {c.hi && <circle cx={c.x} cy={c.y} r="9" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1"/>}
          <text x={c.x+8} y={c.y+3} fontSize={c.big?10:8} fill={c.hi?'#fff':'rgba(220,230,250,0.65)'} fontFamily="-apple-system" fontWeight={c.hi?600:500}>{c.n}</text>
        </g>
      ))}
    </svg>
  );
}

function RadarReturns({ theme }) {
  // NWS-standard reflectivity blobs (greens → yellows → reds → purples)
  // Heavy supercell in tornado mode
  if (theme === 'tornado') {
    return (
      <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', mixBlendMode:'screen', opacity: 0.92 }}>
        <defs>
          {/* hook echo signature */}
          <radialGradient id="cell1" cx="0.5" cy="0.5">
            <stop offset="0" stopColor="#ff00ff" stopOpacity="0.95"/>
            <stop offset="0.15" stopColor="#e00000" stopOpacity="0.9"/>
            <stop offset="0.4" stopColor="#ff8000" stopOpacity="0.8"/>
            <stop offset="0.65" stopColor="#ffff00" stopOpacity="0.7"/>
            <stop offset="0.85" stopColor="#00b800" stopOpacity="0.6"/>
            <stop offset="1" stopColor="#005000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cell2" cx="0.5" cy="0.5">
            <stop offset="0" stopColor="#ff8000" stopOpacity="0.85"/>
            <stop offset="0.4" stopColor="#ffff00" stopOpacity="0.7"/>
            <stop offset="0.8" stopColor="#00b800" stopOpacity="0.5"/>
            <stop offset="1" stopColor="#005000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* main supercell */}
        <ellipse cx="160" cy="395" rx="58" ry="42" fill="url(#cell1)"/>
        <ellipse cx="155" cy="398" rx="22" ry="18" fill="url(#cell1)" transform="rotate(-30 155 398)"/>
        {/* hook curl */}
        <path d="M120 410 Q105 430 115 445 Q130 450 140 435" fill="none" stroke="#ff00ff" strokeWidth="6" strokeLinecap="round" opacity="0.9"/>
        {/* trailing line */}
        <ellipse cx="100" cy="350" rx="42" ry="28" fill="url(#cell2)"/>
        <ellipse cx="60" cy="320" rx="36" ry="22" fill="url(#cell2)" opacity="0.7"/>
        {/* outflow */}
        <ellipse cx="240" cy="450" rx="55" ry="30" fill="url(#cell2)" opacity="0.5"/>
      </svg>
    );
  }
  if (theme === 'storm') {
    return (
      <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', mixBlendMode:'screen', opacity:0.85 }}>
        <defs>
          <radialGradient id="cellS" cx="0.5" cy="0.5">
            <stop offset="0" stopColor="#e00000" stopOpacity="0.85"/>
            <stop offset="0.3" stopColor="#ff8000" stopOpacity="0.75"/>
            <stop offset="0.6" stopColor="#ffff00" stopOpacity="0.6"/>
            <stop offset="0.85" stopColor="#00b800" stopOpacity="0.4"/>
            <stop offset="1" stopColor="#005000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="140" cy="380" rx="80" ry="50" fill="url(#cellS)"/>
        <ellipse cx="220" cy="440" rx="50" ry="35" fill="url(#cellS)" opacity="0.7"/>
        <ellipse cx="80" cy="320" rx="45" ry="30" fill="url(#cellS)" opacity="0.5"/>
      </svg>
    );
  }
  // light scattered for clear / night
  return (
    <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', mixBlendMode:'screen', opacity:0.4 }}>
      <defs>
        <radialGradient id="cellL" cx="0.5" cy="0.5">
          <stop offset="0" stopColor="#00b800" stopOpacity="0.6"/>
          <stop offset="0.7" stopColor="#005000" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#005000" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="200" rx="60" ry="35" fill="url(#cellL)"/>
      <ellipse cx="320" cy="600" rx="50" ry="30" fill="url(#cellL)"/>
    </svg>
  );
}

function WarningPolygons({ theme }) {
  if (theme !== 'tornado') return null;
  return (
    <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      {/* tornado warning polygon */}
      <path d="M95 360 L210 340 L240 470 L100 460 Z" fill="rgba(220,38,38,0.18)" stroke="#ef4444" strokeWidth="2"/>
      {/* severe tstorm warning */}
      <path d="M40 280 L110 270 L120 360 L50 370 Z" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3"/>
      {/* storm track */}
      <path d="M100 420 Q150 410 200 395 Q250 385 300 370" stroke="#fff" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.7"/>
      <circle cx="160" cy="408" r="4" fill="#fff"/>
      <circle cx="160" cy="408" r="9" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <text x="170" y="402" fontSize="9" fontWeight="700" fill="#fff" fontFamily="-apple-system">TVS</text>
    </svg>
  );
}

function RadarScreen({ theme = 'tornado', accent = '#22d3ee', palette = 'nws' }) {
  const [layer, setLayer] = React.useState('reflectivity');
  const [time, setTime] = React.useState(0.7);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime(t => (t + 0.04) % 1.0), 80);
    return () => clearInterval(id);
  }, [playing]);

  const layers = [
    { id: 'reflectivity', label: 'Reflectivity' },
    { id: 'velocity', label: 'Velocity' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'lightning', label: 'Lightning' },
  ];

  // time labels
  const minutes = Math.round((time - 0.5) * 120); // -60 to +30 ish
  const tLabel = minutes === 0 ? 'Now' : minutes < 0 ? `${minutes} min` : `+${minutes} min`;

  return (
    <div style={{ position:'absolute', inset: 0, background: '#04080f', overflow:'hidden' }}>
      <RadarBase theme={theme} />
      <RadarReturns theme={theme} />
      <WarningPolygons theme={theme} />

      {/* lightning strikes */}
      {(theme === 'storm' || theme === 'tornado') && (
        <svg viewBox="0 0 380 760" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
          {[[145,395],[170,405],[110,380],[200,420],[125,415]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="2.5" fill="#fde047"/>
              <circle cx={x} cy={y} r="6" fill="none" stroke="#fde047" strokeOpacity="0.5"/>
            </g>
          ))}
        </svg>
      )}

      {/* Top status bar overlay */}
      <div style={{ position:'absolute', top: 54, left: 12, right: 12, zIndex: 10, display:'flex', gap: 8 }}>
        <Glass dark padding={0} radius={20} style={{ flex: 1 }}>
          <div style={{ padding: '10px 14px', display:'flex', alignItems:'center', gap: 10 }}>
            <WIcon kind="pin" size={18} color="#fff" accent={accent} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Republic, MO</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3 }}>KSGF · 32 mi range · L2 source</div>
            </div>
            <svg width="10" height="14" viewBox="0 0 10 14"><path d="M2 1l6 6-6 6" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </div>
        </Glass>
        <Glass dark padding={0} radius={20} style={{ width: 44, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <WIcon kind="search" size={18} color="rgba(255,255,255,0.7)" />
        </Glass>
      </div>

      {/* Active warnings strip (tornado mode) */}
      {theme === 'tornado' && (
        <div style={{ position:'absolute', top: 110, left: 12, right: 12, zIndex: 9 }}>
          <div style={{ borderRadius: 14, overflow:'hidden', background: 'linear-gradient(90deg, rgba(185,28,28,0.95), rgba(220,38,38,0.85))', backdropFilter: 'blur(8px)', padding: '8px 12px', display:'flex', alignItems:'center', gap: 8, color:'#fff', boxShadow:'0 4px 16px rgba(220,38,38,0.4)' }}>
            <span style={{ width: 8, height: 8, borderRadius:'50%', background:'#fff', animation:'pulse 1.2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform:'uppercase' }}>Tornado Warning</span>
            <span style={{ flex:1, fontSize: 11, opacity: 0.9 }}>Greene Co · NE 35mph</span>
            <span style={{ fontSize: 10, fontVariantNumeric:'tabular-nums', fontWeight: 600 }}>23 min left</span>
          </div>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        </div>
      )}

      {/* Layer chips (right side) */}
      <div style={{ position:'absolute', right: 12, top: theme==='tornado'?160:110, zIndex: 9, display:'flex', flexDirection:'column', gap: 6 }}>
        {layers.map(l => (
          <button key={l.id} onClick={() => setLayer(l.id)} style={{
            padding: '6px 10px', borderRadius: 14, border:'none', cursor:'pointer',
            background: layer===l.id ? accent : 'rgba(20,20,28,0.65)',
            color: layer===l.id ? '#000' : 'rgba(255,255,255,0.85)',
            fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
            backdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(255,255,255,0.12)',
          }}>{l.label}</button>
        ))}
      </div>

      {/* Map controls (left) */}
      <div style={{ position:'absolute', left: 12, top: theme==='tornado'?160:110, zIndex: 9, display:'flex', flexDirection:'column', gap: 6 }}>
        {[
          {icon: 'plus', label:'+'},
          {icon: 'minus', label:'−'},
          {icon: 'compass', label:''},
        ].map((b,i)=>(
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(20,20,28,0.65)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: '#fff', fontSize: 18, fontWeight: 500, cursor:'pointer',
          }}>
            {b.icon === 'compass' ? <WIcon kind="compass" size={16} color="#fff"/> : b.label}
          </div>
        ))}
      </div>

      {/* Color scale legend */}
      <div style={{ position:'absolute', right: 12, bottom: 200, zIndex: 9 }}>
        <div style={{ width: 18, height: 200, borderRadius: 9, background: 'linear-gradient(180deg, #ff00ff 0%, #e00000 14%, #ff8000 28%, #ffff00 42%, #00b800 70%, #005000 100%)', position: 'relative', boxShadow:'0 0 0 0.5px rgba(255,255,255,0.15)' }}>
            {['75','60','45','30','15','5'].map((v,i)=>(
              <div key={i} style={{ position:'absolute', left: 22, top: i*38-5, fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily:'-apple-system', fontWeight: 500, fontVariantNumeric:'tabular-nums' }}>{v}</div>
            ))}
            <div style={{ position:'absolute', left: 22, bottom: -14, fontSize: 8, color:'rgba(255,255,255,0.5)' }}>dBZ</div>
        </div>
      </div>

      {/* Time scrubber */}
      <div style={{ position:'absolute', left: 12, right: 12, bottom: 110, zIndex: 9 }}>
        <Glass dark padding={0} radius={22}>
          <div style={{ padding: '12px 14px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
              <button onClick={()=>setPlaying(p=>!p)} style={{
                width: 32, height: 32, borderRadius: 16, border: 'none',
                background: accent, color: '#000', cursor: 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {playing
                  ? <svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3" height="12" fill="#000"/><rect x="6" y="0" width="3" height="12" fill="#000"/></svg>
                  : <svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" fill="#000"/></svg>}
              </button>
              <div style={{ flex: 1, marginLeft: 12, marginRight: 10, position: 'relative', height: 22 }}>
                {/* timeline tick marks */}
                <div style={{ position:'absolute', top: 9, left: 0, right: 0, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }}>
                  <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: '67%', borderRadius: 2, background: 'rgba(255,255,255,0.35)' }} />
                  <div style={{ position:'absolute', left: '67%', top: 0, bottom: 0, right: 0, borderRadius: 2, background: 'linear-gradient(90deg, rgba(251,191,36,0.5), rgba(251,191,36,0.2))' }} />
                  <div style={{ position:'absolute', left: `${time*100}%`, top: -5, width: 14, height: 14, borderRadius:'50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)', transform: 'translateX(-7px)' }} />
                </div>
                {/* now line */}
                <div style={{ position:'absolute', left: '67%', top: 0, bottom: 0, width: 1, background: 'rgba(251,191,36,0.6)' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', minWidth: 56, textAlign:'right' }}>{tLabel}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
              <span>−2 hr</span>
              <span style={{ color: 'rgba(251,191,36,0.8)', fontWeight: 600 }}>NOW</span>
              <span>+30 min</span>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

Object.assign(window, { RadarScreen });
