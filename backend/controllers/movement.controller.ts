import { createProductMovementService } from "../services/movement.service.js";
import type { Request, Response } from "express";
import {
  InvalidMovementDateError,
  InsufficientStockError,
  ProductNotFoundError,
} from "../errors/movement.errors.js";

export async function createMovementController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { type, quantity, occurred_at } = req.body;

    const movement = await createProductMovementService(
      id,
      type,
      quantity,
      occurred_at,
    );

    return res.status(201).json({ movement });
  } catch (error) {
    if (error instanceof InvalidMovementDateError)
      return res.status(400).json({ message: error.message });

    if (error instanceof InsufficientStockError)
      return res.status(409).json({ message: error.message });

    if (error instanceof ProductNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error creating movement!" });
  }
}
