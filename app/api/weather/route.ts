import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const ua = 'StorminShaneWeather/0.2 github.com/Chuff1021/Stormin-Shane-Weather-App';
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  const label = req.nextUrl.searchParams.get('label') || 'Current Location';
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,dew_point_2m,surface_pressure,visibility,uv_index&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=10`;
  const [forecast, alerts] = await Promise.allSettled([
    fetch(forecastUrl, { next: { revalidate: 300 } }),
    fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, { headers: { 'User-Agent': ua, Accept: 'application/geo+json' }, next: { revalidate: 120 } })
  ]);
  if (forecast.status !== 'fulfilled' || !forecast.value.ok) return NextResponse.json({ error: 'forecast unavailable' }, { status: 502 });
  let alertRows: any[] = [];
  if (alerts.status === 'fulfilled' && alerts.value.ok) {
    const nws = await alerts.value.json();
    alertRows = (nws.features || []).map((f: any) => ({ title: f.properties.event, severity: f.properties.severity, certainty: f.properties.certainty, urgency: f.properties.urgency, headline: f.properties.headline, description: f.properties.description, expires: f.properties.expires }));
  }
  return NextResponse.json({ label, lat, lon, forecast: await forecast.value.json(), alerts: alertRows, updatedAt: new Date().toISOString() });
}
