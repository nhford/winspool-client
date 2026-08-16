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
  nba: ["2025", "2024"],
  nfl: ["2025", "2024"],
  wnba: ["2026"],
};

const SPORT_OPTIONS: Sport[] = ["mlb", "nba", "nfl", "wnba"];

export default function SiteLayout() {
  const initialSport = defaultSport();
  const [sport, setSport] = useState<Sport>(initialSport);
  const [year, setYear] = useState(YEAR_OPTIONS[initialSport][0]);

  useEffect(() => {
    setYear(YEAR_OPTIONS[sport][0]);
  }, [sport]);

  return (
    <div className="w-full">
      <Toggle item={sport} options={SPORT_OPTIONS} setItem={setSport} />
      <LastUpdated sport={sport} />
      <Toggle
        item={year}
        options={YEAR_OPTIONS[sport]}
        setItem={setYear}
      />
      <h2 className="my-3 text-xl font-semibold sm:text-2xl">
        Current Standings
      </h2>
      <CurrentStandings sport={sport} year={parseInt(year, 10)} />
      <h2 className="my-3 text-xl font-semibold sm:text-2xl">Head to Head</h2>
      <HeadToHead sport={sport} year={parseInt(year, 10)} />
      <h2 className="my-3 text-xl font-semibold sm:text-2xl">Full Draft</h2>
      <FullDraft sport={sport} year={parseInt(year, 10)} />
      <HowTo />
    </div>
  );
}
