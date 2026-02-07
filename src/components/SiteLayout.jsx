import { useState, useEffect } from "react";
import { defaultSport } from "../utils.js";

import Toggle from "./utility/Toggle.jsx";
import LastUpdated from "./utility/LastUpdated.jsx";

import CurrentStandings from "./content/CurrentStandingsTable.jsx";
import HeadtoHead from "./content/HeadToHeadTable.jsx";
import FullDraft from "./content/FullDraftTable.jsx";
import HowTo from "./content/HowToSection.jsx";

export default function SiteLayout() {
  const yearOptions = {
    mlb: ["2025"],
    nba: ["2025", "2024"],
    nfl: ["2025", "2024"],
  };

  const default_sport = defaultSport();
  const [sport, setSport] = useState(default_sport);
  const [year, setYear] = useState(yearOptions[default_sport][0]);

  // reset year whenever sport changes
  useEffect(() => {
    setYear(yearOptions[sport][0]);
  }, [sport]);

  return (
    <>
      <Toggle item={sport} options={["mlb", "nba", "nfl"]} setItem={setSport} />
      <LastUpdated sport={sport} year={year} />
      <Toggle item={year} options={yearOptions[sport]} setItem={setYear} />
      {/* Content */}
      <h2>Current Standings</h2>
      <CurrentStandings sport={sport} year={parseInt(year)} />
      <h2>Head to Head</h2>
      <HeadtoHead sport={sport} year={parseInt(year)} />
      <h2>Full Draft</h2>
      <FullDraft sport={sport} year={parseInt(year)} />
      <HowTo />
    </>
  );
}
