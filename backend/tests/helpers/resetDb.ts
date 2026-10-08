import { prisma } from "../../database/db.js";

export async function resetDb() {
  await prisma.stock_movements.deleteMany();
  await prisma.products.deleteMany();
}
