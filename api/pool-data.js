import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// vercel env pull writes .env.local; dotenv's default only loads .env
dotenv.config({ path: ".env.local" });
dotenv.config();

const nfl_standings = "nfl_standings";
const nfl_h2h = "nfl_ownersh2h";
const nba_standings = "nba_standings";
const nba_h2h = "nba_ownersh2h";
const mlb_standings = "mlb_standings";
const mlb_h2h = "mlb_ownersh2h";
const wnba_standings = "wnba_standings";
const wnba_h2h = "wnba_ownersh2h";
const update_time = "update_time";

let supabase = null;

function getSupabase() {
  if (supabase) return supabase;

  const supabaseURL = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  supabase = createClient(supabaseURL, supabaseAnonKey);
  return supabase;
}

function withPickInt(rows) {
  return (rows ?? []).map((row) => ({
    ...row,
    pick_int: Number(row.pick),
  }));
}

export default async function handler(_, res) {
  try {
    const client = getSupabase();

    const [
      { data: nfl_standings_result, error: nfl_standings_error },
      { data: nfl_h2h_result, error: nfl_h2h_error },
      { data: nba_standings_result, error: nba_standings_error },
      { data: nba_h2h_result, error: nba_h2h_error },
      { data: mlb_standings_result, error: mlb_standings_error },
      { data: mlb_h2h_result, error: mlb_h2h_error },
      { data: wnba_standings_result, error: wnba_standings_error },
      { data: wnba_h2h_result, error: wnba_h2h_error },
      { data: updated_result, error: updated_error },
    ] = await Promise.all([
      client.from(nfl_standings).select("*"),
      client.from(nfl_h2h).select("*"),
      client.from(nba_standings).select("*"),
      client.from(nba_h2h).select("*"),
      client.from(mlb_standings).select("*"),
      client.from(mlb_h2h).select("*"),
      client.from(wnba_standings).select("*"),
      client.from(wnba_h2h).select("*"),
      client.from(update_time).select("*"),
    ]);

    if (
      nfl_standings_error ||
      nfl_h2h_error ||
      nba_standings_error ||
      nba_h2h_error ||
      mlb_standings_error ||
      mlb_h2h_error ||
      wnba_standings_error ||
      wnba_h2h_error ||
      updated_error
    ) {
      console.error("Supabase Query Errors:", {
        nfl_standings_error,
        nfl_h2h_error,
        nba_standings_error,
        nba_h2h_error,
        mlb_standings_error,
        mlb_h2h_error,
        wnba_standings_error,
        wnba_h2h_error,
        updated_error,
      });
      return res.status(500).json({ error: "Error fetching data from Supabase" });
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=600",
    );

    return res.status(200).json({
      nfl_standings: withPickInt(nfl_standings_result),
      nfl_h2h: nfl_h2h_result,
      nba_standings: withPickInt(nba_standings_result),
      nba_h2h: nba_h2h_result,
      mlb_standings: withPickInt(mlb_standings_result),
      mlb_h2h: mlb_h2h_result,
      wnba_standings: withPickInt(wnba_standings_result),
      wnba_h2h: wnba_h2h_result,
      updated: updated_result,
    });
  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
