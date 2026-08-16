import type { Dispatch, SetStateAction } from "react";
import { handleSort } from "../../utils";
import type { SortDir, SortedState } from "../../types";

export type SortChipOption = {
  key: string;
  label: string;
  natural?: SortDir;
};

type SortChipsProps<T extends Record<string, unknown>> = {
  options: SortChipOption[];
  sorted: SortedState;
  setSorted: Dispatch<SetStateAction<SortedState>>;
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
  setExpandedRows?: Dispatch<SetStateAction<Record<string, boolean>>>;
  secondary?: string;
  "aria-label"?: string;
};

export default function SortChips<T extends Record<string, unknown>>({
  options,
  sorted,
  setSorted,
  data,
  setData,
  setExpandedRows,
  secondary,
  "aria-label": ariaLabel = "Sort",
}: SortChipsProps<T>) {
  return (
    <div
      className="mb-2 flex flex-wrap gap-1.5 md:hidden"
      role="toolbar"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = sorted.key === option.key;
        const arrow = active ? (sorted.dir === "asc" ? " ↑" : " ↓") : "";
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            className={
              active
                ? "border border-neutral-500 bg-neutral-100 px-2.5 py-1 text-sm font-semibold text-neutral-900"
                : "border border-neutral-300 bg-white px-2.5 py-1 text-sm text-neutral-700"
            }
            onClick={() =>
              handleSort(
                option.key,
                sorted,
                setSorted,
                data,
                setData,
                option.natural ?? "asc",
                setExpandedRows,
                secondary,
              )
            }
          >
            {option.label}
            {arrow}
          </button>
        );
      })}
    </div>
  );
}
