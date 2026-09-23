# ISS Live Orbit Tracker & Simulator

[日本語版はこちら](README.ja.md)

A single-page web app that tracks the International Space Station (ISS) in real time on a dark, glassmorphic map — with day/night shading, a live-updating orbit path, and a time-travel simulator.

## Features

- **Real-time ISS position** — latitude, longitude, altitude, and ground speed, updated every second using orbital propagation (SGP4).
- **Day/night terminator overlay** — shows which parts of the Earth are currently in daylight or darkness.
- **Orbit trail** — draws the past 1 hour (flown) and next 1 hour (predicted) of the ISS ground track, with time markers at +15/+30/+45/+60 minutes.
- **Time-jump simulation** — pick any date/time to see where the ISS was or will be, then jump back to live tracking.
- **Auto language switching** — the UI displays in Japanese when the browser's language is Japanese, and in English otherwise.
- **Responsive design**:
  - Desktop: the map pans to keep the ISS's longitude centered, latitude locked to the equator.
  - Mobile: the dashboard panel starts collapsed, and the map centers directly on the ISS (both latitude and longitude).
- **Live TLE data** — fetches the latest orbital elements from [CelesTrak](https://celestrak.org/), with a built-in fallback dataset if the request fails or times out.

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
