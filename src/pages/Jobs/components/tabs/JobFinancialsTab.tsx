
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface JobFinancialsTabProps {
  jobTimer: number;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  totalRevenue: number;
  totalCosts: number;
}

export const JobFinancialsTab = ({ 
  jobTimer, 
  tabNotes, 
  setTabNotes, 
  totalRevenue,
  totalCosts 
}: JobFinancialsTabProps) => {
  const [quoteAmount, setQuoteAmount] = useState(0);
  const laborCost = (jobTimer / 3600) * 50; // Assuming $50/hour labor rate
  const totalCostsWithLabor = totalCosts + laborCost;
  const netProfitWithLabor = quoteAmount - totalCostsWithLabor;

  return (
    <TabsContent value="financials" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quote">Quote Amount ($)</Label>
            <Input
              id="quote"
              type="number"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(Number(e.target.value))}
              placeholder="Enter quote amount"
              className="mt-1"
            />
          </div>

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
          <div className="mt-4">
            <h4 className="font-medium mb-2">Financial Notes</h4>
            <Textarea
              placeholder="Add financial notes here..."
              value={tabNotes.financials || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, financials: e.target.value })}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
