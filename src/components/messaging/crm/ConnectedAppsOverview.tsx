
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageSquare, Mail, MessageCircle, Facebook, Instagram, Store, Youtube } from "lucide-react";
import { ServiceInfo } from "../types";

interface ConnectedAppsOverviewProps {
  connectedNumbers: string[];
  services: ServiceInfo[];
}

export const ConnectedAppsOverview: React.FC<ConnectedAppsOverviewProps> = ({
  connectedNumbers,
  services
}) => {
  const getServicesByType = (type: string) => {
    return services.filter(s => s.serviceType === type && s.isConnected);
  };
  
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-orange-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <ConnectedAppCard title="Phone" count={connectedNumbers.length} icon={<Phone className="h-5 w-5 text-blue-600" />} color="bg-blue-100" />
      
      <ConnectedAppCard title="Email" count={getServicesByType('email').length} icon={<Mail className="h-5 w-5 text-orange-600" />} color="bg-orange-100" />
      
      <ConnectedAppCard title="SMS" count={getServicesByType('sms').length} icon={<MessageSquare className="h-5 w-5 text-indigo-600" />} color="bg-indigo-100" />
      
      <ConnectedAppCard title="WhatsApp" count={getServicesByType('whatsapp').length} icon={<MessageCircle className="h-5 w-5 text-green-600" />} color="bg-green-100" />
      
      <ConnectedAppCard title="Facebook" count={getServicesByType('facebook').length} icon={<Facebook className="h-5 w-5 text-blue-800" />} color="bg-blue-100" />
      
      <ConnectedAppCard title="Instagram" count={getServicesByType('instagram').length} icon={<Instagram className="h-5 w-5 text-pink-600" />} color="bg-pink-100" />
      
      <ConnectedAppCard title="TikTok" count={getServicesByType('tiktok').length} icon={<Youtube className="h-5 w-5 text-black" />} color="bg-gray-100" />
      
      <ConnectedAppCard title="Google Business" count={getServicesByType('google_business').length} icon={<Store className="h-5 w-5 text-red-600" />} color="bg-red-100" />
    </div>;
};

interface ConnectedAppCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const ConnectedAppCard: React.FC<ConnectedAppCardProps> = ({
  title,
  count,
  icon,
  color
}) => {
  return <Card className="overflow-hidden">
      <CardContent className="px-[22px] rounded-sm bg-slate-300 my-0 py-0">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center font-semibold text-gray-800 my-0 py-0 rounded-none bg-slate-300">
          {count}
        </div>
      </CardContent>
    </Card>;
};
