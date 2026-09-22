import { createProductService } from "../services/product.service.js";
import type { Request, Response } from "express";
import { DatabaseError } from "pg";

export async function createProductController(req: Request, res: Response) {
  try {
    const { sku, name } = req.body;

    if (typeof sku !== "string" || typeof name !== "string")
      return res.status(400).json({
        message: "SKU and name must be strings!",
      });

    const product = await createProductService(sku, name);

    res.status(201).json({ product });
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      return res
        .status(409)
        .json({ message: "Product with this SKU already exists" });
    }
    return res.status(500).json({ message: "Error creating product!" });
  }
}
