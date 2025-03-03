
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { AutoPurchaseDialog } from "./AutoPurchaseDialog";
import { AdvancedPurchaseDialog } from "./AdvancedPurchaseDialog";

interface LeadCreditsCardProps {
  creditsBalance: number;
}

export const LeadCreditsCard = ({ creditsBalance }: LeadCreditsCardProps) => {
  const [showAutoLeadDialog, setShowAutoLeadDialog] = useState(false);
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [autoLeadPreferences, setAutoLeadPreferences] = useState({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: ["Kitchen Renovation", "Bathroom Remodel"],
    postcodes: []
  });

  const [showAdvancedFiltersDialog, setShowAdvancedFiltersDialog] = useState(false);
  const [advancedAutoLeadEnabled, setAdvancedAutoLeadEnabled] = useState(false);
  const [advancedAutoLeadPreferences, setAdvancedAutoLeadPreferences] = useState({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: [],
    postcodes: [],
    minSize: "0",
    maxSize: "500",
    serviceAreas: []
  });

  const [usedLeadsThisWeek, setUsedLeadsThisWeek] = useState(1);
  const [preferredPostcode, setPreferredPostcode] = useState("");
  const [serviceArea, setServiceArea] = useState("");

  const saveAutoLeadPreferences = async () => {
    try {
      // In a real app, this would save to the database
      toast.success("Auto-purchase preferences saved successfully!");
      setShowAutoLeadDialog(false);
    } catch (error) {
      console.error("Error saving auto-lead preferences:", error);
      toast.error("Failed to save auto-purchase preferences");
    }
  };

  const saveAdvancedAutoLeadPreferences = async () => {
    try {
      // In a real app, this would save to the database
      toast.success("Advanced auto-purchase preferences saved successfully!");
      setShowAdvancedFiltersDialog(false);
    } catch (error) {
      console.error("Error saving advanced auto-lead preferences:", error);
      toast.error("Failed to save advanced auto-purchase preferences");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Lead Credits Balance
        </CardTitle>
        <DollarSign className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{creditsBalance}</div>
        <div className="flex flex-col gap-2 mt-2">
          <Button size="sm" className="w-full">
            Buy More Credits
          </Button>
          <div className="flex gap-2">
            <Dialog>
              <AutoPurchaseDialog
                open={showAutoLeadDialog}
                onOpenChange={setShowAutoLeadDialog}
                enabled={autoPurchaseEnabled}
                setEnabled={setAutoPurchaseEnabled}
                preferences={autoLeadPreferences}
                setPreferences={setAutoLeadPreferences}
                onSave={saveAutoLeadPreferences}
                preferredPostcode={preferredPostcode}
                setPreferredPostcode={setPreferredPostcode}
              />
            </Dialog>
            
            <Dialog>
              <AdvancedPurchaseDialog
                open={showAdvancedFiltersDialog}
                onOpenChange={setShowAdvancedFiltersDialog}
                enabled={advancedAutoLeadEnabled}
                setEnabled={setAdvancedAutoLeadEnabled}
                preferences={advancedAutoLeadPreferences}
                setPreferences={setAdvancedAutoLeadPreferences}
                onSave={saveAdvancedAutoLeadPreferences}
                usedLeadsThisWeek={usedLeadsThisWeek}
                preferredPostcode={preferredPostcode}
                setPreferredPostcode={setPreferredPostcode}
                serviceArea={serviceArea}
                setServiceArea={setServiceArea}
              />
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
