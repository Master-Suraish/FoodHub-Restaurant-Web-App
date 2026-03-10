import z from "zod";

export const userZodSchema = z
  .object({
    name: z.string().min(3, "Length must be three or more character"),
    email: z
      .email()
      .regex(/^[\w.-]+@[\w.-]+\.com$/, "Email must be a .com address"),
    experience: z
      .number()
      .min(1, "Experience must be at least 1 year")
      .max(50, "Experience not more than 50 year"),
    phone: z
      .string()
      .min(11, "Phone must be at least 11 digits")
      .max(13, "Phone number too long")
      .regex(
        /^(?:\+92|0)3[0-9]{9}$/,
        "Enter a valid Pakistani phone number (03001234567 or +923001234567)",
      ),
    role: z.enum(["user", "admin"]).default("user"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error will show on this field
  });

export const loginZodSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
});

export const updateUserZodSchema = z.object({
  name: z.string().min(3, "Length must be three or more character").optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  experience: z.number().min(0).optional(),
});
