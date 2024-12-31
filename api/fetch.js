import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const {Pool} = pkg;
// import { Client } from 'pg';

const connection = `postgresql://nhford:${process.env.PASSWORD}@winspool-6621.j77.aws-us-east-1.cockroachlabs.cloud:26257/winspool?sslmode=verify-full`;

const pool = new Pool({
    connectionString: connection
  });  

const relation1 = "standings";

const relation2 = 'ownersh2h';


export default async function handler(_, res) {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Perform your query
    const result = await client.query(`SELECT * FROM ${relation1}`);

    const h2h = await client.query(`SELECT * FROM ${relation2}`);

    // Close the database connection
    client.release();

    const h2h_clean = h2h.rows;
    
    const fixed = result.rows.map(row => ({...row, pick_int: Number(row.pick)}))

    res.status(200).json({ data: fixed, h2h: h2h_clean });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// function formatH2H(rows){
//     return rows.map(row => {
//         const values = Object.entries(row);
//         return values.reduce((acc, [key, col], i) => {
//             if (i === 0) {
//                 acc[key] = col;
//             } else {
//                 acc[key] = String(col)
//                     .slice(1, -1)
//                     .split(',')
//                     .map(x => parseInt(x));
//             }
//             return acc;
//         }, {});
//     });
// }