
import React from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PurchaseDialogBase } from "./shared/PurchaseDialogBase";
import { MaxLeadsPerWeekSelect } from "./shared/MaxLeadsPerWeekSelect";
import { MinBudgetInput } from "./shared/MinBudgetInput";
import { PostcodeSelector } from "./shared/PostcodeSelector";
import { PreferredTypesSelector } from "./shared/PreferredTypesSelector";

interface AutoLeadPreferences {
  maxPerWeek: number;
  minBudget: string;
  maxDistance: string;
  preferredTypes: string[];
  postcodes: string[];
}

interface AutoPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  preferences: AutoLeadPreferences;
  setPreferences: (preferences: AutoLeadPreferences) => void;
  onSave: () => void;
  preferredPostcode: string;
  setPreferredPostcode: (postcode: string) => void;
}

const JOB_TYPES = ["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation"];

export const AutoPurchaseDialog = ({
  open,
  onOpenChange,
  enabled,
  setEnabled,
  preferences,
  setPreferences,
  onSave,
  preferredPostcode,
  setPreferredPostcode
}: AutoPurchaseDialogProps) => {
  const handleAddPostcode = (postcode: string) => {
    setPreferences({
      ...preferences,
      postcodes: [...preferences.postcodes, postcode]
    });
  };

  const handleRemovePostcode = (postcode: string) => {
    setPreferences({
      ...preferences,
      postcodes: preferences.postcodes.filter(p => p !== postcode)
    });
  };

  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPreferences({
        ...preferences,
        preferredTypes: [...preferences.preferredTypes, type]
      });
    } else {
      setPreferences({
        ...preferences,
        preferredTypes: preferences.preferredTypes.filter(t => t !== type)
      });
    }
  };

  return (
    <>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          Standard Auto-Purchase
        </Button>
      </DialogTrigger>
      <PurchaseDialogBase
        open={open}
        onOpenChange={onOpenChange}
        title="Auto-Purchase Lead Settings"
        description="Configure automatic lead purchases (max 3 per week)"
        enabled={enabled}
        onEnabledChange={setEnabled}
        onSave={onSave}
        onCancel={() => onOpenChange(false)}
        toggleLabel="Enable Auto-Purchase"
      >
        <MaxLeadsPerWeekSelect
          value={preferences.maxPerWeek.toString()}
          onChange={(v) => setPreferences({
            ...preferences,
            maxPerWeek: parseInt(v)
          })}
        />
        
        <MinBudgetInput
          value={preferences.minBudget}
          onChange={(value) => setPreferences({
            ...preferences,
            minBudget: value
          })}
        />
        
        <div className="space-y-2">
          <label htmlFor="max-distance">Maximum Distance (km)</label>
          <Input
            id="max-distance"
            type="number"
            value={preferences.maxDistance}
            onChange={(e) => setPreferences({
              ...preferences,
              maxDistance: e.target.value
            })}
            placeholder="25"
          />
        </div>
        
        <PostcodeSelector
          postcodes={preferences.postcodes}
          onAddPostcode={handleAddPostcode}
          onRemovePostcode={handleRemovePostcode}
        />
        
        <PreferredTypesSelector
          jobTypes={JOB_TYPES}
          selectedTypes={preferences.preferredTypes}
          onTypeChange={handleJobTypeChange}
        />
      </PurchaseDialogBase>
    </>
  );
};
