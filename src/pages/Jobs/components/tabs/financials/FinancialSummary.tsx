
interface FinancialSummaryProps {
  quoteAmount: number;
  totalCostsWithLabor: number;
  netProfitWithLabor: number;
  jobTimer: number;
  laborCost: number;
  totalCosts: number;
}

export const FinancialSummary = ({
  quoteAmount,
  totalCostsWithLabor,
  netProfitWithLabor,
  jobTimer,
  laborCost,
  totalCosts
}: FinancialSummaryProps) => {
  return (
    <>
      <h3 className="font-medium mb-4">Financial Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Quote Amount:</span>
            <span className="font-medium text-blue-600">${quoteAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Total Costs:</span>
            <span className="font-medium text-red-600">${totalCostsWithLabor.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Net Profit:</span>
            <span className={`font-medium ${netProfitWithLabor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfitWithLabor.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Labor Hours:</span>
            <span className="font-medium">{jobTimer ? Math.floor(jobTimer / 3600) : 0} hrs</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Labor Cost:</span>
            <span className="font-medium">${laborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Materials Cost:</span>
            <span className="font-medium">${totalCosts.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};
