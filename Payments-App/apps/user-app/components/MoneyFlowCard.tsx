export function MoneyFlowCard({
  totalIn,
  totalOut,
}: {
  totalIn: number;
  totalOut: number;
}) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg rounded-xl p-6 text-white">
      <div className="text-2xl font-bold mb-4">Money Flow</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
          <div className="text-sm font-semibold">Total Money In</div>
          <div className="text-3xl font-bold mt-2 text-green-300">
            ${totalIn.toLocaleString()}
          </div>
        </div>
        <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
          <div className="text-sm font-semibold">Total Money Out</div>
          <div className="text-3xl font-bold mt-2 text-red-300">
            ${totalOut.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
