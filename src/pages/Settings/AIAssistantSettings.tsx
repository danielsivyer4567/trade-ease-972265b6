
import { Zap } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function AIAssistantSettings() {
  return (
    <SettingsPageTemplate title="AI Assistant Settings" icon={<Zap className="h-7 w-7 text-gray-700" />}>
      <div className="max-w-3xl space-y-6">
        <p className="text-gray-600">Configure how the AI assistant works throughout the Trade Ease platform.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable AI Assistant</Label>
                <p className="text-sm text-gray-500">Allow the AI assistant to help with tasks across the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Voice Interaction</Label>
                <p className="text-sm text-gray-500">Enable voice commands and responses</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Proactive Suggestions</Label>
                <p className="text-sm text-gray-500">AI will suggest actions based on your activity</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-base">Response Detail Level</Label>
                <span className="text-sm font-medium">Detailed</span>
              </div>
              <Slider defaultValue={[75]} max={100} step={25} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Brief</span>
                <span>Balanced</span>
                <span>Detailed</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Quote Generation</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-base">Schedule Optimization</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-base">Invoice Processing</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-base">Customer Communication</Label>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-base">Job Analysis</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsPageTemplate>
  );
}
