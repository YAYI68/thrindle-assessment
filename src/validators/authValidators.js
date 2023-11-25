import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Not a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
});

export const loginBodySchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Not a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
});
