import { pool } from "../database/db.js";

export async function createProduct(sku: string, name: string) {
  const res = await pool.query(
    "INSERT INTO products (sku, name) VALUES($1, $2) RETURNING *",
    [sku, name],
  );

  return res.rows[0];
}
