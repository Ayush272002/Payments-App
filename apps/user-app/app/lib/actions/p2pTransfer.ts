"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return {
      statusCode: 401,
      message: "User not authenticated",
    };
  }

  const from = session.user.id;
  if (!to || !amount || amount <= 0) {
    return {
      statusCode: 400,
      message: "Invalid input",
    };
  }

  const toUser = await prisma.user.findUnique({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      statusCode: 404,
      message: "Recipient not found",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Lock the balance row of the sender
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

      const fromBalance = await tx.balance.findUnique({
        where: {
          userId: Number(from),
        },
      });

      if (!fromBalance || fromBalance.amount < Number(amount)) {
        throw new Error("Insufficient balance");
      }

      // Deduct the amount from sender's balance
      await tx.balance.update({
        where: {
          userId: Number(from),
        },
        data: {
          amount: { decrement: Number(amount) },
        },
      });

      // Add the amount to the recipient's balance
      await tx.balance.update({
        where: {
          userId: Number(toUser.id),
        },
        data: { amount: { increment: Number(amount) } },
      });

      // Create a P2P transfer record
      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      });
    });

    return {
      statusCode: 200,
      message: "Transfer successful",
    };
  } catch (error: any) {
    if (error.message === "Insufficient balance") {
      return {
        statusCode: 400,
        message: "Insufficient balance",
      };
    }

    return {
      statusCode: 500,
      message: "An error occurred during the transfer",
    };
  }
}
