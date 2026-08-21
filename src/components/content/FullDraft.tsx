import { useLayoutEffect, useState } from "react";
import { usePoolData } from "../../PoolDataContext";
import { handleSort, teamNickname } from "../../utils";
import type { H2HRow, SortedState, Sport, StandingRow } from "../../types";
import SortChips, { type SortChipOption } from "../utility/SortChips";
import TeamMark from "../utility/TeamMark";

type FullDraftProps = {
  sport: Sport;
  year: number;
};

type DraftRow = StandingRow & {
  nickname: string;
  recent_record: string;
  recent_n: number;
  recent_wins: number;
};

function buildDraftRows(
  year: number,
  standings: StandingRow[],
  h2h: H2HRow[],
): { rows: DraftRow[]; formWindow: number | null } {
  const formByAbbrev: Record<
    string,
    { recent_record: string; recent_n: number; recent_wins: number }
  > = {};
  let formWindow: number | null = null;

  h2h
    .filter((row) => row.role === "team" && row.year == year)
    .forEach((row) => {
      if (row.abbrev == null) return;
      if (row.recent_record != null) {
        formByAbbrev[row.abbrev] = {
          recent_record: row.recent_record,
          recent_n: row.recent_n ?? 0,
          recent_wins: row.recent_wins ?? 0,
        };
      }
      if (row.recent_window != null) {
        formWindow = row.recent_window;
      }
    });

  const rows: DraftRow[] = standings
    .filter((row) => row.year == year)
    .map((row) => {
      const form = formByAbbrev[row.abbrev];
      return {
        ...row,
        nickname: teamNickname(String(row.team)),
        recent_record: form?.recent_record ?? "—",
        recent_n: form?.recent_n ?? 0,
        recent_wins: form?.recent_wins ?? -1,
      };
    })
    .sort((a, b) => Number(a.pick_int) - Number(b.pick_int));

  return { rows, formWindow };
}

