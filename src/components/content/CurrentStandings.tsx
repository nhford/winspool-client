import { useLayoutEffect, useState, type CSSProperties } from "react";
import { usePoolData } from "../../PoolDataContext";
import { handleSort } from "../../utils";
import type { H2HRow, SortedState, Sport, StandingRow } from "../../types";
import SortChips, { type SortChipOption } from "../utility/SortChips";
import TeamMark from "../utility/TeamMark";

/** Fixed logo slot size in px (desktop). Logos are contained within this box. */
const LOGO_FULL_SIZE = 68;
/** Horizontal gap between logo slots on desktop (px). */
const LOGO_GAP = 20;

type StandingsOwnerRow = {
  owner: string;
  wins: number;
  games: number;
  teams: string[];
  recent_record: string;
  recent_n: number;
  recent_wins: number;
};

type CurrentStandingsProps = {
  sport: Sport;
  year: number;
};

function buildStandings(
  year: number,
  standings: StandingRow[],
  h2h: H2HRow[],
): {
  rows: StandingsOwnerRow[];
  logoScaleByAbbrev: Record<string, number>;
  formWindow: number | null;
  maxTeams: number;
} {
  const yearStandings = standings
    .filter((row) => row.year == year)
    .sort((a, b) => Number(a.pick) - Number(b.pick));

  const formByOwner: Record<
    string,
    { recent_record: string; recent_n: number; recent_wins: number }
  > = {};
  let formWindow: number | null = null;
  h2h
    .filter((row) => row.role === "owner" && row.year == year)
    .forEach((row) => {
      if (row.recent_record != null) {
        formByOwner[row.owner] = {
          recent_record: row.recent_record,
          recent_n: row.recent_n ?? 0,
          recent_wins: row.recent_wins ?? 0,
        };
      }
      if (row.recent_window != null) {
        formWindow = row.recent_window;
      }
    });

  const logoScaleByAbbrev: Record<string, number> = {};
  const byOwner = yearStandings.reduce<
    Record<string, { wins: number; games: number; teams: string[] }>
  >((acc, team) => {
    const scale = Number(team.logo_scale);
    logoScaleByAbbrev[team.abbrev] = Number.isFinite(scale) ? scale : 1;
    if (!acc[team.owner]) {
      acc[team.owner] = { wins: 0, games: 0, teams: [] };
    }
    acc[team.owner].wins += parseInt(String(team.wins), 10);
    acc[team.owner].games += parseInt(String(team.games), 10);
    // yearStandings is pick-ordered, so this is draft order per owner
    acc[team.owner].teams.push(team.abbrev);
    return acc;
  }, {});

  let maxTeams = 0;
  const rows: StandingsOwnerRow[] = Object.entries(byOwner).map(
    ([owner, { wins, games, teams }]) => {
      maxTeams = Math.max(maxTeams, teams.length);
      const form = formByOwner[owner];
      return {
        owner,
        wins,
        games,
        teams,
        recent_record: form?.recent_record ?? "—",
        recent_n: form?.recent_n ?? 0,
        recent_wins: form?.recent_wins ?? -1,
      };
    },
  );
  rows.sort((a, b) => b.wins - a.wins || a.games - b.games);

  return { rows, logoScaleByAbbrev, formWindow, maxTeams };
}

