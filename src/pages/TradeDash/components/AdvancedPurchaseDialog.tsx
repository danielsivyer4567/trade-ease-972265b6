
import { ReactNode, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AdvancedPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
}

export function AdvancedPurchaseDialog({ open, onOpenChange, trigger }: AdvancedPurchaseDialogProps) {
  const [advancedAutoLeadEnabled, setAdvancedAutoLeadEnabled] = useState(false);
  const [preferredPostcode, setPreferredPostcode] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [usedLeadsThisWeek] = useState(1);
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

  const saveAdvancedAutoLeadPreferences = async () => {
    try {
      toast.success("Advanced auto-purchase preferences saved successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving advanced auto-lead preferences:", error);
      toast.error("Failed to save advanced auto-purchase preferences");
    }
  };

  const addPreferredPostcode = () => {
    if (preferredPostcode && !advancedAutoLeadPreferences.postcodes.includes(preferredPostcode)) {
      setAdvancedAutoLeadPreferences({
        ...advancedAutoLeadPreferences,
        postcodes: [...advancedAutoLeadPreferences.postcodes, preferredPostcode]
      });
      setPreferredPostcode("");
    }
  };

  const removePreferredPostcode = (postcode: string) => {
    setAdvancedAutoLeadPreferences({
      ...advancedAutoLeadPreferences,
      postcodes: advancedAutoLeadPreferences.postcodes.filter(p => p !== postcode)
    });
  };

  const addServiceArea = () => {
    if (serviceArea && !advancedAutoLeadPreferences.serviceAreas.includes(serviceArea)) {
      setAdvancedAutoLeadPreferences({
        ...advancedAutoLeadPreferences,
        serviceAreas: [...advancedAutoLeadPreferences.serviceAreas, serviceArea]
      });
      setServiceArea("");
    }
  };

  const removeServiceArea = (area: string) => {
    setAdvancedAutoLeadPreferences({
      ...advancedAutoLeadPreferences,
      serviceAreas: advancedAutoLeadPreferences.serviceAreas.filter(a => a !== area)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Advanced Auto-Purchase Lead Settings</DialogTitle>
          <DialogDescription>
            Configure targeted auto-purchase with advanced filters (max 3 per week)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="advanced-auto-purchase-toggle" className="font-medium">
              Enable Advanced Auto-Purchase
            </Label>
            <Switch
              id="advanced-auto-purchase-toggle"
              checked={advancedAutoLeadEnabled}
              onCheckedChange={setAdvancedAutoLeadEnabled}
            />
          </div>
          
          {advancedAutoLeadEnabled && (
            <>
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  You have used <span className="font-bold">{usedLeadsThisWeek}/3</span> auto-purchased leads this week.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="advanced-max-per-week">Maximum Leads Per Week</Label>
                <div className="text-sm text-gray-500 mb-1">
                  Maximum of 3 leads can be auto-purchased per week
                </div>
                <Select 
                  value={advancedAutoLeadPreferences.maxPerWeek.toString()} 
                  onValueChange={v => setAdvancedAutoLeadPreferences({
                    ...advancedAutoLeadPreferences,
                    maxPerWeek: parseInt(v)
                  })}
                >
                  <SelectTrigger id="advanced-max-per-week">
                    <SelectValue placeholder="Select maximum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 per week</SelectItem>
                    <SelectItem value="2">2 per week</SelectItem>
                    <SelectItem value="3">3 per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adv-min-budget">Minimum Budget</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <Input
                    id="adv-min-budget"
                    type="number"
                    value={advancedAutoLeadPreferences.minBudget}
                    onChange={(e) => setAdvancedAutoLeadPreferences({
                      ...advancedAutoLeadPreferences,
                      minBudget: e.target.value
                    })}
                    placeholder="5000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adv-min-size">Minimum Size (sqm)</Label>
                  <Input
                    id="adv-min-size"
                    type="number"
                    value={advancedAutoLeadPreferences.minSize}
                    onChange={(e) => setAdvancedAutoLeadPreferences({
                      ...advancedAutoLeadPreferences,
                      minSize: e.target.value
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adv-max-size">Maximum Size (sqm)</Label>
                  <Input
                    id="adv-max-size"
                    type="number"
                    value={advancedAutoLeadPreferences.maxSize}
                    onChange={(e) => setAdvancedAutoLeadPreferences({
                      ...advancedAutoLeadPreferences,
                      maxSize: e.target.value
                    })}
                    placeholder="500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Postcodes</Label>
                <div className="text-sm text-gray-500 mb-1">
                  Auto-purchase leads only from these postal codes
                </div>
                <div className="flex gap-2">
                  <Input
                    value={preferredPostcode}
                    onChange={(e) => setPreferredPostcode(e.target.value)}
                    placeholder="e.g. 2000"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addPreferredPostcode}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {advancedAutoLeadPreferences.postcodes.map((postcode) => (
                    <div 
                      key={postcode}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {postcode}
                      <button 
                        onClick={() => removePreferredPostcode(postcode)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {advancedAutoLeadPreferences.postcodes.length === 0 && (
                    <p className="text-sm text-gray-500">No preferred postcodes added</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Service Areas</Label>
                <div className="text-sm text-gray-500 mb-1">
                  Add suburbs or regions you're willing to service
                </div>
                <div className="flex gap-2">
                  <Input
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    placeholder="e.g. Northern Beaches"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addServiceArea}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {advancedAutoLeadPreferences.serviceAreas.map((area) => (
                    <div 
                      key={area}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {area}
                      <button 
                        onClick={() => removeServiceArea(area)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {advancedAutoLeadPreferences.serviceAreas.length === 0 && (
                    <p className="text-sm text-gray-500">No service areas added</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Services</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation", "Plastering", "Tiling", "Plumbing", "Electrical Work"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`adv-job-type-${type}`}
                        checked={advancedAutoLeadPreferences.preferredTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAdvancedAutoLeadPreferences({
                              ...advancedAutoLeadPreferences,
                              preferredTypes: [...advancedAutoLeadPreferences.preferredTypes, type]
                            });
                          } else {
                            setAdvancedAutoLeadPreferences({
                              ...advancedAutoLeadPreferences,
                              preferredTypes: advancedAutoLeadPreferences.preferredTypes.filter(t => t !== type)
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={`adv-job-type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveAdvancedAutoLeadPreferences}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
