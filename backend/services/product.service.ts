import {
  createProduct,
  getProductList,
  updateProductName,
} from "../repositories/product.repository.js";

export async function createProductService(sku: string, name: string) {
  const product = await createProduct(sku, name);

  return product;
}

export async function getProductsService() {
  const products = await getProductList();

  return products;
}

export async function updateProductService(id: number, name: string) {
  const updatedProduct = await updateProductName(id, name);

  return updatedProduct;
}
