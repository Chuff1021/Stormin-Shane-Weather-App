import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ results: [] });
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`, { next: { revalidate: 86400 } });
  if (!res.ok) return NextResponse.json({ error: 'geocoder unavailable' }, { status: 502 });
  const data = await res.json();
  return NextResponse.json({ results: (data.results || []).map((r: any) => ({ name: r.name, admin1: r.admin1, country: r.country, latitude: r.latitude, longitude: r.longitude, label: [r.name, r.admin1, r.country_code].filter(Boolean).join(', ') })) });
}
