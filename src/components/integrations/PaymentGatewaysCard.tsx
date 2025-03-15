
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function PaymentGatewaysCard() {
  const [cyberSourceDialogOpen, setCyberSourceDialogOpen] = useState(false);
  const [cyberSourceConfig, setCyberSourceConfig] = useState({
    merchantId: "",
    apiKeyId: "",
    secretKey: ""
  });

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

  return (
    <>
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
              <Input 
                id="merchantId" 
                value={cyberSourceConfig.merchantId} 
                onChange={e => setCyberSourceConfig({
                  ...cyberSourceConfig,
                  merchantId: e.target.value
                })} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKeyId" className="text-right">
                API Key ID
              </Label>
              <Input 
                id="apiKeyId" 
                value={cyberSourceConfig.apiKeyId} 
                onChange={e => setCyberSourceConfig({
                  ...cyberSourceConfig,
                  apiKeyId: e.target.value
                })} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secretKey" className="text-right">
                Secret Key
              </Label>
              <Input 
                id="secretKey" 
                type="password" 
                value={cyberSourceConfig.secretKey} 
                onChange={e => setCyberSourceConfig({
                  ...cyberSourceConfig,
                  secretKey: e.target.value
                })} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCyberSourceConfigSubmit}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
