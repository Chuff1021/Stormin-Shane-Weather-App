// dashboard-screen.jsx — Shane's creator dashboard + public feed + locations + alerts

function PublicFeed({ accent }) {
  const videos = [
    { t: 'Rotation confirmed near Brookline', tag: 'TORNADO', tagColor:'#ef4444', time:'4 min', views:'1.2k', live:true, dur:'2:42', bg:'linear-gradient(135deg, #7f1d1d, #1a0e0e)' },
    { t: 'Supercell organizing west of Springfield', tag:'SEVERE', tagColor:'#fbbf24', time:'47 min', views:'8.4k', live:false, dur:'4:18', bg:'linear-gradient(135deg, #1e3a5f, #0f172a)' },
    { t: 'Morning forecast: tornado watch issued', tag:'WATCH', tagColor:'#a78bfa', time:'5 hr', views:'24k', live:false, dur:'3:05', bg:'linear-gradient(135deg, #312e81, #1e1b4b)' },
    { t: 'Hail core moving through Greene Co', tag:'HAIL', tagColor:'#7dd3fc', time:'yesterday', views:'12k', live:false, dur:'1:54', bg:'linear-gradient(135deg, #0c4a6e, #082f49)' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0a0e1a', overflow:'auto', paddingBottom:110 }}>
      <div style={{ height: 54 }} />

      {/* Header */}
      <div style={{ padding: '8px 18px 14px', display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background:'linear-gradient(135deg, #fbbf24, #ef4444)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px rgba(255,255,255,0.15)', flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 32 32"><path d="M5 6 H27 M6 10 H26 M8 14 H24 M10 18 H22 M13 22 H19 M15 26 H17" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </div>
        <div style={{ flex: 1, minWidth:0 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color:'#fff', letterSpacing: -0.3 }}>Stormin' Shane</div>
          <div style={{ fontSize: 12, color:'rgba(255,255,255,0.55)' }}>· LIVE now · 1.2k watching</div>
        </div>
        <button style={{ padding:'7px 14px', borderRadius: 16, border:'none', background: accent, color:'#000', fontSize: 12, fontWeight: 700, cursor:'pointer' }}>Following</button>
      </div>

      <div style={{ padding: '0 12px' }}>
        {videos.map((v, i) => (
          <div key={i} style={{ marginBottom: 12, borderRadius: 18, overflow:'hidden', background:'rgba(20,20,28,0.55)', backdropFilter:'blur(20px)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ height: 200, position:'relative', background: v.bg }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 70%, rgba(239,68,68,0.3), transparent 65%)' }}/>
              {/* tornado/storm silhouette */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: 0.3 }}>
                <path d="M20 20 H80 M22 30 H78 M28 40 Q40 45 50 40 T75 40 M35 55 H65 M45 70 H55 M48 85 H52" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              {/* tag */}
              <div style={{ position:'absolute', top: 10, left: 10, padding: '3px 8px', borderRadius: 5, background: v.tagColor, color:'#000', fontSize: 9, fontWeight: 800, letterSpacing: 0.6 }}>
                {v.tag}
              </div>
              {v.live && <div style={{ position:'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 5, background: '#ef4444', color:'#fff', fontSize: 9, fontWeight: 800, letterSpacing: 0.6, display:'flex', alignItems:'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius:'50%', background:'#fff' }}/>
                LIVE
              </div>}
              {!v.live && <div style={{ position:'absolute', bottom: 10, right: 10, padding:'2px 7px', borderRadius:4, background:'rgba(0,0,0,0.7)', fontSize: 10, color:'#fff', fontWeight: 600 }}>{v.dur}</div>}
              {/* play button */}
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width: 48, height: 48, borderRadius:'50%', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', border:'0.5px solid rgba(255,255,255,0.4)' }}>
                  <svg width="14" height="16" viewBox="0 0 14 16"><path d="M0 0 L14 8 L0 16 Z" fill="#fff"/></svg>
                </div>
              </div>
              {/* mini map */}
              <div style={{ position:'absolute', bottom: 10, left: 10, padding: '3px 7px', borderRadius: 8, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap: 5 }}>
                <WIcon kind="pin" size={11} color="#22d3ee" accent="#22d3ee"/>
                <span style={{ fontSize: 10, fontWeight: 600, color:'#fff' }}>Republic, MO</span>
              </div>
            </div>
            <div style={{ padding: '10px 14px 12px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color:'#fff', lineHeight: 1.3 }}>{v.t}</div>
              <div style={{ fontSize: 11, color:'rgba(255,255,255,0.5)', marginTop: 3, display:'flex', gap: 6 }}>
                <span>{v.time} ago</span><span>·</span><span>{v.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatorDashboard({ accent }) {
  return (
    <div style={{ position:'absolute', inset: 0, background:'#0a0e1a', overflow:'auto', paddingBottom: 110 }}>
      <div style={{ height: 54 }} />
      <div style={{ padding: '12px 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: 1, textTransform:'uppercase', marginBottom: 2 }}>Creator Mode</div>
          <div style={{ fontSize: 28, fontWeight: 700, color:'#fff', letterSpacing: -0.4 }}>Studio</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background:'rgba(255,255,255,0.08)', border:'0.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="4" r="3" fill="none" stroke="#fff" strokeWidth="1.5"/><path d="M2 13 Q2 8 7 8 Q12 8 12 13" fill="none" stroke="#fff" strokeWidth="1.5"/></svg>
        </div>
      </div>

      {/* Quick record card */}
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{ borderRadius: 22, padding: 18, background:'linear-gradient(135deg, #b91c1c, #7f1d1d)', boxShadow:'0 8px 32px rgba(220,38,38,0.4)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.18), transparent 50%)' }}/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background:'rgba(0,0,0,0.4)', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background:'#ef4444', boxShadow:'0 0 0 4px rgba(239,68,68,0.3)' }}/>
            </div>
            <div style={{ flex: 1, color:'#fff' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Go Live Now</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2, lineHeight: 1.4 }}>Auto-tagged: Tornado Warning · Republic, MO · radar snapshot included</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics tiles */}
      <div style={{ padding: '0 12px 12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
        <Glass dark padding={14} radius={18}>
          <div style={{ fontSize: 10, fontWeight: 600, color:'rgba(255,255,255,0.5)', letterSpacing:0.5, textTransform:'uppercase' }}>Views · 7d</div>
          <div style={{ fontSize: 28, fontWeight: 500, color:'#fff', letterSpacing: -0.6, marginTop: 4 }}>184k</div>
          <div style={{ fontSize: 11, color:'#22c55e', marginTop: 2, fontWeight: 600 }}>↑ 38% vs prev</div>
          <svg viewBox="0 0 120 30" style={{ width:'100%', height: 28, marginTop: 6 }}>
            <path d="M0 22 L15 18 L30 20 L45 12 L60 14 L75 8 L90 10 L105 4 L120 6 L120 30 L0 30 Z" fill="rgba(34,211,238,0.2)"/>
            <path d="M0 22 L15 18 L30 20 L45 12 L60 14 L75 8 L90 10 L105 4 L120 6" stroke="#22d3ee" strokeWidth="1.5" fill="none"/>
          </svg>
        </Glass>
        <Glass dark padding={14} radius={18}>
          <div style={{ fontSize: 10, fontWeight: 600, color:'rgba(255,255,255,0.5)', letterSpacing:0.5, textTransform:'uppercase' }}>Watch time</div>
          <div style={{ fontSize: 28, fontWeight: 500, color:'#fff', letterSpacing: -0.6, marginTop: 4 }}>9.2k<span style={{ fontSize: 14, opacity: 0.6, marginLeft: 4 }}>hrs</span></div>
          <div style={{ fontSize: 11, color:'#22c55e', marginTop: 2, fontWeight: 600 }}>↑ 2.1× spike</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Avg: 3:18 / view</div>
        </Glass>
        <Glass dark padding={14} radius={18} style={{ gridColumn:'span 2' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color:'rgba(255,255,255,0.5)', letterSpacing:0.5, textTransform:'uppercase' }}>Viewers by Region</div>
            <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>4 states</div>
          </div>
          {/* US heatmap-ish */}
          <div style={{ position:'relative', height: 80 }}>
            <svg viewBox="0 0 200 80" style={{ width:'100%', height:'100%' }}>
              <path d="M10 35 L30 30 L55 28 L85 26 L110 28 L140 30 L170 32 L185 38 L185 55 L160 60 L130 62 L100 60 L70 58 L40 55 L15 50 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
              {/* MO hotspot */}
              <circle cx="100" cy="48" r="14" fill="rgba(239,68,68,0.4)"/>
              <circle cx="100" cy="48" r="6" fill="#ef4444"/>
              <circle cx="80" cy="50" r="7" fill="rgba(251,191,36,0.5)"/>
              <circle cx="125" cy="42" r="5" fill="rgba(34,211,238,0.5)"/>
              <circle cx="60" cy="55" r="4" fill="rgba(34,211,238,0.4)"/>
            </svg>
          </div>
          <div style={{ display:'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            <span><b style={{color:'#ef4444'}}>● </b>MO 64%</span>
            <span><b style={{color:'#fbbf24'}}>● </b>KS 18%</span>
            <span><b style={{color:'#22d3ee'}}>● </b>OK 11%</span>
            <span style={{ opacity:0.5 }}>+1</span>
          </div>
        </Glass>
      </div>

      {/* Recent posts */}
      <div style={{ padding: '4px 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color:'#fff' }}>Recent posts</div>
        <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>Manage all</div>
      </div>
      <div style={{ padding: '0 12px' }}>
        {[
          { t:'Rotation confirmed near Brookline', s:'Published · Live', v:'1.2k watching', state:'live', tag:'#ef4444' },
          { t:'Supercell organizing west of Springfield', s:'Published 47m ago', v:'8.4k views · 92% retention', state:'pub', tag:'#fbbf24' },
          { t:'Morning forecast: tornado watch issued', s:'Published 5h ago', v:'24k views · 4.2k likes', state:'pub', tag:'#a78bfa' },
          { t:'Pre-storm check-in (untitled draft)', s:'Draft · 1:24', v:'Not published', state:'draft', tag:'rgba(255,255,255,0.3)' },
        ].map((p, i) => (
          <div key={i} style={{ display:'flex', gap: 12, padding: '10px 8px', alignItems:'center', borderBottom: i<3?'0.5px solid rgba(255,255,255,0.06)':'none' }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background:`linear-gradient(135deg, ${p.tag}40, #0a0e1a)`, border:`1px solid ${p.tag}50`, position:'relative', flexShrink: 0 }}>
              {p.state==='live' && <div style={{ position:'absolute', top:4, left:4, padding:'1px 4px', borderRadius:3, background:'#ef4444', fontSize:7, fontWeight:800, color:'#fff' }}>LIVE</div>}
              {p.state==='draft' && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>DRAFT</div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color:'#fff', lineHeight: 1.25, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.t}</div>
              <div style={{ fontSize: 11, color:'rgba(255,255,255,0.55)', marginTop: 2 }}>{p.s}</div>
              <div style={{ fontSize: 11, color: accent, marginTop: 1, fontWeight: 500 }}>{p.v}</div>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12"><path d="M1 1l4 5-4 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationsScreen({ accent }) {
  const locs = [
    { name:'Republic', sub:'Home · 4mi from active warning', t:74, hi:81, lo:64, c:'storm', alert:'Tornado Warning' },
    { name:'Springfield', sub:'Greene County, MO', t:73, hi:80, lo:63, c:'storm', alert:'Severe Tstorm' },
    { name:'Joplin', sub:"Mom's house · Jasper Co", t:71, hi:78, lo:62, c:'rain' },
    { name:'Branson', sub:'Taney County', t:76, hi:84, lo:65, c:'partlysunny' },
    { name:'Kansas City', sub:'KC Metro', t:69, hi:74, lo:58, c:'cloud' },
    { name:'Tulsa, OK', sub:'Travel watchlist', t:78, hi:86, lo:67, c:'sun' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0a0e1a', overflow:'auto', paddingBottom: 110 }}>
      <div style={{ height: 54 }} />
      <div style={{ padding: '12px 18px 4px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color:'#fff', letterSpacing: -0.4 }}>Locations</div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: accent, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${accent}66` }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><line x1="7" y1="2" x2="7" y2="12" stroke="#000" strokeWidth="2.4" strokeLinecap="round"/><line x1="2" y1="7" x2="12" y2="7" stroke="#000" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* search */}
      <div style={{ padding: '10px 12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 14px', borderRadius: 14, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <WIcon kind="search" size={16} color="rgba(255,255,255,0.5)"/>
          <span style={{ fontSize: 14, color:'rgba(255,255,255,0.5)' }}>Search city or zip</span>
        </div>
      </div>

      <div style={{ padding: '0 12px' }}>
        {locs.map((l, i) => {
          const t = THEMES[l.c] || THEMES.clear;
          const [a,b,c] = t.sky;
          return (
            <div key={i} style={{ marginBottom: 10, borderRadius: 18, overflow:'hidden', background:`linear-gradient(135deg, ${a}, ${c})`, position:'relative', boxShadow:'0 4px 16px rgba(0,0,0,0.25)' }}>
              {l.c === 'storm' && <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 50%)' }}/>}
              <div style={{ position:'relative', padding: '14px 16px', display:'flex', alignItems:'center' }}>
                <div style={{ flex: 1, color:'#fff', minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                    <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.3 }}>{l.name}</div>
                    {i===0 && <svg width="11" height="11" viewBox="0 0 11 11"><path d="M5.5 1 L1 6 L4 6 L4 10 L7 10 L7 6 L10 6 Z" fill="#fff" opacity="0.85"/></svg>}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.sub}</div>
                  {l.alert && <div style={{ marginTop: 6, display:'inline-flex', alignItems:'center', gap: 5, padding:'2px 7px', borderRadius: 5, background: l.alert==='Tornado Warning'?'#ef4444':'#fbbf24', color: l.alert==='Tornado Warning'?'#fff':'#000', fontSize: 9, fontWeight: 800, letterSpacing: 0.4 }}>
                    <span style={{ width: 4, height: 4, borderRadius:'50%', background:'currentColor' }}/>
                    {l.alert.toUpperCase()}
                  </div>}
                </div>
                <div style={{ textAlign:'right', color:'#fff' }}>
                  <div style={{ fontSize: 38, fontWeight: 300, letterSpacing: -2, lineHeight: 1, fontFamily:'-apple-system, "SF Pro Display"' }}>{l.t}°</div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>H:{l.hi}° L:{l.lo}°</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertsScreen({ accent }) {
  const alerts = [
    { lvl:'Tornado Warning', loc:'Greene Co · Republic', t:'7:52 PM', exp:'8:15 PM', body:'At 7:50 PM, a confirmed tornado was located 4 miles southwest of Republic, moving northeast at 35mph.', c:'#ef4444', live:true },
    { lvl:'Severe Tstorm Warning', loc:'Lawrence Co', t:'7:38 PM', exp:'8:30 PM', body:'70mph winds and quarter-size hail. Take cover immediately.', c:'#fbbf24' },
    { lvl:'Tornado Watch #487', loc:'Greene · Christian · Webster', t:'5:15 PM', exp:'10:00 PM', body:'Conditions favorable for tornadoes through the evening.', c:'#a78bfa' },
    { lvl:'Flash Flood Watch', loc:'Southwest Missouri', t:'4:20 PM', exp:'Tomorrow 6 AM', body:'2-4 inches of rain possible with locally higher amounts.', c:'#22d3ee' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, background:'#0a0e1a', overflow:'auto', paddingBottom: 110 }}>
      <div style={{ height: 54 }}/>
      <div style={{ padding:'12px 18px 16px' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color:'#fff', letterSpacing: -0.4 }}>Alerts</div>
        <div style={{ fontSize: 12, color:'rgba(255,255,255,0.55)', marginTop: 2 }}>4 active · NWS Springfield</div>
      </div>
      <div style={{ padding: '0 12px' }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ marginBottom: 10, borderRadius: 18, overflow:'hidden', background: a.live ? `linear-gradient(135deg, ${a.c}30, rgba(20,20,28,0.6))` : 'rgba(20,20,28,0.55)', backdropFilter:'blur(20px)', border:`0.5px solid ${a.live?a.c+'80':'rgba(255,255,255,0.08)'}` }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, padding: '10px 14px', borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: a.c, boxShadow: a.live?`0 0 8px ${a.c}`:'none' }}/>
              <div style={{ flex:1, fontSize: 13, fontWeight: 700, color:'#fff', letterSpacing: 0.2 }}>{a.lvl}</div>
              <div style={{ fontSize: 11, color:'rgba(255,255,255,0.55)', fontVariantNumeric:'tabular-nums' }}>{a.t}</div>
            </div>
            <div style={{ padding: '10px 14px 12px' }}>
              <div style={{ fontSize: 12, color:'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{a.body}</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 11 }}>
                <span style={{ color:'rgba(255,255,255,0.55)' }}>{a.loc}</span>
                <span style={{ color: a.c, fontWeight: 600 }}>Until {a.exp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification settings */}
      <div style={{ padding: '12px 18px 8px', fontSize: 11, fontWeight: 600, color:'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform:'uppercase' }}>Notify Me For</div>
      <div style={{ padding: '0 12px 8px' }}>
        <Glass dark padding={0} radius={16}>
          {[
            ['Tornado Warning', true, 'Critical'],
            ['Severe Thunderstorm', true],
            ['Flash Flood', true],
            ["Shane's Updates", true],
            ['Winter Storm', false],
          ].map(([l, on, badge], i, a) => (
            <div key={i} style={{ display:'flex', alignItems:'center', padding: '11px 14px', borderBottom: i<a.length-1?'0.5px solid rgba(255,255,255,0.05)':'none' }}>
              <div style={{ flex: 1, fontSize: 14, color:'#fff' }}>{l}</div>
              {badge && <span style={{ marginRight: 10, fontSize: 9, fontWeight: 700, color:'#ef4444', padding: '2px 6px', borderRadius: 4, border:'1px solid rgba(239,68,68,0.5)' }}>{badge}</span>}
              <div style={{ width: 36, height: 22, borderRadius: 11, background: on?'#22c55e':'rgba(255,255,255,0.15)', position:'relative' }}>
                <div style={{ position:'absolute', top: 2, left: on?16:2, width: 18, height: 18, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }}/>
              </div>
            </div>
          ))}
        </Glass>
      </div>
    </div>
  );
}

Object.assign(window, { PublicFeed, CreatorDashboard, LocationsScreen, AlertsScreen });
