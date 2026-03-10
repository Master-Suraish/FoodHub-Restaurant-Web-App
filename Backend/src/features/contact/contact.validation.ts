import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(3, "Name must be three or more characters"),
  email: z
    .email()
    .regex(/^[\w.-]+@[\w.-]+\.com$/, "Email must be a .com address"),
  phone: z
    .string()
    .min(11, "Phone must be at least 11 digits")
    .max(13, "Phone number too long")
    .regex(
      /^(?:\+92|0)3[0-9]{9}$/,
      "Enter a valid Pakistani phone number (03001234567 or +923001234567)",
    ),
  subject: z.string().min(3, "Subject must be three or more characters"),
  message: z.string().min(10, "Message must be more than 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
