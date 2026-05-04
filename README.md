# Stormin' Shane Weather App

Premium native iOS weather + storm tracking app for the Stormin' Shane brand.

## Status

This repo contains the Phase 1 native SwiftUI scaffold plus architecture for the full product roadmap:

- Home/current conditions
- Hourly + 10-day forecast UI
- NWS alerts banner
- RainViewer radar tab scaffold
- Tornado tracker tab scaffold
- Shane creator dashboard scaffold
- Saved locations model
- Weather API client foundation
- Supabase schema starter

## Requirements

- macOS with Xcode 15+
- iOS 17+
- Swift 5.9+
- XcodeGen recommended for project generation

## Generate the Xcode project

```bash
brew install xcodegen
xcodegen generate
open StorminShaneWeather.xcodeproj
```

## API Setup

Most Phase 1 data sources do not require keys:

- NWS: `https://api.weather.gov` — requires a descriptive `User-Agent`
- RainViewer: `https://api.rainviewer.com` — no key
- Open-Meteo: `https://api.open-meteo.com` — no key

Optional keys/config for later phases:

- AirNow API key
- Supabase URL + anon key
- Mux or Cloudflare Stream credentials
- PostHog project key

Copy `Config/Secrets.example.xcconfig` to `Config/Secrets.xcconfig` and fill values when needed.

## Phases

### Phase 1 MVP

- Current conditions
- Hourly forecast
- 10-day forecast
- Saved locations
- Basic RainViewer radar
- NWS alerts banner

### Phase 2

- Radar layers
- Tornado tracker
- Push notifications
- Severe weather watch/warning polygons

### Phase 3

- Creator Mode
- Auth
- Upload/publish Shane videos
- Public Shane updates feed

### Phase 4

- Chaser integrations
- Critical Alerts entitlement request
- App Store polish/submission

## Important Compliance Notes

- Critical Alerts require Apple approval and are usually reserved for public-safety-adjacent use cases.
- Chaser livestreams must use public APIs and proper attribution. Do not scrape.
- Location data should stay on-device except forecast/radar API calls required to serve the user.
