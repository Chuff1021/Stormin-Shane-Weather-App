// tornado-screen.jsx — Flagship tornado tracker

function TornadoMap({ active }) {
  return (
    <div style={{ position:'relative', height: 280, borderRadius: 18, overflow:'hidden', background:'#0a1220' }}>
      <svg viewBox="0 0 380 280" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <defs>
          <pattern id="tg" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(80,120,180,0.06)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="380" height="280" fill="#0a1220"/>
        <rect width="380" height="280" fill="url(#tg)"/>
        {/* roads */}
        <path d="M0 140 Q150 130 200 145 T380 150" stroke="rgba(255,200,80,0.18)" strokeWidth="1.2" fill="none"/>
        <path d="M180 0 Q200 100 190 200 Q180 280 200 280" stroke="rgba(255,200,80,0.15)" strokeWidth="1" fill="none"/>
        {/* SPC outlook shading */}
        <path d="M0 60 L380 50 L380 220 L0 230 Z" fill="rgba(220,38,38,0.08)"/>
        <path d="M0 90 L380 80 L380 200 L0 210 Z" fill="rgba(220,38,38,0.12)"/>
        {/* warning polygons */}
        {active && <>
          <path d="M70 100 L210 80 L240 200 L80 210 Z" fill="rgba(220,38,38,0.22)" stroke="#ef4444" strokeWidth="2.5"/>
          <path d="M40 40 L130 30 L150 110 L50 120 Z" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 3"/>
        </>}
        {/* Storm cell */}
        {active && <>
          <ellipse cx="155" cy="140" rx="32" ry="22" fill="rgba(255,0,255,0.5)"/>
          <ellipse cx="155" cy="140" rx="22" ry="14" fill="rgba(224,0,0,0.7)"/>
          <ellipse cx="155" cy="140" rx="12" ry="8" fill="rgba(255,128,0,0.8)"/>
          <path d="M130 155 Q120 170 130 178 Q145 180 150 170" fill="none" stroke="#ff00ff" strokeWidth="3"/>
          {/* TVS marker */}
          <circle cx="138" cy="160" r="6" fill="none" stroke="#fff" strokeWidth="1.5"/>
          <circle cx="138" cy="160" r="2.5" fill="#ef4444"/>
          {/* track */}
          <path d="M70 200 Q100 180 138 160 Q180 140 230 120" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7"/>
          <path d="M138 160 L 230 120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 4"/>
        </>}
        {/* chasers */}
        {active && [[120,170,'PH'],[200,130,'RT'],[80,180,'BD']].map(([x,y,n],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#22d3ee"/>
            <circle cx={x} cy={y} r="8" fill="none" stroke="#22d3ee" strokeOpacity="0.5"/>
          </g>
        ))}
        {/* cities */}
        <circle cx="190" cy="155" r="3" fill="#fff"/>
        <text x="196" y="158" fontSize="9" fill="#fff" fontWeight="600" fontFamily="-apple-system">Springfield</text>
        <circle cx="170" cy="170" r="2.5" fill="rgba(255,255,255,0.85)"/>
        <text x="148" y="183" fontSize="9" fill="#fff" fontWeight="700" fontFamily="-apple-system">Republic</text>
      </svg>
      {/* legend */}
      <div style={{ position:'absolute', bottom: 8, left: 8, display:'flex', gap: 5, fontSize: 9, fontWeight:600, color:'#fff', fontFamily:'-apple-system' }}>
        <span style={{ padding:'3px 6px', background:'rgba(220,38,38,0.85)', borderRadius: 5 }}>TOR</span>
        <span style={{ padding:'3px 6px', background:'rgba(251,191,36,0.85)', borderRadius: 5, color:'#000' }}>SVR</span>
        <span style={{ padding:'3px 6px', background:'rgba(34,211,238,0.85)', borderRadius: 5, color:'#000' }}>CHASER</span>
      </div>
    </div>
  );
}

function CountdownRing({ minutes = 23 }) {
  const total = 60;
  const pct = minutes / total;
  const C = 2 * Math.PI * 28;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4"/>
      <circle cx="34" cy="34" r="28" fill="none" stroke="#ef4444" strokeWidth="4"
        strokeDasharray={C} strokeDashoffset={C*(1-pct)} strokeLinecap="round"
        transform="rotate(-90 34 34)"/>
      <text x="34" y="34" textAnchor="middle" fontSize="20" fontWeight="600" fill="#fff" fontFamily="-apple-system">{minutes}</text>
      <text x="34" y="46" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="-apple-system" fontWeight="600" letterSpacing="1">MIN LEFT</text>
    </svg>
  );
}

