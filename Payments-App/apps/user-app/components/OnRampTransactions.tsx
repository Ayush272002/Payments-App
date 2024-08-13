import { Card } from "@repo/ui/card";
import { OnRampStatus } from "@repo/db/client";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: OnRampStatus;
    provider: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center text-gray-500 py-8">
          No Recent Transactions
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-4 space-y-4">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm font-medium">
                Received
              </span>
              <span className="text-xs text-gray-500">
                {t.time.toDateString()}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              + £{(t.amount / 100).toFixed(2)}
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-sm font-medium ${
                  t.status === "Success"
                    ? "text-green-500"
                    : t.status === "Processing"
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {t.status}
              </span>
              <span className="text-xs text-gray-500">{t.provider}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
