import { usePoolData } from "../../PoolDataContext";
import type { Sport } from "../../types";

type LastUpdatedProps = {
  sport: Sport;
};

function formatUpdateTime(utcString: string): string {
  const utcDate = new Date(utcString);
  return utcDate.toLocaleString("en-US", {
    month: "numeric",
    year: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LastUpdated({ sport }: LastUpdatedProps) {
  const { payload, loading } = usePoolData();

  if (loading || !payload) {
    return <p className="my-1 px-4 text-sm sm:text-base">Loading...</p>;
  }

  const entry = payload.updated.find((row) => row.sport === sport);
  if (!entry?.update_time) {
    return null;
  }

  return (
    <p className="my-1 px-4 text-sm sm:text-base">
      {`Last updated: ${formatUpdateTime(entry.update_time)}`}
    </p>
  );
}
