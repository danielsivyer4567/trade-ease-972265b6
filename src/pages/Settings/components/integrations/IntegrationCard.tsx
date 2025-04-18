import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApiKeyInput } from './ApiKeyInput';
import { Integration } from './types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface IntegrationCardProps {
  integration: Integration;
  status: string;
  apiKey: string;
  onApiKeyChange: (integration: string, value: string) => void;
  onApiKeySubmit: (integration: string) => void;
  loading: boolean;
  onConnect: (integration: Integration) => void;
  onIntegrationAction: (event: React.MouseEvent, integration: Integration) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  status,
  apiKey,
  onApiKeyChange,
  onApiKeySubmit,
  loading,
  onConnect,
  onIntegrationAction
}) => {
  const IntegrationIcon = integration.icon;
  const isConnected = status === "connected";
  const [clientId, setClientId] = useState("");
  
  // Special handling for Xero integration
  const isXero = integration.title === "Xero";
  
  const handleXeroConnect = () => {
    if (!clientId || !apiKey) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }
    
    // Store both values in the apiKey field for simplicity
    // In a real implementation, you'd want to handle these separately
    onApiKeyChange(integration.title, `${clientId}:${apiKey}`);
    onApiKeySubmit(integration.title);
  };
  
  return (
    <Card key={integration.title} className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IntegrationIcon className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg md:text-xl">{integration.title}</CardTitle>
          </div>
          <span className={`text-xs md:text-sm px-2 py-1 rounded-full ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              status?.charAt(0).toUpperCase() + 
              status?.slice(1) || 'Not Connected'
            )}
          </span>
        </div>
        <CardDescription className="text-xs md:text-sm mt-1">{integration.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0 flex-grow flex flex-col justify-end">
        {integration.apiKeyRequired && (
          <>
            {isXero ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="xero-client-id" className="text-sm">Client ID</Label>
                  <Input
                    id="xero-client-id"
                    placeholder="Enter your Xero Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="text-sm h-9"
                    disabled={loading}
                  />
                </div>
                <ApiKeyInput
                  integration={integration.title}
                  value={apiKey}
                  onChange={(value) => onApiKeyChange(integration.title, value)}
                  onSubmit={() => {}}
                  isLoading={loading}
                />
              </div>
            ) : (
              <ApiKeyInput
                integration={integration.title}
                value={apiKey}
                onChange={(value) => onApiKeyChange(integration.title, value)}
                onSubmit={() => onApiKeySubmit(integration.title)}
                isLoading={loading}
              />
            )}
          </>
        )}
        
        {loading ? (
          <Button 
            className="w-full h-9 text-sm"
            variant="outline"
            size="sm"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Connecting...
          </Button>
        ) : (
          <Link to={integration.path} className="w-full mt-auto" onClick={(e) => onIntegrationAction(e, integration)}>
            <Button 
              className="w-full h-9 text-sm"
              variant={isConnected ? "default" : "outline"}
              size="sm"
            >
              {isConnected ? "Manage Integration" : "Connect"}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
