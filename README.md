# Njila — Lusaka minibus route finder

Njila ("the way") tells you which minibus to take in Lusaka: where to board, where to change and roughly what it costs. Lusaka has no official open route data, so riders build and correct it themselves.

> **Status: prototype.** It has 39 starting routes, named from the WRI / Transport for Cairo *Lusaka Transit Map* (2024). Stop positions and stop orders are approximate, so every starting route shows "From survey, needs confirming" until riders confirm it.

## Features

- **Find**: search stop to stop with up to 3 minibuses, walking between the town stations (Kulima Tower, City Market, Millennium, Lumumba), a rough time, fare where reported, and "Copy for WhatsApp".
- **Map**: a simple map of stops and routes with a station filter. The selected trip is highlighted; tap a stop to set From or To.
- **Routes**: confirm a route still runs, dispute it, or report the fare you paid.
- **Add**: add a missing route (stops in order) or a missing stop (tap the map).

## Run it

It is one HTML file with no build step.

- **Quickest:** double-click `index.html` to open it in Chrome or Firefox.
- **On your phone over Wi-Fi:** run `python -m http.server 8000` in this folder, then open `http://<your-laptop-ip>:8000` on the phone.

In this version, data (routes, votes, fares) is stored in each browser's `localStorage`, so it is per device. To reset, run `localStorage.removeItem("njila.localdb")` in the browser console.

## Tests

```bash
npm install
npx playwright install chromium
npm test
```

## How routing works

The search works over routes, not roads. Each change of minibus costs a new fare in Lusaka, so fewer drops wins, then less walking, then a shorter ride. The search goes up to 3 drops and allows walking transfers between nearby stops (up to 2.2 km between town stations). Options with the same boarding and alighting stops are merged, and other routes on that stretch are listed as alternatives.

## Roadmap

1. Preact + TypeScript progressive web app (works offline) with the route engine under unit tests
2. Supabase backend (Postgres + PostGIS, auth, row-level security) so contributions are shared
3. Field data collection at the town stations; curator queue; GTFS export
4. Public launch

The full plan, data model and deployment design are in the project's design-to-deployment document.

## Data and credits

- Route names: [WRI / Transport for Cairo, Lusaka Transit Map v7](https://transportforcairo.com/wp-content/uploads/2025/02/7_Lusaka-Transit-Map_v7_.pdf)
- Stop coordinates: approximate, for prototyping only
