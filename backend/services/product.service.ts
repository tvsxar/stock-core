import { createProduct } from "../repositories/product.repository.js";

export async function createProductService(sku: string, name: string) {
  const product = await createProduct(sku, name);

  return product;
}
