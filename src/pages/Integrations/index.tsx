import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Settings, Database, Globe, CreditCard, Smartphone, Link, Copy, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/messaging/PhoneNumberInput";
import { ConnectedPhonesList } from "@/components/messaging/ConnectedPhonesList";
import { TwilioConnectButton } from "@/components/messaging/TwilioConnectButton";
import { TwilioConfigDialog } from "@/components/messaging/TwilioConfigDialog";
import { usePhoneNumbers } from "@/components/messaging/hooks/usePhoneNumbers";
import { useTwilioConnection } from "@/components/messaging/hooks/useTwilioConnection";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
export default function Integrations() {
  const navigate = useNavigate();
  const [leadAutoEnabled, setLeadAutoEnabled] = useState(false);
  const [cyberSourceDialogOpen, setCyberSourceDialogOpen] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [cyberSourceConfig, setCyberSourceConfig] = useState({
    merchantId: "",
    apiKeyId: "",
    secretKey: ""
  });
  const {
    userConfig
  } = useUserConfig();
  const {
    phoneNumber,
    isConnecting: isConnectingPhone,
    connectedNumbers,
    handlePhoneNumberChange,
    handleConnect,
    handleRemoveNumber
  } = usePhoneNumbers();
  const updateConnectedNumbers = (newNumber: string) => {
    connectedNumbers.push(newNumber);
  };
  const {
    twilioDialogOpen,
    setTwilioDialogOpen,
    twilioConfig,
    setTwilioConfig,
    isConnecting: isConnectingTwilio,
    handleTwilioConnect
  } = useTwilioConnection(updateConnectedNumbers);
  const handleToggleAutoLead = (checked: boolean) => {
    setLeadAutoEnabled(checked);
    if (checked) {
      toast.success("Auto lead purchase enabled");
    } else {
      toast.info("Auto lead purchase disabled");
    }
  };
  const handleCyberSourceConnectClick = () => {
    setCyberSourceDialogOpen(true);
  };
  const handleCyberSourceConfigSubmit = async () => {
    try {
      toast.success("CyberSource integration configured successfully");
      setCyberSourceDialogOpen(false);
    } catch (error) {
      console.error("Error configuring CyberSource:", error);
      toast.error("Failed to configure CyberSource integration");
    }
  };
  const generateApiKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'api_';
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedApiKey(result);
    toast.success("API key generated successfully");
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };
  return <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Integrations</h1>
        </div>
        <p className="text-gray-600">Connect your account with these services to enhance your workflow.</p>
        
        <Card>
          
          
          <CardContent className="bg-slate-200 mx-[4px] py-0 px-4 max-w-[95%]">
            <div className="space-y-4">
              <PhoneNumberInput phoneNumber={phoneNumber} isConnecting={isConnectingPhone} onChange={handlePhoneNumberChange} onConnect={handleConnect} />

              <ConnectedPhonesList connectedNumbers={connectedNumbers} onRemoveNumber={handleRemoveNumber} onAddTwilioAccount={() => setTwilioDialogOpen(true)} />

              <TwilioConnectButton />
            </div>
          </CardContent>
        </Card>
        
        <ServiceSyncCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <Card className="glass-card">
            <CardHeader className="bg-slate-200">
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
            <CardContent className="bg-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 w-auto" />
                    <span>Stripe</span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-slate-400 hover:bg-slate-300">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 w-auto" />
                    <span>PayPal</span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-slate-400 hover:bg-slate-300">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <span>CyberSource</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCyberSourceConnectClick} className="bg-slate-400 hover:bg-slate-300">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="bg-slate-200">
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
            <CardContent className="bg-slate-200">
              <p className="text-sm text-gray-600 mb-4">
                Configure how data is synchronized between the web platform and mobile applications.
                Control frequency and which data types are synced.
              </p>
              <Button className="w-full flex items-center justify-center gap-1 bg-slate-400 hover:bg-slate-300">
                Configure Sync Settings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="bg-slate-200">
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
            <CardContent className="bg-slate-200">
              <p className="text-sm text-gray-600 mb-4">
                Generate and manage API keys to allow external services to access your data.
                View request logs and control permissions.
              </p>
              {generatedApiKey && <div className="mb-4 p-2 bg-slate-300 rounded flex items-center justify-between">
                  <code className="text-xs overflow-hidden text-ellipsis">{generatedApiKey}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedApiKey)} className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>}
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1 bg-slate-400 hover:bg-slate-300" onClick={generateApiKey}>Generate Key</Button>
                <Button variant="outline" className="flex-1 bg-slate-400 hover:bg-slate-300">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={cyberSourceDialogOpen} onOpenChange={setCyberSourceDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configure CyberSource Integration</DialogTitle>
              <DialogDescription>
                Enter your CyberSource API credentials below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="merchantId" className="text-right">
                  Merchant ID
                </Label>
                <Input id="merchantId" value={cyberSourceConfig.merchantId} onChange={e => setCyberSourceConfig({
                ...cyberSourceConfig,
                merchantId: e.target.value
              })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiKeyId" className="text-right">
                  API Key ID
                </Label>
                <Input id="apiKeyId" value={cyberSourceConfig.apiKeyId} onChange={e => setCyberSourceConfig({
                ...cyberSourceConfig,
                apiKeyId: e.target.value
              })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="secretKey" className="text-right">
                  Secret Key
                </Label>
                <Input id="secretKey" type="password" value={cyberSourceConfig.secretKey} onChange={e => setCyberSourceConfig({
                ...cyberSourceConfig,
                secretKey: e.target.value
              })} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCyberSourceConfigSubmit}>
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <TwilioConfigDialog open={twilioDialogOpen} onOpenChange={setTwilioDialogOpen} config={twilioConfig} setConfig={setTwilioConfig} onConnect={handleTwilioConnect} isConnecting={isConnectingTwilio} />
      </div>
    </AppLayout>;
}