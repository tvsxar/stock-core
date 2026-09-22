import { z } from 'zod';

export const createProductSchema = z.object({
    sku: z.string().trim().min(1, "SKU is required"),
    name: z.string().trim().min(1, "Name is required"),
})
