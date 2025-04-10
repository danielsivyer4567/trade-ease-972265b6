
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApiKeyInput } from './ApiKeyInput';
import { Integration } from './types';

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
            {status?.charAt(0).toUpperCase() + 
            status?.slice(1) || 'Not Connected'}
          </span>
        </div>
        <CardDescription className="text-xs md:text-sm mt-1">{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 flex-grow flex flex-col justify-end">
        {integration.apiKeyRequired && (
          <ApiKeyInput
            integration={integration.title}
            value={apiKey}
            onChange={(value) => onApiKeyChange(integration.title, value)}
            onSubmit={() => onApiKeySubmit(integration.title)}
            isLoading={loading}
          />
        )}
        {!isConnected && integration.apiKeyRequired ? (
          <Button 
            className="w-full h-9 text-sm"
            variant="outline"
            size="sm"
            onClick={() => onConnect(integration)}
          >
            Connect
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
