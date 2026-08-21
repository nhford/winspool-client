export type Sport = "mlb" | "nba" | "nfl" | "wnba" | "fantasy";

export type SortDir = "asc" | "desc";

export type SortedState = {
  key: string;
  dir: SortDir;
};

export type StandingRow = {
  year: number;
  pick: number | string;
  pick_int?: number;
  owner: string;
  team: string;
  abbrev: string;
  wins: number | string;
  games: number | string;
  record?: string;
  pct?: number | string;
  wins_pace?: number | string;
  ou?: number | string;
  wins_exp?: number | string;
  logo_scale?: number | string;
  [key: string]: unknown;
};

export type H2HRow = {
  year: number;
  owner: string;
  role: "owner" | "team" | string;
  abbrev?: string;
  recent_record?: string | null;
  recent_n?: number | null;
  recent_window?: number | null;
  recent_wins?: number | null;
  [key: string]: unknown;
};

export type UpdateTimeRow = {
  sport: string;
  update_time: string;
};

export type PoolDataPayload = {
  nfl_standings: StandingRow[];
  nfl_h2h: H2HRow[];
  nba_standings: StandingRow[];
  nba_h2h: H2HRow[];
  mlb_standings: StandingRow[];
  mlb_h2h: H2HRow[];
  wnba_standings: StandingRow[];
  wnba_h2h: H2HRow[];
  fantasy_standings: StandingRow[];
  fantasy_h2h: H2HRow[];
  updated: UpdateTimeRow[];
};
