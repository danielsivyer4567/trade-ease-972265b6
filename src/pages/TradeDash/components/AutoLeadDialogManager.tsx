
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { AutoPurchaseDialog } from "./AutoPurchaseDialog";
import { AdvancedPurchaseDialog } from "./AdvancedPurchaseDialog";
import { useAutoLeadPreferences } from "../hooks/useAutoLeadPreferences";
import { useAdvancedAutoLeadPreferences } from "../hooks/useAdvancedAutoLeadPreferences";

interface AutoLeadDialogManagerProps {
  usedLeadsThisWeek: number;
}

export const AutoLeadDialogManager: React.FC<AutoLeadDialogManagerProps> = ({ 
  usedLeadsThisWeek 
}) => {
  const {
    showAutoLeadDialog,
    setShowAutoLeadDialog,
    autoPurchaseEnabled,
    setAutoPurchaseEnabled,
    autoLeadPreferences,
    setAutoLeadPreferences,
    preferredPostcode,
    setPreferredPostcode,
    saveAutoLeadPreferences
  } = useAutoLeadPreferences();

  const {
    showAdvancedFiltersDialog,
    setShowAdvancedFiltersDialog,
    advancedAutoLeadEnabled,
    setAdvancedAutoLeadEnabled,
    advancedAutoLeadPreferences,
    setAdvancedAutoLeadPreferences,
    serviceArea,
    setServiceArea,
    saveAdvancedAutoLeadPreferences
  } = useAdvancedAutoLeadPreferences();

  return (
    <>
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
    </>
  );
};
