import { NextRequest, NextResponse } from 'next/server';
export const dynamic='force-dynamic';

type Result = { label:string; latitude:number; longitude:number; name?:string; admin1?:string; country?:string; source:string; importance?:number };

const STATE: Record<string,string> = {
  al:'Alabama', ak:'Alaska', az:'Arizona', ar:'Arkansas', ca:'California', co:'Colorado', ct:'Connecticut', de:'Delaware', fl:'Florida', ga:'Georgia', hi:'Hawaii', ia:'Iowa', id:'Idaho', il:'Illinois', in:'Indiana', ks:'Kansas', ky:'Kentucky', la:'Louisiana', ma:'Massachusetts', md:'Maryland', me:'Maine', mi:'Michigan', mn:'Minnesota', mo:'Missouri', ms:'Mississippi', mt:'Montana', nc:'North Carolina', nd:'North Dakota', ne:'Nebraska', nh:'New Hampshire', nj:'New Jersey', nm:'New Mexico', nv:'Nevada', ny:'New York', oh:'Ohio', ok:'Oklahoma', or:'Oregon', pa:'Pennsylvania', ri:'Rhode Island', sc:'South Carolina', sd:'South Dakota', tn:'Tennessee', tx:'Texas', ut:'Utah', va:'Virginia', vt:'Vermont', wa:'Washington', wi:'Wisconsin', wv:'West Virginia', wy:'Wyoming'
};

function normalizeQuery(q:string){return q.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function wantedState(q:string){const parts=normalizeQuery(q).split(' '); for(const p of parts){if(STATE[p])return STATE[p].toLowerCase()} return null}
function uniq(rows:Result[]){const seen=new Set<string>(); return rows.filter(r=>{const k=`${r.label}|${r.latitude.toFixed(3)}|${r.longitude.toFixed(3)}`; if(seen.has(k))return false; seen.add(k); return true})}
function rank(q:string, r:Result){const nq=normalizeQuery(q), ns=wantedState(q); let score=r.importance||0; const label=normalizeQuery(r.label); if(label.includes(nq))score+=5; if(ns&&label.includes(ns))score+=20; if(/, us$|, usa$|united states/.test(label))score+=2; return score}

export async function GET(req:NextRequest){
  const q=req.nextUrl.searchParams.get('q')?.trim();
  if(!q)return NextResponse.json({results:[]});
  const headers={'User-Agent':'StorminShaneWeather/1.0 github.com/Chuff1021/Stormin-Shane-Weather-App'};
  const rows:Result[]=[];
  try{
    const nom=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&addressdetails=1&q=${encodeURIComponent(q)}`,{headers,next:{revalidate:86400}});
    if(nom.ok){
      const data=await nom.json();
      for(const x of data){
        const a=x.address||{}; const city=a.city||a.town||a.village||a.hamlet||a.municipality||x.name||q;
        const state=a.state||a.region; const country=a.country_code?.toUpperCase()||a.country;
        rows.push({label:[city,state,country].filter(Boolean).join(', '),latitude:Number(x.lat),longitude:Number(x.lon),name:city,admin1:state,country:a.country,source:'osm',importance:Number(x.importance||0)});
      }
    }
  }catch{}
  try{
    const om=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`,{next:{revalidate:86400}});
    if(om.ok){
      const data=await om.json();
      for(const x of data.results||[])rows.push({label:[x.name,x.admin1,x.country_code].filter(Boolean).join(', '),latitude:x.latitude,longitude:x.longitude,name:x.name,admin1:x.admin1,country:x.country,source:'open-meteo',importance:0});
    }
  }catch{}
  const results=uniq(rows).sort((a,b)=>rank(q,b)-rank(q,a)).slice(0,8);
  return NextResponse.json({results});
}
