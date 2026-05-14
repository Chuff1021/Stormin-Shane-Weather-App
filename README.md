# Stormin' Shane Weather

A premier weather + tornado tracker PWA built for the home screen. Real‑time NWS alerts, an interactive tornado tracker pulling from open‑source storm‑chaser feeds, and a private creator dashboard for Shane to post video updates with broadcast‑grade filters.

## Stack

- **Next.js 15** (App Router, RSC, server actions)
- **Tailwind CSS** for the design system
- **Open‑Meteo** for forecast data (no API key)
- **api.weather.gov** for NWS active alerts (tornado warnings/watches, GeoJSON)
- **RainViewer** + **Iowa State Mesonet** tiles for live radar
- **Leaflet** for the tornado tracker map
- **Spotter Network** public KML for storm‑chaser positions
- **Vercel Blob** for video storage
- **WebGL shader chain** for in‑browser video filters (news‑anchor, golden hour, cinematic, storm)
- **PWA**: manifest + service worker for offline + install‑to‑home‑screen

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Premier weather home — current conditions, hourly, daily, live alert banner, Shane's latest video |
| `/tracker` | Full‑screen tornado tracker with NWS alerts + chaser positions on a Leaflet map |
| `/dashboard` | Private creator studio — record videos with WebGL filters and post to the home screen |
| `/dashboard/login` | Password gate for the dashboard |

## Env vars

```
SHANE_PASSWORD=...                # gates the dashboard
BLOB_READ_WRITE_TOKEN=...         # auto‑set by Vercel Blob integration
```

## Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Install to iPhone home screen

Open the deployed URL in Safari, tap Share → "Add to Home Screen". The PWA manifest is configured for standalone display with a custom icon and splash screen.
