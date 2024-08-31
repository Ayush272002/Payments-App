import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2pTransactions } from "../../../components/P2pTransactions";

async function getBalance() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signup");
  }

  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getp2pTransactions() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signup");
  }

  const sentTxns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
  });

  const receivedTxns = await prisma.p2pTransfer.findMany({
    where: {
      toUserId: Number(session?.user?.id),
    },
  });

  const transactions = [
    ...sentTxns.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      to: t.toUserId,
      type: "sent" as const,
    })),
    ...receivedTxns.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      from: t.fromUserId,
      type: "received" as const,
    })),
  ];

  return transactions.sort((a, b) => b.time.getTime() - a.time.getTime());
}

export default async function () {
  const balance = await getBalance();
  const transactions = await getp2pTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer to another user
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <P2pTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
