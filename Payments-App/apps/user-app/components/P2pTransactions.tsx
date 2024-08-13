import { Card } from "@repo/ui/card";
import prisma from "@repo/db/client";

interface Transaction {
  time: Date;
  amount: number;
  to?: number;
  from?: number;
  type: "sent" | "received";
}

interface P2pTransactionsProps {
  transactions: Transaction[];
}

const findUserName = async (id: number): Promise<string> => {
  const user = await prisma.user.findFirst({
    where: { id },
  });

  return user?.name || "Unknown User";
};

export const P2pTransactions = async ({
  transactions,
}: P2pTransactionsProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center text-gray-500 py-8">
          No Recent Transfers
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transfers">
      <div className="pt-4 space-y-4">
        {await Promise.all(
          transactions.map(async (t, index) => {
            const userName =
              t.type === "sent" && t.to
                ? await findUserName(t.to)
                : t.type === "received" && t.from
                  ? await findUserName(t.from)
                  : "Unknown User";

            return (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-gray-700 text-sm font-medium">
                    {t.type === "sent" ? "Sent" : "Received"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t.time.toDateString()}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    t.type === "sent" ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {t.type === "sent" ? "-" : "+"} £{(t.amount / 100).toFixed(2)}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-700 text-sm font-medium">
                    {t.type === "sent" ? "To" : "From"}
                  </span>
                  <span className="text-xs text-gray-500">{userName}</span>
                </div>
              </div>
            );
          }),
        )}
      </div>
    </Card>
  );
};
