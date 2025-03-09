
import React from 'react';
import { ServiceItem } from './ServiceItem';
import { ServiceInfo } from './types';

interface ServiceListProps {
  services: ServiceInfo[];
  isLoading: boolean;
  onToggleSync: (id: string) => void;
  onConnect: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ServiceList = ({
  services,
  isLoading,
  onToggleSync,
  onConnect,
  onRemove
}: ServiceListProps) => {
  return (
    <div className="space-y-3 mt-2">
      {services.map(service => (
        <ServiceItem
          key={service.id}
          id={service.id}
          name={service.name}
          icon={service.icon}
          isConnected={service.isConnected}
          syncEnabled={service.syncEnabled}
          lastSynced={service.lastSynced}
          isLoading={isLoading}
          onToggleSync={onToggleSync}
          onConnect={onConnect}
          onRemove={onRemove}
          isDefault={["sms", "voicemail", "email"].includes(service.id)}
        />
      ))}
    </div>
  );
};
