import React from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sliders, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PurchaseDialogBase } from "./shared/PurchaseDialogBase";
import { MaxLeadsPerWeekSelect } from "./shared/MaxLeadsPerWeekSelect";
import { MinBudgetInput } from "./shared/MinBudgetInput";
import { PostcodeSelector } from "./shared/PostcodeSelector";
import { PreferredTypesSelector } from "./shared/PreferredTypesSelector";
interface AdvancedAutoLeadPreferences {
  maxPerWeek: number;
  minBudget: string;
  maxDistance: string;
  preferredTypes: string[];
  postcodes: string[];
  minSize: string;
  maxSize: string;
  serviceAreas: string[];
}
interface AdvancedPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  preferences: AdvancedAutoLeadPreferences;
  setPreferences: (preferences: AdvancedAutoLeadPreferences) => void;
  onSave: () => void;
  usedLeadsThisWeek: number;
  preferredPostcode: string;
  setPreferredPostcode: (postcode: string) => void;
  serviceArea: string;
  setServiceArea: (area: string) => void;
}
const ADVANCED_JOB_TYPES = ["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation", "Plastering", "Tiling", "Plumbing", "Electrical Work"];
export const AdvancedPurchaseDialog = ({
  open,
  onOpenChange,
  enabled,
  setEnabled,
  preferences,
  setPreferences,
  onSave,
  usedLeadsThisWeek,
  preferredPostcode,
  setPreferredPostcode,
  serviceArea,
  setServiceArea
}: AdvancedPurchaseDialogProps) => {
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
  const handleAddServiceArea = (area: string) => {
    setPreferences({
      ...preferences,
      serviceAreas: [...preferences.serviceAreas, area]
    });
  };
  const handleRemoveServiceArea = (area: string) => {
    setPreferences({
      ...preferences,
      serviceAreas: preferences.serviceAreas.filter(a => a !== area)
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
  return <>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full flex items-center gap-1 bg-slate-400 hover:bg-slate-300 text-gray-950">
          <Sliders className="h-4 w-4" />
          Advanced Auto-Purchase
        </Button>
      </DialogTrigger>
      <PurchaseDialogBase open={open} onOpenChange={onOpenChange} title="Advanced Auto-Purchase Lead Settings" description="Configure targeted auto-purchase with advanced filters (max 3 per week)" enabled={enabled} onEnabledChange={setEnabled} onSave={onSave} onCancel={() => onOpenChange(false)} toggleLabel="Enable Advanced Auto-Purchase" maxWidth="550px">
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You have used <span className="font-bold">{usedLeadsThisWeek}/3</span> auto-purchased leads this week.
          </p>
        </div>
        
        <MaxLeadsPerWeekSelect value={preferences.maxPerWeek.toString()} onChange={v => setPreferences({
        ...preferences,
        maxPerWeek: parseInt(v)
      })} id="advanced-max-per-week" helpText="Maximum of 3 leads can be auto-purchased per week" />
        
        <MinBudgetInput value={preferences.minBudget} onChange={value => setPreferences({
        ...preferences,
        minBudget: value
      })} id="adv-min-budget" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="adv-min-size">Minimum Size (sqm)</label>
            <Input id="adv-min-size" type="number" value={preferences.minSize} onChange={e => setPreferences({
            ...preferences,
            minSize: e.target.value
          })} placeholder="0" />
          </div>
          <div className="space-y-2">
            <label htmlFor="adv-max-size">Maximum Size (sqm)</label>
            <Input id="adv-max-size" type="number" value={preferences.maxSize} onChange={e => setPreferences({
            ...preferences,
            maxSize: e.target.value
          })} placeholder="500" />
          </div>
        </div>
        
        <PostcodeSelector postcodes={preferences.postcodes} onAddPostcode={handleAddPostcode} onRemovePostcode={handleRemovePostcode} helpText="Auto-purchase leads only from these postal codes" />
        
        <div className="space-y-2">
          <label>Service Areas</label>
          <div className="text-sm text-gray-500 mb-1">
            Add suburbs or regions you're willing to service
          </div>
          <div className="flex gap-2">
            <Input value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Northern Beaches" />
            <Button type="button" variant="secondary" onClick={() => {
            if (serviceArea && !preferences.serviceAreas.includes(serviceArea)) {
              handleAddServiceArea(serviceArea);
              setServiceArea("");
            }
          }}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.serviceAreas.map(area => <div key={area} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                {area}
                <button onClick={() => handleRemoveServiceArea(area)} className="text-green-600 hover:text-green-800">
                  ×
                </button>
              </div>)}
            {preferences.serviceAreas.length === 0 && <p className="text-sm text-gray-500">No service areas added</p>}
          </div>
        </div>
        
        <PreferredTypesSelector jobTypes={ADVANCED_JOB_TYPES} selectedTypes={preferences.preferredTypes} onTypeChange={handleJobTypeChange} label="Preferred Services" />
      </PurchaseDialogBase>
    </>;
};