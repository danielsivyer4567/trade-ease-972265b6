import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { ServiceInfo } from "../types";
import { motion } from "framer-motion";
import { ChannelIconWithBg, BRAND_COLORS } from '../ChannelIcons';

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
  
  return (
    <div className="p-1">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
          Connected Channels
        </h2>
        <div className="ml-auto text-sm bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full text-blue-800 font-medium">
          {connectedNumbers.length + services.filter(s => s.isConnected).length} Total Connections
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        <ConnectedAppCard 
          title="Phone" 
          count={connectedNumbers.length} 
          icon="phone" 
          bgColor={BRAND_COLORS.phone}
          delay={0.1}
        />
        
        <ConnectedAppCard 
          title="Email" 
          count={getServicesByType('email').length} 
          icon="email" 
          bgColor={BRAND_COLORS.email}
          delay={0.2} 
        />
        
        <ConnectedAppCard 
          title="SMS" 
          count={getServicesByType('sms').length} 
          icon="sms" 
          bgColor={BRAND_COLORS.sms}
          delay={0.3}
        />
        
        <ConnectedAppCard 
          title="WhatsApp" 
          count={getServicesByType('whatsapp').length} 
          icon="whatsapp" 
          bgColor={BRAND_COLORS.whatsapp}
          delay={0.4}
        />
        
        <ConnectedAppCard 
          title="Facebook" 
          count={getServicesByType('facebook').length} 
          icon="facebook" 
          bgColor={BRAND_COLORS.facebook}
          delay={0.5}
        />
        
        <ConnectedAppCard 
          title="Instagram" 
          count={getServicesByType('instagram').length} 
          icon="instagram" 
          bgColor={BRAND_COLORS.instagram}
          delay={0.6}
        />
        
        <ConnectedAppCard 
          title="TikTok" 
          count={getServicesByType('tiktok').length} 
          icon="tiktok" 
          bgColor={BRAND_COLORS.tiktok}
          delay={0.7}
        />
        
        <ConnectedAppCard 
          title="Google" 
          count={getServicesByType('google_business').length} 
          icon="google" 
          bgColor={BRAND_COLORS.google}
          delay={0.8}
        />
      </div>
    </div>
  );
};

interface ConnectedAppCardProps {
  title: string;
  count: number;
  icon: string;
  bgColor: string;
  delay: number;
}

const ConnectedAppCard: React.FC<ConnectedAppCardProps> = ({
  title,
  count,
  icon,
  bgColor,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <ChannelIconWithBg 
          name={icon as any} 
          size="lg" 
          bgColor={bgColor} 
          className="mb-2 drop-shadow-md"
        />
        {count > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-white text-blue-600 rounded-full border-2 border-blue-500 shadow-md">
            {count}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-gray-700">{title}</span>
      <span className="text-xs text-gray-500">{count > 0 ? "Active" : "Inactive"}</span>
    </motion.div>
  );
};
