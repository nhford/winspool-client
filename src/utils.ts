import type { Dispatch, SetStateAction } from "react";
import type { SortDir, SortedState, Sport } from "./types";

type SortableRow = Record<string, unknown>;

export function handleSort<T extends SortableRow>(
  key: string,
  sorted: SortedState,
  setSorted: Dispatch<SetStateAction<SortedState>>,
  data: T[],
  setData: Dispatch<SetStateAction<T[]>>,
  natural: SortDir = "desc",
  setExpandedRows?: Dispatch<SetStateAction<Record<string, boolean>>>,
  secondary = "team",
): void {
  let dir: SortDir = natural;
  if (sorted.key === key && sorted.dir === natural) {
    dir = natural === "desc" ? "asc" : "desc";
  }
  setSorted({ key, dir });
  const i = dir === "asc" ? 1 : -1;
  setData(
    [...data]
      .sort((a, b) =>
        (a[secondary] as string) < (b[secondary] as string) ? -i : i,
      )
      .sort((a, b) =>
        (a[key] as string | number) < (b[key] as string | number) ? -i : i,
      ),
  );

  if (setExpandedRows) {
    setExpandedRows((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, false])),
    );
  }
}

export function imgPath(sport: Sport | string, abbrev: string): string {
  return `/team_logos/${sport}/${abbrev.toLowerCase()}.png`;
}

const MULTI_WORD_NICKNAMES = [
  "Trail Blazers",
  "Red Sox",
  "White Sox",
  "Blue Jays",
] as const;

/** City-free team nickname, e.g. "New York Liberty" → "Liberty". */
export function teamNickname(team: string): string {
  for (const nickname of MULTI_WORD_NICKNAMES) {
    if (team.endsWith(nickname)) return nickname;
  }
  const parts = team.trim().split(/\s+/);
  return parts[parts.length - 1] ?? team;
}

export function defaultSport(): Sport {
  const current_date = new Date();
  /* getMonth() returns 0-indexed month (0-11) */
  const month = current_date.getMonth() + 1;

  /* getDate() returns day (1-31) */
  const day = current_date.getDate();
  if (month == 0) {
    return "nfl";
  } else if (month <= 2 && day <= 25) {
    return "nba";
  } else if (month <= 4 && day <= 8) {
    return "mlb";
  } else if (month <= 8) {
    return "wnba";
  } else if (month <= 9) {
    return "mlb";
  } else {
    return "nfl";
  }
}
