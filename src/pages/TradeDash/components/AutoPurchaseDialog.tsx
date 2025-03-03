
import { ReactNode, useState } from "react";
import { Settings } from "lucide-react";
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

interface AutoPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
}

export function AutoPurchaseDialog({ open, onOpenChange, trigger }: AutoPurchaseDialogProps) {
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [preferredPostcode, setPreferredPostcode] = useState("");
  const [autoLeadPreferences, setAutoLeadPreferences] = useState({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: ["Kitchen Renovation", "Bathroom Remodel"],
    postcodes: []
  });

  const saveAutoLeadPreferences = async () => {
    try {
      toast.success("Auto-purchase preferences saved successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving auto-lead preferences:", error);
      toast.error("Failed to save auto-purchase preferences");
    }
  };

  const addPreferredPostcode = () => {
    if (preferredPostcode && !autoLeadPreferences.postcodes.includes(preferredPostcode)) {
      setAutoLeadPreferences({
        ...autoLeadPreferences,
        postcodes: [...autoLeadPreferences.postcodes, preferredPostcode]
      });
      setPreferredPostcode("");
    }
  };

  const removePreferredPostcode = (postcode: string) => {
    setAutoLeadPreferences({
      ...autoLeadPreferences,
      postcodes: autoLeadPreferences.postcodes.filter(p => p !== postcode)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Auto-Purchase Lead Settings</DialogTitle>
          <DialogDescription>
            Configure automatic lead purchases (max 3 per week)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-purchase-toggle" className="font-medium">
              Enable Auto-Purchase
            </Label>
            <Switch
              id="auto-purchase-toggle"
              checked={autoPurchaseEnabled}
              onCheckedChange={setAutoPurchaseEnabled}
            />
          </div>
          
          {autoPurchaseEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="max-per-week">Maximum Leads Per Week</Label>
                <Select 
                  value={autoLeadPreferences.maxPerWeek.toString()} 
                  onValueChange={v => setAutoLeadPreferences({
                    ...autoLeadPreferences,
                    maxPerWeek: parseInt(v)
                  })}
                >
                  <SelectTrigger id="max-per-week">
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
                <Label htmlFor="min-budget">Minimum Budget</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <Input
                    id="min-budget"
                    type="number"
                    value={autoLeadPreferences.minBudget}
                    onChange={(e) => setAutoLeadPreferences({
                      ...autoLeadPreferences,
                      minBudget: e.target.value
                    })}
                    placeholder="5000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-distance">Maximum Distance (km)</Label>
                <Input
                  id="max-distance"
                  type="number"
                  value={autoLeadPreferences.maxDistance}
                  onChange={(e) => setAutoLeadPreferences({
                    ...autoLeadPreferences,
                    maxDistance: e.target.value
                  })}
                  placeholder="25"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Postcodes</Label>
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
                  {autoLeadPreferences.postcodes.map((postcode) => (
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
                  {autoLeadPreferences.postcodes.length === 0 && (
                    <p className="text-sm text-gray-500">No preferred postcodes added</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Job Types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`job-type-${type}`}
                        checked={autoLeadPreferences.preferredTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAutoLeadPreferences({
                              ...autoLeadPreferences,
                              preferredTypes: [...autoLeadPreferences.preferredTypes, type]
                            });
                          } else {
                            setAutoLeadPreferences({
                              ...autoLeadPreferences,
                              preferredTypes: autoLeadPreferences.preferredTypes.filter(t => t !== type)
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={`job-type-${type}`}
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
          <Button onClick={saveAutoLeadPreferences}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
