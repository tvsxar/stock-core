import { pool } from "../../database/db.js";

export async function resetDb() {
  await pool.query("DELETE FROM stock_movements");
  await pool.query("DELETE FROM products");
}
