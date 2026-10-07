import {
  createProductService,
  getProductsService,
  updateProductService,
  getProductService,
} from "../services/product.service.js";
import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";

export async function createProductController(req: Request, res: Response) {
  try {
    const { sku, name } = req.body;

    const product = await createProductService(sku, name);

    return res.status(201).json({ product });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
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

    return res.status(200).json({ products });
  } catch {
    return res
      .status(500)
      .json({ message: "Error getting the products list!" });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const id = Number(req.params.id);

    const updatedProduct = await updateProductService(id, name);

    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ message: "Product with this id doesn`t exist" });
    }
    return res.status(500).json({ message: "Error updating product!" });
  }
}

export async function getProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const product = await getProductService(id);

    if (!product)
      return res
        .status(404)
        .json({ message: "Product with this id doesn`t exist" });

    return res.status(200).json({ product });
  } catch {
    return res.status(500).json({ message: "Error getting product!" });
  }
}
