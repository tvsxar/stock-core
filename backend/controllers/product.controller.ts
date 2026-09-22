import { createProductService, getProductsService } from "../services/product.service.js";
import type { Request, Response } from "express";
import { DatabaseError } from "pg";

export async function createProductController(req: Request, res: Response) {
  try {
    const { sku, name } = req.body;

    const product = await createProductService(sku, name);

    return res.status(201).json({ product });
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      return res
        .status(409)
        .json({ message: "Product with this SKU already exists" });
    }
    return res.status(500).json({ message: "Error creating product!" });
  }
}

export async function getProductsController(req: Request, res: Response) {
  try {
    const products = await getProductsService();

    return res.status(200).json({ products })
  } catch {
    return res.status(500).json({ message: "Error getting the products list!" });
  }
}
