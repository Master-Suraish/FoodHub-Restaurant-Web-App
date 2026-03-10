import { z } from "zod";

const orderItemSchema = z.object({
  food: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid food ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  address: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "completed", "cancelled"]).optional(),
});

export const orderParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
});
