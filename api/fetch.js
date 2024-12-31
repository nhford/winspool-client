import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const {Pool} = pkg;
// import { Client } from 'pg';

const connection = `postgresql://nhford:${process.env.PASSWORD}@winspool-6621.j77.aws-us-east-1.cockroachlabs.cloud:26257/winspool?sslmode=verify-full`;

const pool = new Pool({
    connectionString: connection
  });  

const relation1 = "nfl_standings";

const relation2 = 'nfl_ownersh2h';

const nba_standings = 'nba_standings';


export default async function handler(_, res) {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Perform your query
    const result = await client.query(`SELECT * FROM ${relation1}`);

    const h2h = await client.query(`SELECT * FROM ${relation2}`);

    const nba_standings_result = await client.query(`SELECT * FROM ${nba_standings}`);

    // Close the database connection
    client.release();

    const h2h_clean = h2h.rows;
    
    const fixed = result.rows.map(row => ({...row, pick_int: Number(row.pick)}))

    res.status(200).json({ nfl_standings: fixed, h2h: h2h_clean, nba_standings: nba_standings_result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}