import type { CSSProperties } from "react";
import type { Sport } from "../../types";
import { imgPath } from "../../utils";

type TeamMarkProps = {
  sport: Sport;
  abbrev: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

const FANTASY_COLORS: Record<string, string> = {
  KR: "#2563eb",
  RS: "#d97706",
  AM: "#059669",
  RD: "#7c3aed",
  NF: "#e11d48",
  SW: "#0d9488",
  SS: "#ea580c",
  AF: "#4f46e5",
  RG: "#c026d3",
  RW: "#0891b2",
  DI: "#65a30d",
  LN: "#dc2626",
};

export default function TeamMark({
  sport,
  abbrev,
  alt,
  className,
  style,
}: TeamMarkProps) {
  const label = alt ?? `${abbrev} Logo`;

  if (sport === "fantasy") {
    const backgroundColor = FANTASY_COLORS[abbrev] ?? "#525252";
    return (
      <span
        role="img"
        aria-label={label}
        title={abbrev}
        className={`flex aspect-square items-center justify-center rounded-full text-[0.65rem] font-semibold tracking-tight text-white ${className ?? ""}`}
        style={{
          backgroundColor,
          ...style,
        }}
      >
        {abbrev}
      </span>
    );
  }

  return (
    <img src={imgPath(sport, abbrev)} alt={label} className={className} style={style} />
  );
}
