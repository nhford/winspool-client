import { Client } from 'pg';

const client = new Client({
    host: import.meta.env.HOST,
    port: import.meta.env.PORT,              
    user: import.meta.env.USER,       
    password: import.meta.env.PASSWORD,
    database: import.meta.env.DATABASE
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
