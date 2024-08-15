import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2pTransactions } from "../../../components/P2pTransactions";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { MoneyFlowCard } from "../../../components/MoneyFlowCard";

async function getUserData() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signup");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session?.user?.id),
    },
    include: {
      Balance: true,
      sentTransfers: true,
      receivedTransfers: true,
      OnRampTransaction: true,
    },
  });

  if (!user) {
    redirect("/api/auth/signup");
  }

  const totalMoneyIn =
    (user.OnRampTransaction.filter((t) => t.status === "Success").reduce(
      (acc, t) => acc + t.amount,
      0
    ) +
      user.receivedTransfers.reduce((acc, t) => acc + t.amount, 0)) /
    100;

  const totalMoneyOut =
    user.sentTransfers.reduce((acc, t) => acc + t.amount, 0) / 100;

  const transactions = [
    ...user.sentTransfers.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      to: t.toUserId,
      type: "sent" as const,
    })),
    ...user.receivedTransfers.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      from: t.fromUserId,
      type: "received" as const,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime()) // Sort by most recent first
    .slice(0, 5); // Only get the top 5 recent transactions

  const onRampTransactions = user.OnRampTransaction.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }))
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  return {
    name: user.name,
    balance: {
      amount: user.Balance[0]?.amount || 0,
      locked: user.Balance[0]?.locked || 0,
    },
    totalMoneyIn,
    totalMoneyOut,
    transactions,
    onRampTransactions,
  };
}

export default async function () {
  const userData = await getUserData();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Hi {userData.name}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <BalanceCard
          amount={userData.balance.amount}
          locked={userData.balance.locked}
        />
        <MoneyFlowCard
          totalIn={userData.totalMoneyIn}
          totalOut={userData.totalMoneyOut}
        />
      </div>
      <div className="pt-4 flex gap-4">
        <div className="flex-1">
          <P2pTransactions transactions={userData.transactions} />
        </div>
        <div className="flex-1 mr-3">
          <OnRampTransactions transactions={userData.onRampTransactions} />
        </div>
      </div>
    </div>
  );
}
