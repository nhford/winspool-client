import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const {Client} = pkg;
// import { Client } from 'pg';

const client = new Client({
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
    await client.connect();

    // Perform your query
    const result = await client.query(`SELECT * FROM ${relation}`);

    // Close the database connection
    await client.end();

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
