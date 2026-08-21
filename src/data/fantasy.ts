import type { H2HRow, StandingRow } from "../types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

const FANTASY_TEAMS = [
  { pick: 1, owner: "Noah", team: "Keshav Rangan" },
  { pick: 2, owner: "Rikhav", team: "Rikhav Shah" },
  { pick: 3, owner: "Keshav", team: "Ajay Manickam" },
  { pick: 4, owner: "Ajay", team: "Rohith Divi" },
  { pick: 5, owner: "Ajay", team: "Noah Ford" },
  { pick: 6, owner: "Keshav", team: "Sam Warren" },
  { pick: 7, owner: "Rikhav", team: "Stephen Starr" },
  { pick: 8, owner: "Noah", team: "Alex Frederick" },
  { pick: 9, owner: "Ajay", team: "Rohit Gandhari" },
  { pick: 10, owner: "Keshav", team: "Raymond Wheeler" },
  { pick: 11, owner: "Rikhav", team: "Dean Izzo" },
  { pick: 12, owner: "Noah", team: "Liam Nelson" },
].map((row) => ({ ...row, abbrev: initials(row.team) }));

const ZERO_VS = {
  vs_ajay: "0-0",
  vs_keshav: "0-0",
  vs_noah: "0-0",
  vs_rikhav: "0-0",
} as const;

const OWNERS = ["Ajay", "Keshav", "Noah", "Rikhav"] as const;

export const FANTASY_STANDINGS: StandingRow[] = FANTASY_TEAMS.map((row) => ({
  year: 2026,
  pick: row.pick,
  pick_int: row.pick,
  owner: row.owner,
  team: row.team,
  abbrev: row.abbrev,
  wins: 0,
  games: 0,
  record: "0-0",
  pct: 0,
  logo_scale: 1,
  ou: "—",
  wins_exp: "—",
  wins_pace: "—",
}));

export const FANTASY_H2H: H2HRow[] = [
  ...OWNERS.map((owner) => ({
    year: 2026,
    owner,
    role: "owner" as const,
    abbrev: owner,
    ...ZERO_VS,
  })),
  ...FANTASY_TEAMS.map((row) => ({
    year: 2026,
    owner: row.owner,
    role: "team" as const,
    abbrev: row.abbrev,
    ...ZERO_VS,
  })),
];
