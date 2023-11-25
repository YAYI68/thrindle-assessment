import z from "zod";

export const transactionSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Not a valid email" }),
  amount: z.coerce
    .number({ required_error: "Amount is required" })
    .min(3, { message: "Must be  100 and above" }),
});
