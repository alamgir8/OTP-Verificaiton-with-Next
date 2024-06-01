import { z } from "zod";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Contact must be 10 characters long." })
    .max(15, { message: "Contact must be 15 characters long." })
    .regex(/^\d+$/, { message: "Contact must only contain numbers." })
    .trim(),
});

const phoneSignUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .trim(),
  password: z
    .string()
    // .min(8, { message: "Be at least 8 characters long" })
    // .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    // .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
});

export { phoneSchema, phoneSignUpSchema };
