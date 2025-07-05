import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, RefreshCw, Mail, Share2, Loader2, Sparkles, Bell, Facebook, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
import { PhoneNumberInput } from "@/components/messaging/PhoneNumberInput";
import { ConnectedPhonesList } from "@/components/messaging/ConnectedPhonesList";
import { TwilioConnectButton } from "@/components/messaging/TwilioConnectButton";
import { TwilioConfigDialog } from "@/components/messaging/TwilioConfigDialog";
import { usePhoneNumbers } from "@/components/messaging/hooks/usePhoneNumbers";
import { useTwilioConnection } from "@/components/messaging/hooks/useTwilioConnection";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedAppsOverview } from "@/components/messaging/crm/ConnectedAppsOverview";
import { CrmPipeline } from "@/components/messaging/crm/CrmPipeline";
import { useServicesFetch } from "@/components/messaging/hooks/useServicesFetch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { MessagingIntro } from "./intro-animation";
import { ChannelIcon, ChannelIconWithBg } from "@/components/messaging/ChannelIcons";

export default function Messaging() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showIntro, setShowIntro] = useState(false);
  const [introPhase, setIntroPhase] = useState(0);
  
  const {
    userConfig,
    isLoading: isUserConfigLoading
  } = useUserConfig();
  
  const {
    phoneNumber,
    isConnecting: isConnectingPhone,
    connectedNumbers,
    handlePhoneNumberChange,
    handleConnect,
    handleRemoveNumber
  } = usePhoneNumbers();
  
  const updateConnectedNumbers = (newNumber: string) => {
    connectedNumbers.push(newNumber);
  };
  
  const {
    twilioDialogOpen,
    setTwilioDialogOpen,
    twilioConfig,
    setTwilioConfig,
    isConnecting: isConnectingTwilio,
    handleTwilioConnect
  } = useTwilioConnection(updateConnectedNumbers);
  
  const {
    services,
    isLoading: isServicesLoading
  } = useServicesFetch();

  const isLoading = isUserConfigLoading || isServicesLoading;
  
  useEffect(() => {
    // Control the animation phases
    if (showIntro) {
      // Phase 1: Image appears (0.7s)
      setTimeout(() => setIntroPhase(1), 700);
      
      // Phase 2: Connections start to glow and pulse (2s)
      setTimeout(() => setIntroPhase(2), 2200);
      
      // Phase 3: Data visibly flows through connections (3.5s)
      setTimeout(() => setIntroPhase(3), 3500);
      
      // We don't auto-hide the intro - the animation component will call
      // the onComplete handler when it's done showing all the phases
    }
  }, []);
  
  const handleIntroAnimationComplete = () => {
    // Hide the intro animation
    setShowIntro(false);
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="w-full h-full px-3 md:px-4">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
                <Skeleton className="h-8 w-48 bg-white/30" />
                <Skeleton className="h-4 w-72 mt-2 bg-white/30" />
              </CardHeader>
            </Card>
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Removed messaging enabled check - all users now have access to messaging features
  
  return (
    <AppLayout>
      <AnimatePresence>
        {showIntro && (
          <MessagingIntro 
            introPhase={introPhase} 
            onAnimationComplete={handleIntroAnimationComplete} 
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        className="w-full h-full px-3 md:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 pb-4 relative">
                <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-10"></div>
                <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl text-white z-10 relative">
                  <MessageSquare className="h-6 w-6 text-white" />
                  Messaging CRM
                  <Sparkles className="h-5 w-5 text-yellow-300 ml-2" />
                </CardTitle>
                <CardDescription className="py-[8px] text-white/90 z-10 relative text-base">
                  Manage customer communications and track sales pipeline in one elegant workspace
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <Tabs defaultValue="crm" className="w-full">
            <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'w-[600px] grid-cols-4'} mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-1 rounded-xl shadow-md`}>
              <TabsTrigger value="crm" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                Pipelines
              </TabsTrigger>
              <TabsTrigger value="connections" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                Connections
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                Email
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-lg">
                Social
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="crm" className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CrmPipeline />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ConnectedAppsOverview connectedNumbers={connectedNumbers} services={services} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 pb-2">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Phone Numbers
                    </CardTitle>
                    <CardDescription className="text-white/90">Manage your connected phone numbers</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 bg-gradient-to-b from-slate-100 to-white">
                    <PhoneNumberInput 
                      phoneNumber={phoneNumber} 
                      isConnecting={isConnectingPhone} 
                      onChange={handlePhoneNumberChange} 
                      onConnect={handleConnect} 
                    />
                    <div className="mt-4">
                      <ConnectedPhonesList 
                        connectedNumbers={connectedNumbers} 
                        onRemoveNumber={handleRemoveNumber} 
                        onAddTwilioAccount={() => setTwilioDialogOpen(true)} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <ServiceSyncCard />
              </div>
              
              <TwilioConfigDialog 
                open={twilioDialogOpen} 
                onOpenChange={setTwilioDialogOpen} 
                config={twilioConfig} 
                setConfig={setTwilioConfig} 
                onConnect={handleTwilioConnect} 
                isConnecting={isConnectingTwilio} 
              />
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="overflow-hidden shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600">
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                          <ChannelIcon name="email" size="md" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Email Campaigns</CardTitle>
                          <CardDescription className="text-white/90">
                            Create and manage email marketing campaigns
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gradient-to-b from-slate-100 to-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-500 text-sm">Active Campaigns</p>
                          <p className="text-2xl font-semibold text-blue-600">3</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Total Subscribers</p>
                          <p className="text-2xl font-semibold text-blue-600">2,548</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate("/email")}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Manage Campaigns
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="overflow-hidden shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                      <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                          <ChannelIcon name="email" size="md" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Email Templates</CardTitle>
                          <CardDescription className="text-white/90">
                            Design and save reusable email templates
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gradient-to-b from-slate-100 to-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-500 text-sm">Saved Templates</p>
                          <p className="text-2xl font-semibold text-blue-600">12</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Recent Edits</p>
                          <p className="text-2xl font-semibold text-blue-600">5</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate("/email")}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Manage Templates
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SocialPlatformCard 
                  platform="facebook" 
                  title="Facebook" 
                  stats={{ followers: 12548, messages: 56 }}
                  gradient="from-blue-500 to-blue-700"
                />
                
                <SocialPlatformCard 
                  platform="instagram" 
                  title="Instagram" 
                  stats={{ followers: 18432, messages: 127 }}
                  gradient="from-pink-500 to-purple-600"
                />
                
                <SocialPlatformCard 
                  platform="linkedin" 
                  title="LinkedIn" 
                  stats={{ followers: 5283, messages: 21 }}
                  gradient="from-blue-600 to-blue-800"
                />
                
                <SocialPlatformCard 
                  platform="tiktok" 
                  title="TikTok" 
                  stats={{ followers: 8763, messages: 34 }}
                  gradient="from-gray-700 to-gray-900"
                />
                
                <SocialPlatformCard 
                  platform="twitter" 
                  title="Twitter" 
                  stats={{ followers: 9621, messages: 43 }}
                  gradient="from-blue-400 to-blue-600"
                />
                
                <SocialPlatformCard 
                  platform="youtube" 
                  title="YouTube" 
                  stats={{ followers: 6238, messages: 85 }}
                  gradient="from-red-500 to-red-700"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AppLayout>
  );
}

interface SocialPlatformCardProps {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'twitter' | 'youtube';
  title: string;
  stats: {
    followers: number;
    messages: number;
  };
  gradient: string;
}

const SocialPlatformCard: React.FC<SocialPlatformCardProps> = ({
  platform,
  title,
  stats,
  gradient
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0">
        <CardHeader className={`bg-gradient-to-r ${gradient} p-4 pb-6`}>
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <ChannelIcon name={platform} size="md" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 bg-gradient-to-b from-slate-100 to-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Followers</p>
              <p className="text-xl font-semibold text-blue-600">{stats.followers.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Messages</p>
              <p className="text-xl font-semibold text-indigo-600">{stats.messages}</p>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Manage Account
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
