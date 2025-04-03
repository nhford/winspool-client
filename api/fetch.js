import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseURL = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseURL, supabaseAnonKey);

const nfl_standings = "nfl_standings";
const nfl_h2h = "nfl_ownersh2h";
const nba_standings = "nba_standings";
const nba_h2h = "nba_ownersh2h";
const mlb_standings = "mlb_standings";
const mlb_h2h = "mlb_ownersh2h";
const update_time = "update_time";

export default async function handler(_, res) {
  try {
    // Fetch data from Supabase tables
    const { data: nfl_standings_result, error: nfl_standings_error } = await supabase
      .from(nfl_standings)
      .select("*");

    const { data: nfl_h2h_result, error: nfl_h2h_error } = await supabase
      .from(nfl_h2h)
      .select("*");

    const { data: nba_standings_result, error: nba_standings_error } = await supabase
      .from(nba_standings)
      .select("*");

    const { data: nba_h2h_result, error: nba_h2h_error } = await supabase
      .from(nba_h2h)
      .select("*");

    const { data: mlb_standings_result, error: mlb_standings_error } = await supabase
      .from(mlb_standings)
      .select("*");

    const { data: mlb_h2h_result, error: mlb_h2h_error } = await supabase
      .from(mlb_h2h)
      .select("*");

    const { data: updated_result, error: updated_error } = await supabase
      .from(update_time)
      .select("*");

    // Handle errors
    if (nfl_standings_error || nfl_h2h_error || nba_standings_error || nba_h2h_error || updated_error) {
      console.error("Supabase Query Errors:", {
        nfl_standings_error,
        nfl_h2h_error,
        nba_standings_error,
        nba_h2h_error,
        mlb_standings_error,
        mlb_h2h_error,
        updated_error
      });
      return res.status(500).json({ error: "Error fetching data from Supabase" });
    }

    // Data transformations
    const nfl_std_final = nfl_standings_result.map(row => ({
      ...row,
      pick_int: Number(row.pick) // Convert 'pick' to integer
    }));

    const nba_std_final = nba_standings_result.map(row => ({
      ...row,
      pick_int: Number(row.pick)
    }));

    const mlb_std_final = mlb_standings_result.map(row => ({
      ...row,
      pick_int: Number(row.pick)
    }));

    res.status(200).json({
      nfl_standings: nfl_std_final,
      nfl_h2h: nfl_h2h_result,
      nba_standings: nba_std_final,
      nba_h2h: nba_h2h_result,
      mlb_standings: mlb_std_final,
      mlb_h2h: mlb_h2h_result,
      updated: updated_result
    });

  } catch (error) {
    console.error("Handler Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
