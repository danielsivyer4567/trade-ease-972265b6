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
  return <>
      
      
      <ConnectServiceDialog isOpen={isConnectDialogOpen} onClose={() => setIsConnectDialogOpen(false)} onConnect={handleAddNewService} />
    </>;
};