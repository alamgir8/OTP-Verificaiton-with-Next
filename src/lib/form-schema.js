import { z } from "zod";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Contact must be at least 10 characters long." })
    .max(15, { message: "Contact must be at most 15 characters long." })
    .regex(/^\d+$/, { message: "Contact must only contain numbers." })
    .trim(),
});

export { phoneSchema };
