import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchPoolData } from "./poolData";
import type { PoolDataPayload } from "./types";

type PoolDataContextValue = {
  payload: PoolDataPayload | null;
  loading: boolean;
  error: string | null;
};

const PoolDataContext = createContext<PoolDataContextValue | null>(null);

export function PoolDataProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<PoolDataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPoolData()
      .then((data) => {
        if (!cancelled) {
          setPayload(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error("Error fetching pool data:", err);
          setError(err instanceof Error ? err.message : "Failed to load data");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PoolDataContext.Provider value={{ payload, loading, error }}>
      {children}
    </PoolDataContext.Provider>
  );
}

export function usePoolData(): PoolDataContextValue {
  const ctx = useContext(PoolDataContext);
  if (!ctx) {
    throw new Error("usePoolData must be used within PoolDataProvider");
  }
  return ctx;
}
