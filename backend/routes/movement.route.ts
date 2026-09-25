import express from "express";
import { createMovementController } from "../controllers/movement.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { productIdParamsSchema } from "../validation/product.validation.js";
import { createMovementSchema } from "../validation/movement.validation.js";

const router = express.Router();

router.post(
  "/:id/movements",
  validate(productIdParamsSchema, "params"),
  validate(createMovementSchema, "body"),
  createMovementController,
);

export default router;
