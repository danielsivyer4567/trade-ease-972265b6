import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsPageTemplate from "../SettingsPageTemplate";

export default function GeneralSettings() {
  return (
    <SettingsPageTemplate
      title="General Settings"
      description="Manage your general application settings"
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Enter your company name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            placeholder="Select your timezone"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date-format">Date Format</Label>
          <Input
            id="date-format"
            placeholder="Select date format"
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </div>
    </SettingsPageTemplate>
  );
} 