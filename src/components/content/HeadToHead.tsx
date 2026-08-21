import {
  Fragment,
  useLayoutEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { usePoolData } from "../../PoolDataContext";
import { handleSort } from "../../utils";
import type { H2HRow, SortedState, Sport } from "../../types";
import TeamMark from "../utility/TeamMark";

type OwnerH2HRow = {
  owner: string;
  [key: string]: string | number | undefined;
};

type HeadToHeadProps = {
  sport: Sport;
  year: number;
};

export default function HeadToHead({ sport, year }: HeadToHeadProps) {
  const { payload, loading } = usePoolData();
  const [data, setData] = useState<OwnerH2HRow[]>([]);
  const [sorted, setSorted] = useState<SortedState>({
    key: "vs_Noah",
    dir: "desc",
  });
  const [headers, setHeaders] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<H2HRow[]>([]);
  const [sortKey, setSortKey] = useState<SortedState>({
    key: "vs_Noah",
    dir: "desc",
  });

  useLayoutEffect(() => {
    if (!payload) return;

    const rows = payload[`${sport}_h2h`] || [];
    const teams = rows
      .filter((item) => item.role == "team")
      .filter((item) => item.year == year);
    setTeamData(teams);

    const ownerRows: OwnerH2HRow[] = rows
      .filter((item) => item.role === "owner")
      .filter((item) => item.year == year)
      .map((item) => {
        const { owner, ...rest } = item;
        const cleaned = { ...rest } as Record<string, unknown>;
        delete cleaned.abbrev;
        delete cleaned.role;
        delete cleaned.year;
        delete cleaned.recent_record;
        delete cleaned.recent_n;
        delete cleaned.recent_window;
        delete cleaned.recent_wins;
        return { owner, ...cleaned } as OwnerH2HRow;
      })
      .sort((a, b) => a.owner.localeCompare(b.owner));

    const owners_set = new Set<string>();
    rows
      .filter((item) => item.year == year)
      .forEach((item) => {
        owners_set.add(item.owner);
      });
    const owners = [...owners_set].sort((a, b) => a.localeCompare(b));

    setLabels(["Owner \\ vs", ...owners]);
    setHeaders([
      "owner",
      ...owners.map((owner) => {
        const cap = owner.replace(/^./, (c) => c.toLowerCase());
        return `vs_${cap}`;
      }),
    ]);
    setData(ownerRows);
    setExpandedRow(null);
    setSorted({ key: "vs_Noah", dir: "desc" });
    setSortKey({ key: "vs_Noah", dir: "desc" });
  }, [payload, sport, year]);

  function recordSort<T extends Record<string, unknown>>(
    key: string,
    sortedState: SortedState,
    setSortedState: Dispatch<SetStateAction<SortedState>>,
    stateData: T[],
    setState: Dispatch<SetStateAction<T[]>>,
  ) {
    let dir: SortedState["dir"] = "desc";
    if (sortedState.key == key && sortedState.dir == "desc") {
      dir = "asc";
    }
    setSortedState({ key, dir });
    const i = dir == "asc" ? 1 : -1;
    setState(
      [...stateData].sort((a, b) => {
        const records = [a, b].map((row) =>
          String(row[key] ?? "0-0")
            .split("-")
            .map((x) => parseInt(x, 10)),
        );
        const rest = records.map((record) =>
          record.slice(1).reduce((acc, e) => acc + e, 0),
        );
        const games = records.map((r, idx) => r[0] + rest[idx]);
        const [pct1, pct2] = records.map((record, idx) =>
          record[0] + rest[idx] > 0 ? record[0] / (record[0] + rest[idx]) : 0,
        );
        return pct1 == pct2
          ? pct1 >= 0.5
            ? games[0] > games[1]
              ? i
              : -i
            : games[1] < games[0]
              ? -i
              : i
          : pct1 > pct2
            ? i
            : -i;
      }),
    );
  }

  const toggleExpand = (owner: string) => {
    setExpandedRow(expandedRow === owner ? null : owner);
  };

  if (loading || !payload) {
    return <p className="my-1 px-4 text-sm sm:text-base">Loading..</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="data-table h2h-table w-max min-w-full md:w-full md:table-fixed">
        <thead>
          <tr className="bg-white">
            {labels.map((label, i) => (
              <th
                key={i}
                className="cursor-pointer whitespace-nowrap px-1"
                onClick={() =>
                  i == 0
                    ? handleSort(
                        headers[i],
                        sorted,
                        setSorted,
                        data,
                        setData,
                        "asc",
                      )
                    : recordSort(headers[i], sorted, setSorted, data, setData)
                }
              >
                {i === 0 ? (
                  <>
                    <span className="md:hidden">Owner</span>
                    <span className="max-md:hidden">{label}</span>
                  </>
                ) : (
                  label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const isExpanded = expandedRow === row.owner;
            const toggle = () => toggleExpand(row.owner);
            return (
            <Fragment key={row.owner}>
              <tr
                className="group cursor-pointer bg-white transition-colors hover:bg-neutral-100"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${row.owner}`}
                onClick={toggle}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle();
                  }
                }}
              >
                {headers.map((col, i) => (
                  <td
                    key={i}
                    className={
                      i - 1 == rowIndex
                        ? "whitespace-nowrap bg-neutral-300 group-hover:bg-neutral-400"
                        : "whitespace-nowrap group-hover:bg-neutral-100"
                    }
                  >
                    <span
                      className={
                        i === 0
                          ? "group-hover:underline decoration-black underline-offset-2"
                          : undefined
                      }
                    >
                      {row[col] as ReactNode}
                    </span>
                  </td>
                ))}
              </tr>
              {isExpanded && (
                <tr>
                  <td colSpan={headers.length} className="p-0">
                    <table className="data-table h2h-table w-max min-w-full md:w-full md:table-fixed">
                      <thead>
                        <tr className="bg-white">
                          <th
                            className="cursor-pointer whitespace-nowrap px-1"
                            onClick={() =>
                              handleSort(
                                "abbrev",
                                sortKey,
                                setSortKey,
                                teamData,
                                setTeamData,
                                "asc",
                              )
                            }
                          >
                            <span className="md:hidden">Team</span>
                            <span className="max-md:hidden">Team \ vs</span>
                          </th>
                          {labels.map(
                            (label, i) =>
                              i > 0 && (
                                <th
                                  key={i}
                                  className="cursor-pointer whitespace-nowrap px-1"
                                  onClick={() =>
                                    recordSort(
                                      headers[i],
                                      sortKey,
                                      setSortKey,
                                      teamData,
                                      setTeamData,
                                    )
                                  }
                                >
                                  {label}
                                </th>
                              ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {teamData
                          .filter((team) => team.owner === expandedRow)
                          .map((team, i) => (
                            <tr key={i} className="bg-white">
                              <td className="whitespace-nowrap">
                                <TeamMark
                                  sport={sport}
                                  abbrev={team.abbrev ?? ""}
                                  alt={`${team.abbrev} Logo`}
                                  className="mx-auto w-[min(2.75rem,8vw)] p-1"
                                />
                              </td>
                              {headers.map(
                                (col, j) =>
                                  j > 0 && (
                                    <td key={j} className="whitespace-nowrap">
                                      {String(team[col] ?? "")}
                                    </td>
                                  ),
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
