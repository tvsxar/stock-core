import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  name: z.string().trim().min(1, "Name is required"),
});

export const updateProductSchema = z.strictObject({
  name: z.string().trim().min(1, "Name is required"),
});

export const productIdParamsSchema = z.object({
  id: z.coerce.number().int().positive()
})
