import pkg from 'pg'

const {Client} = pkg;
// import { Client } from 'pg';

const client = new Client({
    host: process.env.VITE_HOST,
    port: process.env.VITE_PORT,
    user: process.env.VITE_USER,
    password: process.env.VITE_PASSWORD,
    database: process.env.VITE_DATABASE,
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
