
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Loader2, Check, Inbox, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ServiceInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
}

export const ServiceSyncCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<ServiceInfo[]>([
    {
      id: "sms",
      name: "SMS Messages",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      isConnected: true,
      syncEnabled: true,
      lastSynced: "10 minutes ago"
    },
    {
      id: "voicemail",
      name: "Voicemail",
      icon: <Phone className="h-5 w-5 text-green-500" />,
      isConnected: true,
      syncEnabled: false
    },
    {
      id: "email",
      name: "Email Inquiries",
      icon: <Inbox className="h-5 w-5 text-purple-500" />,
      isConnected: false,
      syncEnabled: false
    }
  ]);
  
  const handleToggleSync = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, syncEnabled: !service.syncEnabled }
        : service
    ));
    
    const service = services.find(s => s.id === serviceId);
    if (service) {
      toast.success(`${service.syncEnabled ? "Disabled" : "Enabled"} sync for ${service.name}`);
    }
  };
  
  const handleConnectService = (serviceId: string) => {
    setIsLoading(true);
    
    // Simulate API call to connect service
    setTimeout(() => {
      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, isConnected: true, lastSynced: "Just now" }
          : service
      ));
      
      const service = services.find(s => s.id === serviceId);
      if (service) {
        toast.success(`${service.name} connected successfully`);
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSyncAll = () => {
    setIsLoading(true);
    
    // Simulate API call to sync all services
    setTimeout(() => {
      setServices(services.map(service => 
        service.isConnected && service.syncEnabled
          ? { ...service, lastSynced: "Just now" }
          : service
      ));
      
      toast.success("All services synchronized successfully");
      setIsLoading(false);
    }, 2000);
  };
  
  return (
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
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Enable automatic sync for connected services</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncAll}
            disabled={isLoading || !services.some(s => s.isConnected && s.syncEnabled)}
            className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync All Now
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-3 mt-2">
          {services.map(service => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-300">
              <div className="flex items-center gap-3">
                {service.icon}
                <div>
                  <p className="font-medium">{service.name}</p>
                  {service.isConnected && (
                    <p className="text-xs text-gray-500">
                      {service.lastSynced ? `Last synced: ${service.lastSynced}` : 'Not synced yet'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {service.isConnected ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={service.syncEnabled}
                      onCheckedChange={() => handleToggleSync(service.id)}
                      disabled={isLoading}
                    />
                    <Label className="text-xs">Auto Sync</Label>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConnectService(service.id)}
                    disabled={isLoading}
                    className="bg-slate-400 hover:bg-slate-500"
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