function ChaserCard({ name, handle, viewers, distance, status, accent }) {
  return (
    <div style={{ flexShrink: 0, width: 168, background: 'rgba(20,20,28,0.55)', backdropFilter:'blur(20px)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow:'hidden' }}>
      <div style={{ height: 96, position:'relative', background:`linear-gradient(135deg, #1a0e0e, #3d1818)` }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 70%, rgba(239,68,68,0.4), transparent 60%)' }}/>
        {/* tornado silhouette */}
        <svg viewBox="0 0 100 100" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: 0.7 }}>
          <path d="M30 20 H72 M28 35 H74 M32 50 Q42 55 50 50 T 70 50 M40 65 H60 M45 80 H55" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>
        </svg>
        <div style={{ position:'absolute', top: 6, left: 6, padding:'2px 6px', borderRadius: 4, background:'#ef4444', fontSize: 9, fontWeight: 700, color:'#fff', letterSpacing: 0.4 }}>● LIVE</div>
        <div style={{ position:'absolute', bottom: 6, right: 6, padding:'2px 6px', borderRadius: 4, background:'rgba(0,0,0,0.6)', fontSize: 9, color:'#fff', fontWeight:600 }}>{viewers}</div>
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color:'#fff', lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: 11, color:'rgba(255,255,255,0.55)', marginTop: 1 }}>{handle} · {distance}</div>
        <div style={{ marginTop: 6, fontSize: 10, color: accent, fontWeight:600 }}>{status}</div>
      </div>
    </div>
  );
}

