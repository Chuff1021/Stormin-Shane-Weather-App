import { NextRequest, NextResponse } from 'next/server';
export const dynamic='force-dynamic';
const ua='StorminShaneWeather/1.0 github.com/Chuff1021/Stormin-Shane-Weather-App';
export async function GET(req:NextRequest){
 const lat=Number(req.nextUrl.searchParams.get('lat')), lon=Number(req.nextUrl.searchParams.get('lon'));
 const label=req.nextUrl.searchParams.get('label')||'Current Location';
 const unit=req.nextUrl.searchParams.get('unit')==='celsius'?'celsius':'fahrenheit';
 if(!Number.isFinite(lat)||!Number.isFinite(lon)) return NextResponse.json({error:'lat/lon required'},{status:400});
 const tempUnit=unit==='celsius'?'celsius':'fahrenheit';
 const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,relative_humidity_2m,dew_point_2m,surface_pressure,visibility,uv_index,precipitation&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max&temperature_unit=${tempUnit}&wind_speed_unit=mph&timezone=auto&forecast_days=10`;
 const airUrl=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,ozone&timezone=auto`;
 const [forecast,alerts,air]=await Promise.allSettled([
  fetch(url,{next:{revalidate:300}}),
  fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`,{headers:{'User-Agent':ua,Accept:'application/geo+json'},next:{revalidate:120}}),
  fetch(airUrl,{next:{revalidate:900}})
 ]);
 if(forecast.status!=='fulfilled'||!forecast.value.ok) return NextResponse.json({error:'forecast unavailable'},{status:502});
 let alertRows:any[]=[]; if(alerts.status==='fulfilled'&&alerts.value.ok){const j=await alerts.value.json(); alertRows=(j.features||[]).map((f:any)=>({title:f.properties.event,severity:f.properties.severity,urgency:f.properties.urgency,certainty:f.properties.certainty,headline:f.properties.headline,description:f.properties.description,expires:f.properties.expires,area:f.properties.areaDesc}));}
 let airQuality=null; if(air.status==='fulfilled'&&air.value.ok) airQuality=await air.value.json();
 return NextResponse.json({label,lat,lon,unit,forecast:await forecast.value.json(),alerts:alertRows,airQuality,updatedAt:new Date().toISOString()});
}