export default function FullDraft({ sport, year }: FullDraftProps) {
  const { payload, loading } = usePoolData();
  const [data, setData] = useState<DraftRow[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [sorted, setSorted] = useState<SortedState>({
    key: "pick_int",
    dir: "asc",
  });
  const [formWindow, setFormWindow] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!payload) return;

    const { rows, formWindow: windowSize } = buildDraftRows(
      year,
      payload[`${sport}_standings`] || [],
      payload[`${sport}_h2h`] || [],
    );
    const nextRows =
      sport === "fantasy"
        ? rows.map((row) => ({ ...row, nickname: String(row.team) }))
        : rows;
    setData(nextRows);
    setFormWindow(windowSize);
    setExpandedRows(
      Object.fromEntries(rows.map((row) => [row.abbrev, false])),
    );
    setSorted({ key: "pick_int", dir: "asc" });
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

  const isFantasy = sport === "fantasy";
  const formLabelShort = formWindow != null ? `L${formWindow}` : "Form";
  const formLabelLong =
    formWindow != null ? `Last ${formWindow}` : "Form";

  const draftSortChips: SortChipOption[] = isFantasy
    ? [
        { key: "pick_int", label: "Pick", natural: "asc" },
        { key: "nickname", label: "Team", natural: "asc" },
        { key: "owner", label: "Owner", natural: "asc" },
      ]
    : [
        { key: "pick_int", label: "Pick", natural: "asc" },
        { key: "pct", label: "Record", natural: "desc" },
        { key: "recent_wins", label: formLabelShort, natural: "desc" },
        { key: "nickname", label: "Team", natural: "asc" },
        { key: "owner", label: "Owner", natural: "asc" },
      ];

  return (
    <div className="w-full">
      <SortChips
        options={draftSortChips}
        sorted={sorted}
        setSorted={setSorted}
        data={data}
        setData={setData}
        setExpandedRows={setExpandedRows}
        secondary="nickname"
        aria-label="Sort full draft"
      />
      <div className="w-full overflow-x-auto">
        <table className="data-table draft-table w-full">
          <thead className="max-md:hidden">
            <tr className="bg-white">
              <th
                colSpan={2}
                className="cursor-pointer px-1"
                onClick={() =>
                  handleSort(
                    "nickname",
                    sorted,
                    setSorted,
                    data,
                    setData,
                    "asc",
                    setExpandedRows,
                    "nickname",
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
                    "asc",
                    setExpandedRows,
                    "nickname",
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
                    "asc",
                    setExpandedRows,
                    "nickname",
                  )
                }
              >
                Owner
              </th>
              {!isFantasy && (
                <th
                  className="cursor-pointer px-1"
                  onClick={() =>
                    handleSort(
                      "pct",
                      sorted,
                      setSorted,
                      data,
                      setData,
                      "desc",
                      setExpandedRows,
                      "nickname",
                    )
                  }
                >
                  Record
                </th>
              )}
              {!isFantasy && (
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
                      setExpandedRows,
                      "nickname",
                    )
                  }
                  title={
                    formWindow != null
                      ? `Record over each team's last ${formWindow} games`
                      : "Recent form"
                  }
                >
                  {formLabelLong}
                </th>
              )}
            </tr>
          </thead>
          {data.map((row) => {
            const isExpanded = Boolean(expandedRows[row.abbrev]);
            const toggle = () => toggleExpand(row.abbrev);
            const pick = parseInt(String(row.pick), 10);
            return (
              <tbody key={row.abbrev} className="bg-white">
                <tr
                  className={
                    isFantasy
                      ? "draft-main bg-white max-md:grid max-md:w-full max-md:grid-cols-[auto_1fr_auto] max-md:grid-rows-[auto_auto] max-md:items-center max-md:gap-x-2 max-md:gap-y-0.5 max-md:px-2.5 max-md:py-2"
                      : "draft-main group cursor-pointer bg-white transition-colors hover:bg-neutral-100 max-md:grid max-md:w-full max-md:grid-cols-[auto_1fr_auto_auto] max-md:grid-rows-[auto_auto] max-md:items-center max-md:gap-x-2 max-md:gap-y-0.5 max-md:px-2.5 max-md:py-2"
                  }
                  role={isFantasy ? undefined : "button"}
                  tabIndex={isFantasy ? undefined : 0}
                  aria-expanded={isFantasy ? undefined : isExpanded}
                  aria-label={
                    isFantasy
                      ? undefined
                      : `${isExpanded ? "Collapse" : "Expand"} details for ${row.team}`
                  }
                  onClick={isFantasy ? undefined : toggle}
                  onKeyDown={
                    isFantasy
                      ? undefined
                      : (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            toggle();
                          }
                        }
                  }
                >
                  <td className="max-md:col-start-1 max-md:row-span-2 max-md:row-start-1 max-md:border-none max-md:p-0">
                    <TeamMark
                      sport={sport}
                      abbrev={row.abbrev}
                      alt={row.team}
                      className="mx-auto w-[min(2.75rem,8vw)] p-1 max-md:mx-0 max-md:w-10 max-md:p-0"
                    />
                  </td>
                  <td className="text-[min(1rem,3.5vw)] group-hover:underline decoration-black underline-offset-2 max-md:col-start-2 max-md:row-start-1 max-md:border-none max-md:p-0 max-md:text-left max-md:text-base max-md:font-semibold max-md:no-underline">
                    <span className="md:hidden">
                      {isFantasy ? row.team : row.nickname}
                    </span>
                    <span className="max-md:hidden">{row.team}</span>
                  </td>
                  <td className="max-md:col-start-3 max-md:row-start-1 max-md:border-none max-md:p-0">
                    <span className="max-md:hidden">{pick}</span>
                    <div className="hidden max-md:flex flex-col items-center justify-center leading-snug">
                      <span className="text-base">{pick}</span>
                      <span className="-mt-0.5 text-[0.6em]">Pick</span>
                    </div>
                  </td>
                  <td className="text-[min(1rem,3.5vw)] max-md:col-start-2 max-md:row-start-2 max-md:border-none max-md:p-0 max-md:text-left max-md:text-sm max-md:text-neutral-600">
                    {row.owner}
                  </td>
                  {!isFantasy && (
                    <td className="max-md:col-start-4 max-md:row-start-1 max-md:border-none max-md:p-0">
                      <span className="max-md:hidden">{String(row.record ?? "")}</span>
                      <div className="hidden max-md:flex flex-col items-center justify-center leading-snug">
                        <span className="text-base">{String(row.record ?? "")}</span>
                        <span className="-mt-0.5 text-[0.6em]">Record</span>
                      </div>
                    </td>
                  )}
                  {!isFantasy && (
                    <td className="max-md:col-start-3 max-md:col-span-2 max-md:row-start-2 max-md:border-none max-md:p-0 max-md:text-right max-md:text-sm max-md:text-neutral-600">
                      <span className="max-md:hidden">{row.recent_record}</span>
                      <span className="hidden max-md:inline">
                        {formLabelShort}: {row.recent_record}
                        {row.recent_n > 0 &&
                        formWindow != null &&
                        row.recent_n < formWindow
                          ? ` (${row.recent_n} gms)`
                          : ""}
                      </span>
                    </td>
                  )}
                </tr>
                {!isFantasy && isExpanded && (
                  <tr className="draft-detail bg-white">
                    <td
                      colSpan={6}
                      className="bg-neutral-50 p-2.5 text-left max-md:p-2.5"
                    >
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
                        <p className="my-1 px-0">
                          {formLabelLong}: {row.recent_record}
                          {row.recent_n > 0 &&
                          formWindow != null &&
                          row.recent_n < formWindow
                            ? ` (${row.recent_n} games)`
                            : ""}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
