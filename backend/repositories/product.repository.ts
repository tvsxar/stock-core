import { pool } from "../database/db.js";

export async function createProduct(sku: string, name: string) {
  const res = await pool.query(
    "INSERT INTO products (sku, name) VALUES($1, $2) RETURNING *",
    [sku, name],
  );

  return res.rows[0];
}

export async function getProductList() {
  const res = await pool.query(
    `SELECT p.id, p.sku, p.name, COALESCE(
    SUM(
    CASE
      WHEN sm.type = 'IN' THEN sm.quantity
      WHEN sm.type = 'OUT' THEN -sm.quantity
    END)::INTEGER, 0) as stock 
    FROM products p LEFT JOIN stock_movements sm 
    ON p.id = sm.product_id
    GROUP BY p.id, p.sku, p.name`,
  );

  return res.rows;
}

export async function updateProductName(id: number, name: string) {
  const res = await pool.query(
    `UPDATE products
    SET name = $1
    WHERE id = $2
    RETURNING id, name, sku`,
    [name, id],
  );

  return res.rows[0];
}
