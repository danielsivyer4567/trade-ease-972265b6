
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { ServiceList } from './ServiceList';
import { ServiceListHeader } from './ServiceListHeader';
import { ConnectServiceDialog } from './ConnectServiceDialog';
import { useMessagingServices } from './hooks/useMessagingServices';

export const ServiceSyncCard = () => {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const {
    services,
    isLoading,
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll
  } = useMessagingServices();

  // Check if there are any services that can be synced
  const hasSyncableServices = services.some(s => s.isConnected && s.syncEnabled);

  return (
    <>
      <Card className="p-3">
        <CardHeader className="bg-slate-200 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Service Synchronization
          </CardTitle>
          <CardDescription>
            Keep your messages in sync across multiple platforms
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2 bg-slate-200">
          <ServiceListHeader
            isLoading={isLoading}
            onAddService={() => setIsConnectDialogOpen(true)}
            onSyncAll={handleSyncAll}
            hasSyncableServices={hasSyncableServices}
          />
          
          <ServiceList
            services={services}
            isLoading={isLoading}
            onToggleSync={handleToggleSync}
            onConnect={handleConnectService}
            onRemove={handleRemoveService}
          />
        </CardContent>
      </Card>
      
      <ConnectServiceDialog 
        isOpen={isConnectDialogOpen} 
        onClose={() => setIsConnectDialogOpen(false)} 
        onConnect={handleAddNewService} 
      />
    </>
  );
};
