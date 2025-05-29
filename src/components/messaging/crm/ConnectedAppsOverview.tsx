import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Phone, X } from "lucide-react";
import { ServiceInfo } from "../types";
import { ChannelIconWithBg } from "../ChannelIcons";

interface ConnectedAppsOverviewProps {
  connectedNumbers: string[];
  services: ServiceInfo[];
}

export const ConnectedAppsOverview: React.FC<ConnectedAppsOverviewProps> = ({ 
  connectedNumbers,
  services
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Connected Phone Numbers</CardTitle>
          <CardDescription>Numbers available for SMS and calling</CardDescription>
        </CardHeader>
        <CardContent>
          {connectedNumbers.length > 0 ? (
            <div className="space-y-2">
              {connectedNumbers.map((number, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{number}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <Badge variant="outline" className="ml-auto border-green-200 text-green-700 bg-green-50">
                    <Check className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <X className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No phone numbers connected</p>
              <p className="text-xs text-gray-400 mt-1">Add a phone number in the Messaging settings</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Messaging Services</CardTitle>
          <CardDescription>Connected messaging platforms</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <ChannelIconWithBg 
                    name={getServiceIconName(service.serviceType)} 
                    size="sm" 
                  />
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      {service.syncEnabled ? 'Syncing enabled' : 'Syncing disabled'}
                    </p>
                  </div>
                  {service.syncEnabled ? (
                    <Badge variant="outline" className="ml-auto border-blue-200 text-blue-700 bg-blue-50">
                      <Clock className="h-3 w-3 mr-1" /> {service.lastSynced}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto border-amber-200 text-amber-700 bg-amber-50">
                      Disabled
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <X className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No messaging services connected</p>
              <p className="text-xs text-gray-400 mt-1">Add services in the Messaging settings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to map service type to icon name
const getServiceIconName = (serviceType: string): 'phone' | 'sms' | 'email' | 'whatsapp' | 'facebook' | 'instagram' | 'tiktok' | 'google' | 'linkedin' | 'twitter' | 'youtube' => {
  switch (serviceType) {
    case 'twilio': return 'phone';
    case 'sms': return 'sms';
    case 'email': return 'email';
    case 'whatsapp': return 'whatsapp';
    case 'facebook': return 'facebook';
    case 'instagram': return 'instagram';
    case 'tiktok': return 'tiktok';
    case 'google_business': return 'google';
    case 'linkedin': return 'linkedin';
    case 'twitter': return 'twitter';
    case 'youtube': return 'youtube';
    default: return 'email';
  }
};
