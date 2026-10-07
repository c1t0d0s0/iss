# ISS Live Orbit Tracker & Simulator

[日本語版はこちら](README.ja.md)

A single-page web app that tracks the International Space Station (ISS) in real time on a dark, glassmorphic map — with day/night shading, a live-updating orbit path, and a time-travel simulator.

## Features

- **Multi-satellite real-time tracking & orbit display** — Tracks the International Space Station (ISS) by default, and allows users to display and track additional satellites:
  - **International Space Station (ISS)** (NORAD ID: 25544)
  - **Tiangong Space Station (CSS)** (NORAD ID: 48274)
  - **BlueWalker 3** (NORAD ID: 53807) — ultra-bright communications satellite with a 64 m² antenna array
  - **Envisat** (NORAD ID: 27386) — massive polar-orbiting Earth observation satellite
- **Interactive Satellite Selector**:
  - Independent visibility checkboxes for each satellite (enables simultaneous multi-satellite display and orbit comparison).
  - Click any row or map marker to make that satellite the active tracking target (updates HUD telemetry and map auto-centering).
- **Orbit trails** — Draws the past 1 hour (flown, dashed) and next 1 hour (predicted, solid) ground tracks in each satellite's theme color, with time badges at +15m / +30m / +45m / +60m.
- **Dynamic visibility footprint** — Calculates and renders ground horizon visibility radius based on orbital altitude.
- **Day/night terminator overlay** — shows which parts of the Earth are currently in daylight or darkness.
- **Time-jump simulation** — pick any date/time to see where all visible satellites were or will be, then jump back to live tracking.
- **Auto language switching** — the UI displays in Japanese when the browser's language is Japanese, and in English otherwise.
- **Responsive design**:
  - Desktop: the map pans to keep the active satellite's longitude centered, latitude locked to the equator.
  - Mobile: the dashboard panel starts collapsed, and the map centers directly on the active satellite (both latitude and longitude).
- **Live TLE data** — fetches the latest orbital elements in parallel from [CelesTrak](https://celestrak.org/), with built-in instant fallback datasets for all 4 satellites.

## Tech Stack

- [Leaflet.js](https://leafletjs.com/) — interactive map rendering
- [satellite.js](https://github.com/shashwatak/satellite-js) — SGP4 orbital propagation
- [leaflet.terminator](https://github.com/joergdietrich/Leaflet.Terminator) — day/night overlay
- [Esri World Dark Gray Canvas](https://www.esri.com/) — free, no-API-key basemap tiles
- Vanilla JavaScript (no build step, no framework)

## File Structure

```
index.html    Page structure and markup
style.css     All styling (dark theme, layout, responsive breakpoints)
script.js     App logic (map, orbit calculation, i18n, event handling)
config.js     Optional, git-ignored: sets GTM_ID for Google Tag Manager analytics
```

## Usage

Since the app fetches live TLE data over HTTPS, serve it via a local web server rather than opening `index.html` directly as a `file://` URL:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

`config.js` is optional and git-ignored — it is only needed if you want to enable Google Tag Manager analytics:

```js
const GTM_ID = "YOUR_GTM_ID";
```

## License

MIT License — see [LICENSE](LICENSE).
