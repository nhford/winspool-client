import type { PoolDataPayload } from "./types";

let cached: PoolDataPayload | null = null;
let inflight: Promise<PoolDataPayload> | null = null;

export async function fetchPoolData(): Promise<PoolDataPayload> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = fetch("api/pool-data")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch pool data (${response.status})`);
      }
      return (await response.json()) as PoolDataPayload;
    })
    .then((payload) => {
      cached = payload;
      return payload;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
