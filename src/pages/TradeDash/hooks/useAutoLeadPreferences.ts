
import { useState } from "react";
import { toast } from "sonner";

export interface AutoLeadPreferences {
  maxPerWeek: number;
  minBudget: string;
  maxDistance: string;
  preferredTypes: string[];
  postcodes: string[];
}

export const useAutoLeadPreferences = () => {
  const [showAutoLeadDialog, setShowAutoLeadDialog] = useState(false);
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [autoLeadPreferences, setAutoLeadPreferences] = useState<AutoLeadPreferences>({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: ["Kitchen Renovation", "Bathroom Remodel"],
    postcodes: []
  });
  const [preferredPostcode, setPreferredPostcode] = useState("");

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

  return {
    showAutoLeadDialog,
    setShowAutoLeadDialog,
    autoPurchaseEnabled,
    setAutoPurchaseEnabled,
    autoLeadPreferences,
    setAutoLeadPreferences,
    preferredPostcode,
    setPreferredPostcode,
    saveAutoLeadPreferences
  };
};
