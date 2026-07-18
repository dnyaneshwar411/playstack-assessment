import z from "zod"

export default class AuthValidation {
  static login = z.object({
    body: z.object({
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(),

      password: z
        .string()
        .min(6, { message: "Password is required" })
    })
  })
}