import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageSquare, Mail, MessageCircle, Facebook, Instagram, Store, Youtube, Sparkles } from "lucide-react";
import { ServiceInfo } from "../types";
import { motion } from "framer-motion";

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ConnectedAppCard 
          title="Phone" 
          count={connectedNumbers.length} 
          icon={<Phone className="h-5 w-5 text-white" />} 
          gradient="from-blue-500 to-blue-700"
          delay={0.1}
        />
        
        <ConnectedAppCard 
          title="Email" 
          count={getServicesByType('email').length} 
          icon={<Mail className="h-5 w-5 text-white" />} 
          gradient="from-amber-500 to-amber-700"
          delay={0.2} 
        />
        
        <ConnectedAppCard 
          title="SMS" 
          count={getServicesByType('sms').length} 
          icon={<MessageSquare className="h-5 w-5 text-white" />} 
          gradient="from-indigo-500 to-indigo-700"
          delay={0.3}
        />
        
        <ConnectedAppCard 
          title="WhatsApp" 
          count={getServicesByType('whatsapp').length} 
          icon={<MessageCircle className="h-5 w-5 text-white" />} 
          gradient="from-green-500 to-green-700"
          delay={0.4}
        />
        
        <ConnectedAppCard 
          title="Facebook" 
          count={getServicesByType('facebook').length} 
          icon={<Facebook className="h-5 w-5 text-white" />} 
          gradient="from-blue-600 to-blue-800"
          delay={0.5}
        />
        
        <ConnectedAppCard 
          title="Instagram" 
          count={getServicesByType('instagram').length} 
          icon={<Instagram className="h-5 w-5 text-white" />} 
          gradient="from-pink-500 to-purple-600"
          delay={0.6}
        />
        
        <ConnectedAppCard 
          title="TikTok" 
          count={getServicesByType('tiktok').length} 
          icon={<Youtube className="h-5 w-5 text-white" />} 
          gradient="from-gray-700 to-gray-900"
          delay={0.7}
        />
        
        <ConnectedAppCard 
          title="Google Business" 
          count={getServicesByType('google_business').length} 
          icon={<Store className="h-5 w-5 text-white" />} 
          gradient="from-red-500 to-red-700"
          delay={0.8}
        />
      </div>
    </div>
  );
};

interface ConnectedAppCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

const ConnectedAppCard: React.FC<ConnectedAppCardProps> = ({
  title,
  count,
  icon,
  gradient,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${gradient} p-3 text-white relative overflow-hidden`}>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  {icon}
                </div>
                <span className="font-medium">{title}</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center font-semibold text-white bg-black/20 rounded-full text-lg">
                {count}
              </div>
            </div>
          </div>
          <div className="p-2 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Connected</span>
              <span className="font-medium">{count > 0 ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
