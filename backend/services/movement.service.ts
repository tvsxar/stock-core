import {
  createProductMovement,
  getCurrentStock,
  lockProduct,
} from "../repositories/movement.repository.js";
import {
  InvalidMovementDateError,
  InsufficientStockError,
  ProductNotFoundError,
} from "../errors/movement.errors.js";
import { pool } from "../database/db.js";

export async function createProductMovementService(
  product_id: number,
  type: "IN" | "OUT",
  quantity: number,
  occurred_at: string,
) {
  const movementDate = new Date(occurred_at);

  if (movementDate.getTime() > Date.now()) {
    throw new InvalidMovementDateError();
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const product = await lockProduct(client, product_id);

    if (!product) throw new ProductNotFoundError();

    if (type === "OUT") {
      const currentStock = await getCurrentStock(client, product_id);

      if (quantity > currentStock)
        throw new InsufficientStockError(currentStock, quantity);
    }

    const res = await createProductMovement(
      product_id,
      type,
      quantity,
      movementDate,
      client,
    );

    await client.query("COMMIT");

    return res;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
