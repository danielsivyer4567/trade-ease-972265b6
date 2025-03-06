
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Settings, Database, Globe, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Integrations() {
  const navigate = useNavigate();
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
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Integrations</h1>
        </div>
        <p className="text-gray-600">Connect your account with these services to enhance your workflow.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Auto Lead Purchase</CardTitle>
                </div>
                <Switch 
                  checked={leadAutoEnabled} 
                  onCheckedChange={handleToggleAutoLead}
                />
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
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Configure Preferences
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Payment Gateways</CardTitle>
              </div>
              <CardDescription>
                Connect payment processing services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                      alt="Stripe" className="h-6 w-auto" />
                    <span>Stripe</span>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                      alt="PayPal" className="h-6 w-auto" />
                    <span>PayPal</span>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Mobile App Sync</CardTitle>
              </div>
              <CardDescription>
                Sync data with the mobile application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Configure how data is synchronized between the web platform and mobile applications.
                Control frequency and which data types are synced.
              </p>
              <Button className="w-full flex items-center justify-center gap-1">
                Configure Sync Settings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Globe className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle>API Access</CardTitle>
              </div>
              <CardDescription>
                Manage API keys and access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Generate and manage API keys to allow external services to access your data.
                View request logs and control permissions.
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1">Generate Key</Button>
                <Button variant="outline" className="flex-1">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