function TornadoScreen({ accent = '#ef4444' }) {
  const active = true;
  return (
    <div style={{ position:'absolute', inset:0, background:'#0a0e1a', overflow:'auto', paddingBottom: 110 }}>
      {/* dark bg with red wash */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.18) 0%, transparent 60%)', pointerEvents:'none'}}/>

      <div style={{ height: 54, position:'relative', zIndex: 2 }} />

      {/* Title row */}
      <div style={{ padding: '12px 18px 16px', position:'relative', zIndex: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 1.2, textTransform:'uppercase', marginBottom: 4, display:'flex', alignItems:'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background:'#ef4444', boxShadow: '0 0 8px #ef4444' }}/>
          Active threat · Greene Co
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: -0.6, fontFamily:'-apple-system, "SF Pro Display"' }}>Tornado Tracker</div>
      </div>

      {/* PRIMARY ALERT */}
      <div style={{ padding: '0 12px 12px', position:'relative', zIndex: 2 }}>
        <div style={{ borderRadius: 22, overflow:'hidden', background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)', boxShadow: '0 12px 40px rgba(220,38,38,0.5), inset 0 1px 0 rgba(255,255,255,0.15)', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 90% 10%, rgba(255,255,255,0.18), transparent 50%)'}}/>
          <div style={{ position:'relative', padding: '16px 16px 14px', display:'flex', gap: 14 }}>
            <CountdownRing minutes={23} />
            <div style={{ flex: 1, color:'#fff', minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform:'uppercase', opacity: 0.85 }}>Tornado Warning</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginTop: 2, lineHeight: 1.15, letterSpacing: -0.3 }}>Take Shelter Now</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4, lineHeight: 1.4 }}>Confirmed rotation 4mi SW of Republic — moving NE at 35mph. Until 8:15 PM CDT.</div>
            </div>
          </div>
          <div style={{ position:'relative', display:'flex', borderTop:'0.5px solid rgba(255,255,255,0.18)' }}>
            <button style={{ flex:1, padding: '12px', background:'transparent', border:'none', color:'#fff', fontSize: 13, fontWeight: 600, cursor:'pointer', borderRight:'0.5px solid rgba(255,255,255,0.18)' }}>Shelter Plan</button>
            <button style={{ flex:1, padding: '12px', background:'transparent', border:'none', color:'#fff', fontSize: 13, fontWeight: 600, cursor:'pointer' }}>Share Location</button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ padding: '0 12px 12px', position:'relative', zIndex: 2 }}>
        <TornadoMap active={active} />
      </div>

      {/* SPC outlook */}
      <div style={{ padding: '0 12px 12px', position:'relative', zIndex: 2 }}>
        <Glass dark padding={14} radius={20}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color:'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform:'uppercase' }}>SPC Day 1 Outlook</div>
            <div style={{ fontSize: 10, color:'rgba(255,255,255,0.45)' }}>Updated 2:30 PM</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 4, marginBottom: 10 }}>
            {[
              {l:'MRGL', c:'#22c55e', a:false},
              {l:'SLGT', c:'#eab308', a:false},
              {l:'ENH', c:'#f97316', a:false},
              {l:'MDT', c:'#ef4444', a:true},
              {l:'HIGH', c:'#a855f7', a:false},
            ].map((r,i)=>(
              <div key={i} style={{ textAlign:'center', padding: '7px 4px', borderRadius: 8, background: r.a?r.c:'rgba(255,255,255,0.04)', border: r.a?'none':'0.5px solid rgba(255,255,255,0.08)', color: r.a?'#000':'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 11 }}>
                {r.l}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color:'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
            Greene Co is in a <b style={{color:'#ef4444'}}>Moderate Risk</b> — long-track tornadoes possible. Tornado prob: <b style={{color:'#fff'}}>30%</b> hatched.
          </div>
        </Glass>
      </div>

      {/* Chasers */}
      <div style={{ position:'relative', zIndex: 2 }}>
        <div style={{ padding: '0 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color:'#fff', letterSpacing: -0.3 }}>Chasers Near You</div>
          <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600 }}>See all 7</div>
        </div>
        <div style={{ display:'flex', gap: 10, padding: '0 12px 12px', overflow:'hidden' }}>
          <ChaserCard name="Pecos Hank" handle="@pecoshank" viewers="8.4k" distance="2.1mi NW" status="● Filming wedge" accent="#ef4444" />
          <ChaserCard name="Reed Timmer" handle="@reedtimmer" viewers="22k" distance="5.8mi N" status="● Intercepting" accent="#fbbf24" />
        </div>
      </div>

      {/* Storm cell stats */}
      <div style={{ padding: '0 12px 12px', position:'relative', zIndex: 2 }}>
        <Glass dark padding={14} radius={20}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color:'#fff' }}>Storm Cell #A4 · SCIT</div>
            <div style={{ padding: '2px 7px', borderRadius: 4, background:'#ef4444', color:'#fff', fontSize: 9, fontWeight: 700 }}>TVS</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 12 }}>
            {[
              {l:'Tornado', v:'92%', c:'#ef4444'},
              {l:'Hail', v:'2.5"', c:'#fbbf24'},
              {l:'Wind', v:'74mph', c:'#7dd3fc'},
            ].map((s,i)=>(
              <div key={i}>
                <div style={{ fontSize: 10, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing: 0.4, fontWeight: 600, marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: s.c, letterSpacing: -0.5, fontFamily:'-apple-system' }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)', margin: '12px 0' }}/>
          <div style={{ fontSize: 12, color:'rgba(255,255,255,0.7)', display:'flex', justifyContent:'space-between' }}>
            <span>Top: 48,000ft</span>
            <span>VIL: 62</span>
            <span>Δ: +08kt/min</span>
          </div>
        </Glass>
      </div>

      {/* Local storm reports */}
      <div style={{ padding: '0 12px 16px', position:'relative', zIndex: 2 }}>
        <Glass dark padding={0} radius={20}>
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 600, color:'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform:'uppercase' }}>Local Storm Reports</div>
          <div style={{ height: 0.5, background:'rgba(255,255,255,0.08)' }}/>
          {[
            {t:'7:42 PM', e:'Tornado', d:'4mi SW Republic — large funnel reported by spotter.', c:'#ef4444'},
            {t:'7:31 PM', e:'Hail', d:'Billings — golf ball size (1.75")', c:'#fbbf24'},
            {t:'7:18 PM', e:'Wind', d:'Mt Vernon — 67mph gust, tree down', c:'#7dd3fc'},
          ].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap: 10, padding: '10px 16px', borderBottom: i<2?'0.5px solid rgba(255,255,255,0.06)':'none', alignItems:'center' }}>
              <div style={{ width: 6, height: 36, borderRadius: 3, background: r.c, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{r.e}</span>
                  <span style={{ fontSize: 11, color:'rgba(255,255,255,0.5)', fontVariantNumeric:'tabular-nums' }}>{r.t}</span>
                </div>
                <div style={{ fontSize: 12, color:'rgba(255,255,255,0.7)', marginTop: 1 }}>{r.d}</div>
              </div>
            </div>
          ))}
        </Glass>
      </div>
    </div>
  );
}

Object.assign(window, { TornadoScreen });
