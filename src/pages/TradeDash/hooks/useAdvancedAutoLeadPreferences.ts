
import { useState } from "react";
import { toast } from "sonner";

export interface AdvancedAutoLeadPreferences {
  maxPerWeek: number;
  minBudget: string;
  maxDistance: string;
  preferredTypes: string[];
  postcodes: string[];
  minSize: string;
  maxSize: string;
  serviceAreas: string[];
}

export const useAdvancedAutoLeadPreferences = () => {
  const [showAdvancedFiltersDialog, setShowAdvancedFiltersDialog] = useState(false);
  const [advancedAutoLeadEnabled, setAdvancedAutoLeadEnabled] = useState(false);
  const [advancedAutoLeadPreferences, setAdvancedAutoLeadPreferences] = useState<AdvancedAutoLeadPreferences>({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: [],
    postcodes: [],
    minSize: "0",
    maxSize: "500",
    serviceAreas: []
  });
  
  const [serviceArea, setServiceArea] = useState("");

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

  return {
    showAdvancedFiltersDialog,
    setShowAdvancedFiltersDialog,
    advancedAutoLeadEnabled,
    setAdvancedAutoLeadEnabled,
    advancedAutoLeadPreferences,
    setAdvancedAutoLeadPreferences,
    serviceArea,
    setServiceArea,
    saveAdvancedAutoLeadPreferences
  };
};
