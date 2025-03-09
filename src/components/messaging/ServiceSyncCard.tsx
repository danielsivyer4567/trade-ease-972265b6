
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Loader2, Check, Inbox, RefreshCw, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
  connectionDetails?: {
    apiKey?: string;
    accountId?: string;
    url?: string;
  };
}

interface ConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (serviceType: string, connectionDetails: any) => void;
}

const ConnectServiceDialog = ({ isOpen, onClose, onConnect }: ConnectDialogProps) => {
  const [serviceType, setServiceType] = useState('sms');
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Validate fields
    if (!apiKey || (serviceType !== 'email' && !accountId)) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      onConnect(serviceType, {
        apiKey,
        accountId,
        url: serviceUrl || undefined
      });
      
      // Reset form
      setApiKey('');
      setAccountId('');
      setServiceUrl('');
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Messaging Service</DialogTitle>
          <DialogDescription>
            Add your API keys and account details to connect an external messaging platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS Provider</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
                <SelectItem value="email">Email Service</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                <SelectItem value="messenger">Facebook Messenger</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key / Token</Label>
            <Input 
              id="api-key" 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          
          {serviceType !== 'email' && (
            <div className="space-y-2">
              <Label htmlFor="account-id">Account ID / Phone Number</Label>
              <Input 
                id="account-id" 
                value={accountId} 
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter account identifier"
              />
            </div>
          )}
          
          {serviceType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="service-url">Service URL (Optional)</Label>
              <Input 
                id="service-url" 
                value={serviceUrl} 
                onChange={(e) => setServiceUrl(e.target.value)}
                placeholder="https://api.yourservice.com"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Connecting...
              </>
            ) : (
              'Connect Service'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ServiceSyncCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
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
  
  const handleAddNewService = (serviceType: string, connectionDetails: any) => {
    let newService: ServiceInfo;
    
    switch (serviceType) {
      case 'whatsapp':
        newService = {
          id: `whatsapp-${Date.now()}`,
          name: "WhatsApp Business",
          icon: <MessageSquare className="h-5 w-5 text-green-500" />,
          isConnected: true,
          syncEnabled: true,
          lastSynced: "Just now",
          connectionDetails
        };
        break;
      case 'messenger':
        newService = {
          id: `messenger-${Date.now()}`,
          name: "Facebook Messenger",
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          isConnected: true,
          syncEnabled: true,
          lastSynced: "Just now",
          connectionDetails
        };
        break;
      case 'custom':
        newService = {
          id: `custom-${Date.now()}`,
          name: "Custom API Integration",
          icon: <MessageSquare className="h-5 w-5 text-amber-500" />,
          isConnected: true,
          syncEnabled: true,
          lastSynced: "Just now",
          connectionDetails
        };
        break;
      default:
        newService = {
          id: `${serviceType}-${Date.now()}`,
          name: serviceType === 'sms' 
            ? "SMS Provider" 
            : serviceType === 'email' 
              ? "Email Service" 
              : "Voicemail Service",
          icon: serviceType === 'sms' 
            ? <MessageSquare className="h-5 w-5 text-blue-500" />
            : serviceType === 'email'
              ? <Inbox className="h-5 w-5 text-purple-500" />
              : <Phone className="h-5 w-5 text-green-500" />,
          isConnected: true,
          syncEnabled: true,
          lastSynced: "Just now",
          connectionDetails
        };
    }
    
    setServices([...services, newService]);
    toast.success(`New ${newService.name} connection added`);
  };
  
  const handleRemoveService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    // Don't allow removing the original three services
    if (["sms", "voicemail", "email"].includes(serviceId)) {
      toast.error("Default services cannot be removed");
      return;
    }
    
    setServices(services.filter(s => s.id !== serviceId));
    toast.success(`${service.name} connection removed`);
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
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Enable automatic sync for connected services</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsConnectDialogOpen(true)}
                className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Service
              </Button>
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
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.syncEnabled}
                          onCheckedChange={() => handleToggleSync(service.id)}
                          disabled={isLoading}
                        />
                        <Label className="text-xs">Auto Sync</Label>
                      </div>
                      {!["sms", "voicemail", "email"].includes(service.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </>
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
      
      <ConnectServiceDialog 
        isOpen={isConnectDialogOpen} 
        onClose={() => setIsConnectDialogOpen(false)} 
        onConnect={handleAddNewService}
      />
    </>
  );
};
