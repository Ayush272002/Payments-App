import express, { Request, Response } from "express";
import db from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/hsbcWebhook", async (req: Request, res: Response) => {
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    // Check if the transaction has already been marked as Success
    const existingTransaction = await db.onRampTransaction.findUnique({
      where: {
        token: paymentInformation.token,
      },
    });

    if (existingTransaction?.status === "Success") {
      return res.status(200).json({
        message: "Transaction has already been processed successfully.",
      });
    }

    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.status(200).json({
      message: "Captured",
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

const server = app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

// Graceful shutdown logic
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
