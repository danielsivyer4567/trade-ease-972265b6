
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, MessageCircle } from "lucide-react";
import { ServiceList } from './ServiceList';
import { ServiceListHeader } from './ServiceListHeader';
import { ConnectServiceDialog } from './ConnectServiceDialog';
import { useMessagingServices } from './hooks/useMessagingServices';
import { Button } from "@/components/ui/button";

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
  
  // Check if WhatsApp is connected
  const whatsappService = services.find(s => s.serviceType === 'whatsapp');
  const isWhatsAppConnected = whatsappService?.isConnected || false;
  
  const handleConnectWhatsApp = () => {
    setIsConnectDialogOpen(true);
  };
  
  return (
    <>
      <Card>
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
          
          {/* WhatsApp Quick Connect Section */}
          {!isWhatsAppConnected && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200 mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium">Connect WhatsApp Business</h4>
                  <p className="text-xs text-gray-500">Message customers directly via WhatsApp</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-100"
                onClick={handleConnectWhatsApp}
              >
                Connect
              </Button>
            </div>
          )}
          
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
