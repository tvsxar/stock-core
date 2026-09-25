import type { PoolClient } from "pg";

export async function createProductMovement(
  product_id: number,
  type: "IN" | "OUT",
  quantity: number,
  occurred_at: Date,
  client: PoolClient,
) {
  const res = await client.query(
    `INSERT INTO stock_movements (product_id, quantity, type, occurred_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
    [product_id, quantity, type, occurred_at],
  );

  return res.rows[0];
}

export async function getCurrentStock(client: PoolClient, id: number) {
  const res = await client.query(
    `SELECT
    COALESCE(
        SUM(
            CASE
                WHEN type = 'IN' THEN quantity
                WHEN type = 'OUT' THEN -quantity
            END
        )::INTEGER,
        0
    ) AS stock
    FROM stock_movements
    WHERE product_id = $1`,
    [id],
  );

  return res.rows[0].stock;
}

export async function lockProduct(client: PoolClient, product_id: number) {
  const res = await client.query(
    `SELECT id
    FROM products
    WHERE id = $1
    FOR UPDATE`,
    [product_id],
  );

  return res.rows[0];
}
