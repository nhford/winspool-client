import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const {Pool} = pkg;
// import { Client } from 'pg';

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });  

const relation = "standings";


export default async function handler(_, res) {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Perform your query
    const result = await client.query(`SELECT * FROM ${relation}`);

    // Close the database connection
    client.release();

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
