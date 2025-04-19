import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Check, Link as LinkIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function XeroIntegrationCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [xeroConfig, setXeroConfig] = useState({
    clientId: "",
    clientSecret: "",
    redirectUri: window.location.origin + "/settings/integrations/xero/callback"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!xeroConfig.clientId || !xeroConfig.clientSecret) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }

    try {
      setIsLoading(true);
      
      // First, save the credentials
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

      // Construct the Xero OAuth URL
      const scope = encodeURIComponent('offline_access accounting.transactions accounting.settings');
      const state = encodeURIComponent(crypto.randomUUID());
      const xeroAuthUrl = `https://login.xero.com/identity/connect/authorize?` +
        `response_type=code` +
        `&client_id=${encodeURIComponent(xeroConfig.clientId)}` +
        `&redirect_uri=${encodeURIComponent(xeroConfig.redirectUri)}` +
        `&scope=${scope}` +
        `&state=${state}`;

      // Store state in localStorage for validation when returning
      localStorage.setItem('xeroAuthState', state);
      
      // Redirect to Xero for authorization
      window.location.href = xeroAuthUrl;

    } catch (error) {
      console.error("Error configuring Xero:", error);
      toast.error("Failed to configure Xero integration");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'clientId' | 'clientSecret', value: string) => {
    setXeroConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
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
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Connect your Xero account to automatically sync invoices, bills, payments, and track your financial data in real-time.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              type="text"
              value={xeroConfig.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              placeholder="Enter your Xero Client ID"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              value={xeroConfig.clientSecret}
              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
              placeholder="Enter your Xero Client Secret"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectUri">Redirect URI</Label>
            <div className="flex items-center gap-2">
              <Input
                id="redirectUri"
                type="text"
                value={xeroConfig.redirectUri}
                readOnly
                className="w-full bg-gray-50"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(xeroConfig.redirectUri);
                  toast.success("Redirect URI copied to clipboard");
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={isLoading || !xeroConfig.clientId || !xeroConfig.clientSecret}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            "Connecting..."
          ) : (
            <>
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect to Xero
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
