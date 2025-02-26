
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface JobFinancialsTabProps {
  jobTimer: number;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
}

export const JobFinancialsTab = ({ jobTimer, tabNotes, setTabNotes }: JobFinancialsTabProps) => {
  return (
    <TabsContent value="financials" className="space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Total Revenue:</span>
              <span className="font-medium text-green-600">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Costs:</span>
              <span className="font-medium text-red-600">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Net Profit:</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Labor Hours:</span>
              <span className="font-medium">{jobTimer ? Math.floor(jobTimer / 3600) : 0} hrs</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Labor Cost:</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Materials Cost:</span>
              <span className="font-medium">$0.00</span>
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
    </TabsContent>
  );
};
