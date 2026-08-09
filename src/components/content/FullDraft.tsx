import { Fragment, useLayoutEffect, useState } from "react";
import { usePoolData } from "../../PoolDataContext";
import { handleSort, imgPath, teamNickname } from "../../utils";
import type { SortedState, Sport, StandingRow } from "../../types";

type FullDraftProps = {
  sport: Sport;
  year: number;
};

export default function FullDraft({ sport, year }: FullDraftProps) {
  const { payload, loading } = usePoolData();
  const [data, setData] = useState<StandingRow[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [sorted, setSorted] = useState<SortedState>({ key: "pct", dir: "asc" });

  useLayoutEffect(() => {
    if (!payload) return;

    let rows = [...(payload[`${sport}_standings`] || [])];
    rows.sort((a, b) =>
      Number(a.pick_int) < Number(b.pick_int) ? -1 : 1,
    );
    rows = rows.filter((row) => row.year == year);
    setData(rows);
    setExpandedRows(
      Object.fromEntries(rows.map((row) => [row.abbrev, false])),
    );
    setSorted({ key: "pct", dir: "asc" });
  }, [payload, sport, year]);

  const toggleExpand = (rowAbbrev: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowAbbrev]: !prev[rowAbbrev],
    }));
  };

  if (loading || !payload) {
    return <p className="my-1 px-4 text-sm sm:text-base">Loading..</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="data-table w-full">
        <thead>
          <tr className="bg-white">
            <th
              colSpan={2}
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort(
                  "team",
                  sorted,
                  setSorted,
                  data,
                  setData,
                  "desc",
                  setExpandedRows,
                )
              }
            >
              Team
            </th>
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort(
                  "pick_int",
                  sorted,
                  setSorted,
                  data,
                  setData,
                  "desc",
                  setExpandedRows,
                )
              }
            >
              Pick
            </th>
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort(
                  "owner",
                  sorted,
                  setSorted,
                  data,
                  setData,
                  "desc",
                  setExpandedRows,
                )
              }
            >
              Owner
            </th>
            <th
              className="cursor-pointer px-1"
              onClick={() =>
                handleSort(
                  "pct",
                  sorted,
                  setSorted,
                  data,
                  setData,
                  "asc",
                  setExpandedRows,
                )
              }
            >
              Record
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isExpanded = Boolean(expandedRows[row.abbrev]);
            const toggle = () => toggleExpand(row.abbrev);
            return (
              <Fragment key={row.abbrev}>
                <tr
                  className="group cursor-pointer bg-white transition-colors hover:bg-neutral-100"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${row.team}`}
                  onClick={toggle}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggle();
                    }
                  }}
                >
                  <td>
                    <img
                      className="mx-auto w-[min(2.75rem,8vw)] p-1"
                      src={imgPath(sport, row.abbrev)}
                      alt={row.abbrev + " Logo"}
                    />
                  </td>
                  <td className="text-[min(1rem,3.5vw)] group-hover:underline decoration-black underline-offset-2">
                    <span className="md:hidden">{teamNickname(row.team)}</span>
                    <span className="max-md:hidden">{row.team}</span>
                  </td>
                  <td>{parseInt(String(row.pick), 10)}</td>
                  <td className="text-[min(1rem,3.5vw)]">{row.owner}</td>
                  <td>{String(row.record ?? "")}</td>
                </tr>
                {isExpanded && (
                  <tr className="bg-white">
                    <td colSpan={5} className="bg-neutral-50 p-2.5 text-left">
                      <div>
                        <strong>Details for {row.team}</strong>
                        <p className="my-1 px-0">
                          Current Wins Pace: {String(row.wins_pace ?? "")}
                        </p>
                        <p className="my-1 px-0">
                          Preseason Over/Under: {String(row.ou ?? "")}
                        </p>
                        <p className="my-1 px-0">
                          Expected Wins by Draft Slot:{" "}
                          {String(row.wins_exp ?? "")}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
