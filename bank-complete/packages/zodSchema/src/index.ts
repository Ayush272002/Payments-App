import { z } from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  name: z.string(),
  number: z.string().min(10, "Number must be 10 digits long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

//type inference
export type SignupInput = z.infer<typeof signupInput>;
