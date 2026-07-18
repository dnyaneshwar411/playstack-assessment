import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(6, { message: "Password is required" })
})

export type LoginSchemaInput = z.infer<typeof loginSchema>;