import { useState, useEffect } from "react";
import { defaultSport } from "../utils";
import type { Sport } from "../types";

import Toggle from "./utility/Toggle";
import LastUpdated from "./utility/LastUpdated";

import CurrentStandings from "./content/CurrentStandings";
import HeadToHead from "./content/HeadToHead";
import FullDraft from "./content/FullDraft";
import HowTo from "./content/HowTo";

const YEAR_OPTIONS: Record<Sport, string[]> = {
  mlb: ["2026", "2025"],
  nba: ["2026", "2025", "2024"],
  nfl: ["2026", "2025", "2024"],
  wnba: ["2026"],
  fantasy: ["2026"],
  traitors: ["2026"],
};

const SPORT_OPTIONS: Sport[] = ["mlb", "nba", "nfl", "wnba", "fantasy"];

const PATH_SPORTS: Sport[] = [
  "mlb",
  "nba",
  "nfl",
  "wnba",
  "fantasy",
  "traitors",
];

function isPathSport(value: string): value is Sport {
  return PATH_SPORTS.includes(value as Sport);
}

function sportFromPath(): Sport | null {
  const segment = window.location.pathname
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean)[0];
  if (segment && isPathSport(segment)) return segment;
  return null;
}

export default function SiteLayout() {
  const initialSport = sportFromPath() ?? defaultSport();
  const [sport, setSport] = useState<Sport>(initialSport);
  const [year, setYear] = useState(YEAR_OPTIONS[initialSport][0]);
  const isFantasy = sport === "fantasy";
  const isTraitors = sport === "traitors";

  useEffect(() => {
    setYear(YEAR_OPTIONS[sport][0]);
  }, [sport]);

  useEffect(() => {
    const onPopState = () => {
      setSport(sportFromPath() ?? defaultSport());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectSport = (next: Sport) => {
    setSport(next);
    const nextPath = `/${next}`;
    if (window.location.pathname.replace(/\/$/, "") !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }
  };

  return (
    <div className="w-full">
      {!isTraitors && (
        <Toggle
          item={sport}
          options={SPORT_OPTIONS}
          setItem={selectSport}
          labels={{ fantasy: "Fantasy" }}
        />
      )}
      <LastUpdated sport={sport} />
      {!isTraitors && (
        <Toggle
          item={year}
          options={YEAR_OPTIONS[sport]}
          setItem={setYear}
        />
      )}
      <h2 className="my-3 text-xl font-semibold sm:text-2xl">
        Current Standings
      </h2>
      <CurrentStandings sport={sport} year={parseInt(year, 10)} />
      {!isTraitors && (
        <>
          <h2 className="my-3 text-xl font-semibold sm:text-2xl">Head to Head</h2>
          <HeadToHead sport={sport} year={parseInt(year, 10)} />
        </>
      )}
      <h2 className="my-3 text-xl font-semibold sm:text-2xl">Full Draft</h2>
      <FullDraft sport={sport} year={parseInt(year, 10)} />
      {!isFantasy && !isTraitors && <HowTo />}
    </div>
  );
}
