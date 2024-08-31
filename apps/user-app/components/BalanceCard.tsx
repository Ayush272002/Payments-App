import { Card } from "@repo/ui/card";

export const BalanceCard = ({
  amount,
  locked,
}: {
  amount: number;
  locked: number;
}) => {
  const totalBalance = (locked + amount) / 100;

  return (
    <Card title={"Balance"}>
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div className="text-gray-600 text-sm">Unlocked Balance</div>
        <div className="text-2xl font-bold text-green-500">
          {(amount / 100).toFixed(2)} GBP
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-slate-200 py-3">
        <div className="text-gray-600 text-sm">Locked Balance</div>
        <div className="text-2xl font-bold text-red-500">
          {(locked / 100).toFixed(2)} GBP
        </div>
      </div>
      <div className="flex justify-between items-center pt-3">
        <div className="text-gray-600 text-sm">Total Balance</div>
        <div className="text-3xl font-bold text-indigo-500">
          {totalBalance.toFixed(2)} GBP
        </div>
      </div>
    </Card>
  );
};
