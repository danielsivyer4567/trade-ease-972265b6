
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ServiceInfo } from "./types";

interface ServiceItemProps {
  service: ServiceInfo;
  onToggleSync: (serviceId: string) => void;
  onConnect: (serviceId: string) => void;
  onRemove: (serviceId: string) => void;
  isLoading: boolean;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  onToggleSync,
  onConnect,
  onRemove,
  isLoading
}) => {
  const IconComponent = service.icon.icon;
  
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <div className="flex items-center space-x-3">
        <IconComponent {...service.icon.props} />
        <div>
          <h4 className="text-sm font-medium">{service.name}</h4>
          {service.isConnected && (
            <p className="text-xs text-gray-500">
              {service.lastSynced ? `Last synced: ${service.lastSynced}` : 'Never synced'}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {service.isConnected ? (
          <>
            <Switch
              id={`sync-toggle-${service.id}`}
              checked={service.syncEnabled}
              onCheckedChange={() => onToggleSync(service.id)}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(service.id)}
              disabled={isLoading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConnect(service.id)}
            disabled={isLoading}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
