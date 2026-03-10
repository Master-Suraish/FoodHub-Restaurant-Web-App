import z from "zod";

export const foodSchema = z.object(
    {
        name: z.string().min(3, "Length must be three or more"),
        description: z.string().min(8, "give some valid description"),
        price: z.number().min(1, "price should be greater than 1"),
        rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating cannot be more than 5").optional(),
        category: z.string(),
        image: z.string().url("Invalid URL").optional(),
    } 
)

export const foodParam = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid food ID")
})