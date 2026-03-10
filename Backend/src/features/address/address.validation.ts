import { z } from "zod";

export const createAddressSchema = z.object({
  city: z.string().min(1, "City is required").min(2, "City must be at least 2 characters"),
  street: z.string().min(1, "Street is required").min(3, "Street must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone must contain only numbers"),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
});