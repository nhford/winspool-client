import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const {Pool} = pkg;
// import { Client } from 'pg';

const connection = `postgresql://nhford:${process.env.PASSWORD}@winspool-6621.j77.aws-us-east-1.cockroachlabs.cloud:26257/winspool?sslmode=verify-full`;

const pool = new Pool({
    connectionString: connection
  });  

const nfl_standings = "nfl_standings";

const nfl_h2h = 'nfl_ownersh2h';

const nba_standings = 'nba_standings';


export default async function handler(_, res) {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Perform your query
    const nfl_standings_result = await client.query(`SELECT * FROM ${nfl_standings}`);

    const nfl_h2h_result = await client.query(`SELECT * FROM ${nfl_h2h}`);

    const nba_standings_result = await client.query(`SELECT * FROM ${nba_standings}`);

    // Close the database connection
    client.release();

    const nfl_h2h_final = nfl_h2h_result.rows;
    
    const nfl_std_final = nfl_standings_result.rows.map(row => ({...row, pick_int: Number(row.pick)}))

    const nba_std_final = nba_standings_result.rows.map(row => ({...row, pick_int: Number(row.pick)}))

    res.status(200).json({ nfl_standings: nfl_std_final, h2h: nfl_h2h_final, nba_standings: nba_std_final });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}