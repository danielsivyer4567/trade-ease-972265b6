import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface XeroIntegrationCardProps {
  status: string;
  loading: boolean;
  clientId: string;
  clientSecret: string;
  onClientIdChange: (value: string) => void;
  onClientSecretChange: (value: string) => void;
  onConnect?: () => void;
}

export const XeroIntegrationCard: React.FC<XeroIntegrationCardProps> = ({
  status,
  loading,
  clientId,
  clientSecret,
  onClientIdChange,
  onClientSecretChange,
  onConnect
}) => {
  const [launchUrl] = useState("http://localhost:8080/settings/integrations/xero/callback");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }

    try {
      setIsLoading(true);
      
      // First, save the credentials
      const response = await supabase.functions.invoke('validate-integration', {
        body: {
          integration: "Xero",
          apiKey: clientSecret,
          clientId: clientId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to configure Xero integration');
      }

      // Store the redirect URI in localStorage
      localStorage.setItem('xeroRedirectUri', launchUrl);

      // Construct the Xero OAuth URL with properly encoded parameters
      const scopes = ['offline_access', 'accounting.transactions', 'accounting.settings'];
      const scope = encodeURIComponent(scopes.join(' '));
      const state = crypto.randomUUID();
      
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: launchUrl,
        scope,
        state
      });

      // Store state in localStorage for validation when returning
      localStorage.setItem('xeroAuthState', state);
      
      // Redirect to Xero for authorization
      const xeroAuthUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
      window.location.href = xeroAuthUrl;

    } catch (error) {
      console.error("Error configuring Xero:", error);
      toast.error("Failed to configure Xero integration");
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg md:text-xl">Xero</CardTitle>
          </div>
          <span className={`text-xs md:text-sm px-2 py-1 rounded-full ${
            status === "connected"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {loading || isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              status.charAt(0).toUpperCase() + status.slice(1)
            )}
          </span>
        </div>
        <CardDescription className="text-xs md:text-sm mt-1">
          Connect your Xero account to sync invoices, payments, and accounting data.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0 flex-grow flex flex-col justify-end">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="xero-launch-url" className="text-sm">Redirect URL</Label>
            <Input
              id="xero-launch-url"
              value={launchUrl}
              className="text-sm h-9"
              disabled={true}
            />
            <p className="text-xs text-gray-500">Use this URL in your Xero app configuration</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="xero-client-id" className="text-sm">Client ID</Label>
            <Input
              id="xero-client-id"
              placeholder="Enter your Xero Client ID"
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
              className="text-sm h-9"
              disabled={loading || status === "connected"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xero-client-secret" className="text-sm">Client Secret</Label>
            <Input
              id="xero-client-secret"
              type="password"
              placeholder="Enter your Xero Client Secret"
              value={clientSecret}
              onChange={(e) => onClientSecretChange(e.target.value)}
              className="text-sm h-9"
              disabled={loading || status === "connected"}
            />
          </div>
        </div>
        
        {loading || isLoading ? (
          <Button 
            className="w-full h-9 text-sm"
            variant="outline"
            size="sm"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Connecting...
          </Button>
        ) : status === "connected" ? (
          <Button 
            className="w-full h-9 text-sm"
            variant="default"
            size="sm"
            onClick={onConnect}
          >
            Manage Integration
          </Button>
        ) : (
          <Button 
            className="w-full h-9 text-sm"
            variant="outline"
            size="sm"
            onClick={handleConnect}
            disabled={!clientId || !clientSecret}
          >
            Connect to Xero
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 