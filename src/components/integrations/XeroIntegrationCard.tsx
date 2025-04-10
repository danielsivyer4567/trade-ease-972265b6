
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Check, Link, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function XeroIntegrationCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [xeroConfig, setXeroConfig] = useState({
    clientId: "",
    clientSecret: "",
    redirectUri: window.location.origin + "/settings/integrations/xero/callback"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (isConnected) {
      // Open management interface
      window.location.href = "/settings/integrations/xero";
      return;
    }
    
    setConfigDialogOpen(true);
  };

  const handleConfigSubmit = async () => {
    try {
      setIsLoading(true);
      
      const response = await supabase.functions.invoke('validate-integration', {
        body: {
          integration: "Xero",
          apiKey: xeroConfig.clientSecret,
          clientId: xeroConfig.clientId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to configure Xero integration');
      }

      toast.success("Xero integration configured successfully");
      setConfigDialogOpen(false);
      setIsConnected(true);
    } catch (error) {
      console.error("Error configuring Xero:", error);
      toast.error("Failed to configure Xero integration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="glass-card h-full">
        <CardHeader className="bg-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>Xero Accounting</CardTitle>
            </div>
            {isConnected && (
              <div className="bg-green-100 px-2 py-1 rounded-full text-xs text-green-700 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </div>
            )}
          </div>
          <CardDescription>
            Sync financial data with Xero accounting software
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-200 flex flex-col h-full">
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            Connect your Xero account to automatically sync invoices, bills, payments, and track your financial data in real-time.
          </p>
          <div className="mt-auto">
            <Button 
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-2 bg-[#13B5EA] hover:bg-[#0DA3D4] text-white"
            >
              {isConnected ? (
                <>
                  <Settings className="h-4 w-4" />
                  Manage Connection
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  Connect to Xero
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Xero Integration</DialogTitle>
            <DialogDescription>
              Enter your Xero API credentials below. You can find these in your Xero developer dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client ID
              </Label>
              <Input 
                id="clientId" 
                value={xeroConfig.clientId} 
                onChange={e => setXeroConfig({
                  ...xeroConfig,
                  clientId: e.target.value
                })} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientSecret" className="text-right">
                Client Secret
              </Label>
              <Input 
                id="clientSecret" 
                type="password" 
                value={xeroConfig.clientSecret} 
                onChange={e => setXeroConfig({
                  ...xeroConfig,
                  clientSecret: e.target.value
                })} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="redirectUri" className="text-right">
                Redirect URI
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input 
                  id="redirectUri" 
                  value={xeroConfig.redirectUri} 
                  readOnly
                  className="bg-gray-100" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    navigator.clipboard.writeText(xeroConfig.redirectUri);
                    toast.success("Redirect URI copied to clipboard");
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleConfigSubmit} 
              disabled={isLoading || !xeroConfig.clientId || !xeroConfig.clientSecret}
              className="bg-[#13B5EA] hover:bg-[#0DA3D4] text-white"
            >
              {isLoading ? "Connecting..." : "Connect to Xero"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
