
import { useState } from "react";
import { DollarSign, Settings, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AutoPurchaseDialog } from "./AutoPurchaseDialog";
import { AdvancedPurchaseDialog } from "./AdvancedPurchaseDialog";

export function LeadCreditsCard() {
  const [showAutoLeadDialog, setShowAutoLeadDialog] = useState(false);
  const [showAdvancedFiltersDialog, setShowAdvancedFiltersDialog] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Lead Credits Balance
        </CardTitle>
        <DollarSign className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">25</div>
        <div className="flex flex-col gap-2 mt-2">
          <Button size="sm" className="w-full">
            Buy More Credits
          </Button>
          <div className="flex gap-2">
            <AutoPurchaseDialog 
              open={showAutoLeadDialog} 
              onOpenChange={setShowAutoLeadDialog}
              trigger={
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Standard Auto-Purchase
                </Button>
              }
            />
            
            <AdvancedPurchaseDialog
              open={showAdvancedFiltersDialog}
              onOpenChange={setShowAdvancedFiltersDialog}
              trigger={
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full flex items-center gap-1 bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
                >
                  <Sliders className="h-4 w-4" />
                  Advanced Auto-Purchase
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
