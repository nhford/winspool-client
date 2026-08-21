# Wins Pool Tracker

**Live:** [winspool.vercel.app](https://winspool.vercel.app/)

Dashboard for a friends fantasy-style **wins pool**: you draft pro teams, then your score is the sum of those teams’ wins. The site shows owner standings, head-to-head records, and the full draft for MLB, NBA, NFL, and WNBA.

Built by Noah Ford. Data is scraped and published by the [winspool](https://github.com/nhford/winspool) Python backend, stored in Supabase, and read here through a Vercel serverless function.

## What it does

- **Sport / year toggles** — Switch among MLB, NBA, NFL, and WNBA and the seasons that have published data (currently MLB 2025–2026, NBA 2024–2025, NFL 2024–2025, WNBA 2026).
- **Current standings** — Owner totals (wins and games), drafted-team logos in pick order, and recent form (last 10 owner-team games). Sort by wins, games, or form.
- **Head to head** — How each owner’s clubs have fared against every other owner’s clubs.
- **Full draft** — Every pick with team, owner, record, win pace, over/under, and expected wins.
- **How it works** — Draft teams, sum their wins, highest total wins the pool.

The default sport follows the calendar (MLB / WNBA in summer, NFL in fall, NBA in winter/spring).

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 + TypeScript, Vite |
| UI | Tailwind CSS + MUI |
| Data | Vercel serverless function (`api/pool-data.js`) → Supabase |
| Hosting | Vercel |

The Python scraper lives in a separate repo ([winspool](https://github.com/nhford/winspool)). GitHub Actions there refresh standings on a sport-specific schedule and upsert to Supabase.

## Local development

```bash
npm install
# create .env.local (see below)
npm run dev
```

Required env (Vercel / `.env.local`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

`npm run dev` serves the Vite app and the `/api/pool-data` function via `vite-plugin-vercel`. Production builds with `npm run build`.

## Project layout

```
src/
  main.tsx                 # shell: title, provider, layout, signature
  PoolDataContext.tsx      # fetches api/pool-data once, shares payload
  poolData.ts
  types.ts
  components/
    SiteLayout.tsx         # sport/year toggles + sections
    content/               # CurrentStandings, HeadToHead, FullDraft, HowTo
    utility/               # Title, Toggle, LastUpdated, SortChips, Signature
api/
  pool-data.js             # Vercel function: read Supabase tables
```

Supabase tables: `{sport}_standings`, `{sport}_ownersh2h` for `nfl` / `nba` / `mlb` / `wnba`, plus `update_time`.

## Related repo

Backend pipeline: [nhford/winspool](https://github.com/nhford/winspool)
