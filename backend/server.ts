import "dotenv/config";
import { pool } from './database/db.js';

try {
    const res = await pool.query('SELECT NOW()');

    console.log(res.rows);
} catch {
    console.error('Database query error')
}