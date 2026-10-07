import { prisma } from "../database/db.js";
interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
}

export async function createProduct(sku: string, name: string) {
  const product = await prisma.products.create({
    data: {
      sku,
      name,
    },
  });

  return product;
}

export async function getProductList() {
  const products = await prisma.$queryRaw<
    Product[]
  >`SELECT p.id, p.sku, p.name, COALESCE(
    SUM(
    CASE
      WHEN sm.type = 'IN' THEN sm.quantity
      WHEN sm.type = 'OUT' THEN -sm.quantity
    END)::INTEGER, 0) as stock 
    FROM products p LEFT JOIN stock_movements sm 
    ON p.id = sm.product_id
    GROUP BY p.id, p.sku, p.name`;

  return products;
}

export async function updateProductName(id: number, name: string) {
  const product = await prisma.products.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return product;
}

export async function getProductById(id: number) {
  const product = await prisma.$queryRaw<Product[]>`SELECT
    p.id,
    p.sku,
    p.name,
    COALESCE(
        SUM(
            CASE
                WHEN sm.type = 'IN' THEN sm.quantity
                WHEN sm.type = 'OUT' THEN -sm.quantity
            END
        )::INTEGER,
        0
    ) AS stock
    FROM products p
    LEFT JOIN stock_movements sm
      ON p.id = sm.product_id
    WHERE p.id = ${id}
    GROUP BY p.id, p.sku, p.name`;

  return product[0];
}
