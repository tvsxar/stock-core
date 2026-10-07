import {
  createProductMovement,
  getCurrentStock,
  getMovementsHistory,
  lockProduct,
} from "../repositories/movement.repository.js";
import {
  InvalidMovementDateError,
  InsufficientStockError,
  ProductNotFoundError,
} from "../errors/movement.errors.js";
import { prisma } from "../database/db.js";
import { Prisma } from "../generated/prisma/client.js";
import { getProductById } from "../repositories/product.repository.js";

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

  const movement = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const product = await lockProduct(tx, product_id);

      if (!product) throw new ProductNotFoundError();

      if (type === "OUT") {
        const currentStock = await getCurrentStock(tx, product_id);

        if (quantity > currentStock)
          throw new InsufficientStockError(currentStock, quantity);
      }

      const movement = await createProductMovement(
        product_id,
        type,
        quantity,
        movementDate,
        tx,
      );

      return movement;
    },
  );

  return movement;
}

export async function getMovementsService(product_id: number) {
  const product = await getProductById(product_id);

  if (!product) throw new ProductNotFoundError();

  const movementsHistory = await getMovementsHistory(product_id);

  return movementsHistory;
}
