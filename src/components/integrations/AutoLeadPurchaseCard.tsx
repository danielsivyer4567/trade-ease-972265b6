
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Settings } from "lucide-react";
import { toast } from "sonner";

export function AutoLeadPurchaseCard() {
  const [leadAutoEnabled, setLeadAutoEnabled] = useState(false);

  const handleToggleAutoLead = (checked: boolean) => {
    setLeadAutoEnabled(checked);
    if (checked) {
      toast.success("Auto lead purchase enabled");
    } else {
      toast.info("Auto lead purchase disabled");
    }
  };

  return (
    <Card className="glass-card bg-slate-200">
      <CardHeader className="bg-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>Auto Lead Purchase</CardTitle>
          </div>
          <Switch checked={leadAutoEnabled} onCheckedChange={handleToggleAutoLead} />
        </div>
        <CardDescription>
          Automatically purchase leads that match your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          When enabled, the system will automatically purchase leads that match your specified criteria,
          up to your weekly limit. Configure your preferences to control which leads are purchased.
        </p>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-slate-400 hover:bg-slate-300">
          <Settings className="h-4 w-4" />
          Configure Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
