import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  number: z.string().min(10),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export default userSchema;

export type User = z.infer<typeof userSchema>;
