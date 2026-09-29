import { z } from "zod";

export const createMovementSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().positive(),
  occurred_at: z.string().datetime({ offset: true }),
});