export default function CurrentStandings({ sport, year }: CurrentStandingsProps) {
  const { payload, loading } = usePoolData();
  const [data, setData] = useState<StandingsOwnerRow[]>([]);
  const [sorted, setSorted] = useState<SortedState>({ key: "wins", dir: "desc" });
  const [logoScaleByAbbrev, setLogoScaleByAbbrev] = useState<Record<string, number>>(
    {},
  );
  const [formWindow, setFormWindow] = useState<number | null>(null);
  const [maxTeams, setMaxTeams] = useState(0);

  useLayoutEffect(() => {
    if (!payload) return;

    const {
      rows,
      logoScaleByAbbrev: scales,
      formWindow: windowSize,
      maxTeams: teamCols,
    } = buildStandings(
      year,
      payload[`${sport}_standings`] || [],
      payload[`${sport}_h2h`] || [],
    );

    setData(rows);
    setLogoScaleByAbbrev(scales);
    setFormWindow(windowSize);
    setMaxTeams(teamCols);
    setSorted({ key: "wins", dir: "desc" });
  }, [payload, sport, year]);

  if (loading || !payload) {
    return <p className="my-1 px-4 text-sm sm:text-base">Loading..</p>;
  }

  const formLabelShort = formWindow != null ? `L${formWindow}` : "Form";
  const formLabelLong =
    formWindow != null ? `Last ${formWindow}` : "Form";

  const standingsSortChips: SortChipOption[] = [
    { key: "owner", label: "Owner", natural: "asc" },
    { key: "wins", label: "Wins", natural: "desc" },
    { key: "recent_wins", label: formLabelShort, natural: "desc" },
  ];

  return (
    <div className="w-full">
      <SortChips
        options={standingsSortChips}
        sorted={sorted}
        setSorted={setSorted}
        data={data}
        setData={setData}
        secondary="owner"
        aria-label="Sort standings"
      />
      <div className="w-full overflow-x-auto">
      <table className="data-table standings-table w-full md:table-fixed">
        <colgroup className="max-md:hidden">
          <col className="w-[16%]" />
          <col className="w-[10%]" />
          <col className="w-[14%]" />
          <col className="w-[60%]" />
        </colgroup>
        <thead className="max-md:hidden">
          <tr className="bg-white">
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort("owner", sorted, setSorted, data, setData, "asc")
              }
            >
              Owner
            </th>
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort("wins", sorted, setSorted, data, setData, "desc")
              }
            >
              Wins
            </th>
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort(
                  "recent_wins",
                  sorted,
                  setSorted,
                  data,
                  setData,
                  "desc",
                )
              }
              title={
                formWindow != null
                  ? `Record over each owner's last ${formWindow} team-games`
                  : "Recent form"
              }
            >
              <span className="md:hidden">{formLabelShort}</span>
              <span className="hidden md:inline">{formLabelLong}</span>
            </th>
            <th className="cursor-default px-1 text-center">Teams</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.owner}
              className="bg-white md:h-20 max-md:grid max-md:w-full max-md:grid-cols-3 max-md:grid-rows-[auto_auto] max-md:items-center max-md:gap-x-2 max-md:gap-y-1.5 max-md:rounded-md max-md:px-2.5 max-md:py-2"
            >
              <td className="max-md:col-start-1 max-md:row-start-1 max-md:border-none max-md:p-0 max-md:text-left max-md:text-base max-md:font-semibold">
                {item.owner}
              </td>
              <td className="max-md:col-start-2 max-md:row-start-1 max-md:border-none max-md:p-0">
                <div className="flex min-h-[2.5em] flex-col items-center justify-center leading-snug">
                  <span className="text-sm">{item.wins}</span>
                  <span className="-mt-0.5 text-[0.6em]">{`Games: ${item.games}`}</span>
                </div>
              </td>
              <td className="max-md:col-start-3 max-md:row-start-1 max-md:border-none max-md:p-0">
                <div className="flex min-h-[2.5em] flex-col items-center justify-center leading-snug">
                  <span className="text-sm">
                    <span className="md:hidden">{formLabelShort}: </span>
                    {item.recent_record}
                  </span>
                  {item.recent_n > 0 &&
                  formWindow != null &&
                  item.recent_n < formWindow ? (
                    <span className="-mt-0.5 text-[0.6em]">
                      {`${item.recent_n} gms`}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="max-md:col-span-3 max-md:row-start-2 max-md:border-none max-md:p-0">
                <div
                  className="mx-auto grid h-11 w-full items-center justify-items-center md:h-[var(--logo-slot)] md:w-max md:justify-items-center md:gap-x-[var(--logo-gap)] [grid-template-columns:repeat(var(--team-cols),minmax(0,1fr))] md:[grid-template-columns:repeat(var(--team-cols),var(--logo-slot))]"
                  style={
                    {
                      "--team-cols": maxTeams,
                      "--logo-slot": `${LOGO_FULL_SIZE}px`,
                      "--logo-gap": `${LOGO_GAP}px`,
                    } as CSSProperties
                  }
                >
                  {item.teams.map((abbrev, idx) => {
                    const scale = logoScaleByAbbrev[abbrev] ?? 1;
                    // Cap at 1 so logo_scale can shrink sparse marks but never overflow the slot.
                    const fitScale = Math.min(Number.isFinite(scale) ? scale : 1, 1);
                    return (
                      <div
                        key={idx}
                        className="flex h-full min-h-0 min-w-0 w-full items-center justify-center overflow-hidden"
                      >
                        <TeamMark
                          sport={sport}
                          abbrev={abbrev}
                          alt={abbrev + " Logo"}
                          className="max-h-full max-w-full object-contain p-0.5"
                          style={{
                            width: `${fitScale * 100}%`,
                            height: `${fitScale * 100}%`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
