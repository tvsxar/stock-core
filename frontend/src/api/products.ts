import type { Product } from "../types/products";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch products");
  }

  const data: { products: Product[] } = await response.json();

  return data.products;
}

export async function createProduct(product: {
  name: string;
  sku: string;
}): Promise<Product> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product");
  }

  const data: { product: Product } = await response.json();

  return data.product;
}
