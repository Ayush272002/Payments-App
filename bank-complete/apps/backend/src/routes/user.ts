import { Hono } from "hono";
import prismaClientSingleton from "@repo/db/client";
import { signupInput } from "@repo/zodschema/zodschema";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = prismaClientSingleton(c.env.DATABASE_URL);
  const body = await c.req.json();

  const validatedData = signupInput.safeParse(body);
  if (!validatedData.success) {
    c.status(400);
    return c.json({
      error: validatedData.error.errors.map((err) => err.message).join(", "),
    });
  }

  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  try {
    const hashedPassword = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        number: body.number,
        password: hashedPassword,
        balance: {
          create: {
            amount: 500000,
          },
        },
      },
    });

    const jwt = await sign(
      { id: user.id, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 }, // 30 days
      c.env.JWT_SECRET,
    );

    setCookie(c, "auth_token", jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    return c.json({ message: "User created successfully", user });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error creating user" });
  }
});
