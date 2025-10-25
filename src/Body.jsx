import { useState, useEffect } from "react";
import ColorToggleButton from "./components/Toggle.jsx";
import Content from "./Content.jsx";
import Update from "./components/Update.jsx";

export default function Body() {
  const yearOptions = {
    mlb: ["2025"],
    nba: ["2025", "2024"],
    nfl: ["2025", "2024"],
  };

  const [sport, setSport] = useState("nfl");
  const [year, setYear] = useState(yearOptions["nfl"][0]);

  // reset year whenever sport changes
  useEffect(() => {
    setYear(yearOptions[sport][0]);
  }, [sport]);

  return (
    <>
      <ColorToggleButton
        item={sport}
        options={["mlb", "nba", "nfl"]}
        setItem={setSport}
      />
      <Update sport={sport} year={year} />
      <ColorToggleButton
        item={year}
        options={yearOptions[sport]}
        setItem={setYear}
      />
      <Content sport={sport} year={year} />
    </>
  );
}
