import { prisma } from "../database/db.js";
import { Prisma } from "../generated/prisma/client.js";
interface Stock {
  stock: number;
}

export async function createProductMovement(
  product_id: number,
  type: "IN" | "OUT",
  quantity: number,
  occurred_at: Date,
  tx: Prisma.TransactionClient,
) {
  const movement = await tx.stock_movements.create({
    data: {
      product_id,
      type,
      quantity,
      occurred_at,
    },
  });

  return movement;
}

export async function getCurrentStock(
  tx: Prisma.TransactionClient,
  id: number,
) {
  const currentStock = await tx.$queryRaw<Stock[]>`SELECT
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
    WHERE product_id = ${id}`;

  return currentStock[0]!.stock;
}

export async function lockProduct(
  tx: Prisma.TransactionClient,
  product_id: number,
) {
  const lockedProduct = await tx.$queryRaw<{ id: number }[]>`SELECT id
    FROM products
    WHERE id = ${product_id}
    FOR UPDATE`;

  return lockedProduct[0];
}

export async function getProductById(product_id: number) {
  const product = await prisma.products.findUnique({
    where: { id: product_id },
  });

  return product;
}

export async function getMovementsHistory(product_id: number) {
  const movementsHistory = await prisma.stock_movements.findMany({
    where: { product_id },
    orderBy: [{ occurred_at: "desc" }, { id: "desc" }],
  });

  return movementsHistory;
}
