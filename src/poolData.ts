import { FANTASY_H2H, FANTASY_STANDINGS } from "./data/fantasy";
import type { PoolDataPayload } from "./types";

let cached: PoolDataPayload | null = null;
let inflight: Promise<PoolDataPayload> | null = null;

function withFantasy(payload: Partial<PoolDataPayload> = {}): PoolDataPayload {
  return {
    nfl_standings: payload.nfl_standings ?? [],
    nfl_h2h: payload.nfl_h2h ?? [],
    nba_standings: payload.nba_standings ?? [],
    nba_h2h: payload.nba_h2h ?? [],
    mlb_standings: payload.mlb_standings ?? [],
    mlb_h2h: payload.mlb_h2h ?? [],
    wnba_standings: payload.wnba_standings ?? [],
    wnba_h2h: payload.wnba_h2h ?? [],
    updated: payload.updated ?? [],
    fantasy_standings: FANTASY_STANDINGS,
    fantasy_h2h: FANTASY_H2H,
  };
}

async function fetchRemotePayload(): Promise<Partial<PoolDataPayload>> {
  const response = await fetch("/api/pool-data");
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("application/json")) {
    throw new Error(`Failed to fetch pool data (${response.status})`);
  }
  return (await response.json()) as PoolDataPayload;
}

export async function fetchPoolData(): Promise<PoolDataPayload> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = fetchRemotePayload()
    .then((payload) => withFantasy(payload))
    .catch((err: unknown) => {
      console.error("Error fetching pool data:", err);
      return withFantasy();
    })
    .then((payload) => {
      cached = payload;
      return cached;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
