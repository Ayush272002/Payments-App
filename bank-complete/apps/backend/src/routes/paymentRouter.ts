import { Hono } from "hono";
import prismaClientSingleton from "@repo/db/client";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export const paymentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    WEBHOOK_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();

paymentRouter.use("/*", async (c, next) => {
  const authToken = getCookie(c, "auth_token");
  if (!authToken) {
    c.status(403);
    return c.json({ error: "Unauthorized" }, 403);
  }

  try {
    const res = (await verify(authToken, c.env.JWT_SECRET)) as { id: string };
    if (!res || !res.id) {
      return c.json({ error: "unauthorized" }, 403);
    }

    c.set("userId", res.id);
    console.log("control before next");
    await next();
  } catch (e) {
    return c.json({ error: "unauthorized" }, 403);
  }
});

// TODO : Implement the deposit route
paymentRouter.post("/deposit", async (c) => {});

paymentRouter.post("/withdraw", async (c) => {
  console.log("control in start of withdraw");
  const prisma = prismaClientSingleton(c.env.DATABASE_URL);
  const { token, amount, user_identifier } = await c.req.json();

  const webhookUrl = c.env.WEBHOOK_URL;
  const maxAttempts = 30; // Retry for 1 hour (30 attempts * 2 minutes)
  const interval = 2 * 60 * 1000; // 2 minutes in milliseconds

  console.log("control before try");
  try {
    console.log("control in try");
    let isCaptured = false;

    await prisma.$transaction(async (tx) => {
      const userBalance = await tx.balance.findUnique({
        where: {
          userId: Number(c.get("userId")),
        },
      });

      console.log("control before insufficient funds");
      if (!userBalance || userBalance.amount < Number(amount)) {
        return c.json({ error: "Insufficient funds" }, 400);
      }

      console.log("control before update");
      await tx.balance.update({
        where: {
          userId: Number(c.get("userId")),
        },
        data: {
          amount: { decrement: Number(amount) },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount: Number(amount),
          type: "WITHDRAWAL",
          senderId: Number(c.get("userId")),
        },
      });

      console.log("control before for loop");
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              user_identifier,
              amount,
            }),
          });

          if (response.ok) {
            const data: { message: string } = await response.json();
            if (data.message === "Captured") {
              isCaptured = true;
              break;
            }
          }
        } catch (err) {
          console.error(`Attempt ${attempt + 1} failed. Retrying...`);
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    });

    // This block is only executed if the transaction was successful
    if (isCaptured) {
      console.log("control here");
      return c.json({ message: "Withdrawal processed successfully" }, 200);
    } else {
      console.log("control not captured");
      return c.json(
        { error: "Failed to capture withdrawal after multiple attempts" },
        500,
      );
    }
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return c.json({ error: "Failed to process withdrawal" }, 500);
  }
});
