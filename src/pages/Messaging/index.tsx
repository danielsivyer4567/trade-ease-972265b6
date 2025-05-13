import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, RefreshCw, Mail, Share2, Loader2, Sparkles, Bell } from "lucide-react";
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
import { useEffect, useState } from "react";

export default function Messaging() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showIntro, setShowIntro] = useState(true);
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
      // Phase 1: Image appears (0.5s)
      setTimeout(() => setIntroPhase(1), 500);
      
      // Phase 2: Connections start to glow and pulse (1.5s)
      setTimeout(() => setIntroPhase(2), 2000);
      
      // Phase 3: Connections reach full glow (2.5s)
      setTimeout(() => setIntroPhase(3), 4500);
      
      // End intro and show the main interface
      setTimeout(() => setShowIntro(false), 6000);
    }
  }, []);
  
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

  if (!userConfig?.messaging_enabled) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
              <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl text-white">
                <MessageSquare className="h-5 w-5 text-white" />
                Messaging CRM
              </CardTitle>
              <CardDescription className="py-[8px] text-white/90">
                Messaging features are not enabled for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <Button 
                onClick={() => navigate("/settings")}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Enable Messaging Features
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // Render the intro animation
  const renderIntro = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-purple-900/90">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: introPhase >= 0 ? 1 : 0, 
            scale: introPhase >= 1 ? 1 : 0.5 
          }}
          transition={{ duration: 1 }}
        >
          {/* Center hub logo/icon */}
          <motion.div 
            className={`w-32 h-32 rounded-full flex items-center justify-center z-20 relative
                      ${introPhase >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-800'}
                      ${introPhase === 3 ? 'animate-pulse' : ''}`}
            animate={{
              boxShadow: introPhase >= 2 
                ? ['0 0 0 rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.8)', '0 0 10px rgba(59, 130, 246, 0.4)']
                : '0 0 0 rgba(59, 130, 246, 0)'
            }}
            transition={{ duration: 1.5, repeat: introPhase === 3 ? Infinity : 0, repeatType: "reverse" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-500/20"
              animate={{ 
                scale: introPhase >= 2 ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 2, repeat: introPhase === 3 ? Infinity : 0 }}
            />
            
            <img 
              src="/TradeEase.png" 
              alt="Trade Ease" 
              className="w-20 h-20 object-contain z-30" 
            />
          </motion.div>
          
          {/* Connection lines and platform nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { name: 'facebook', icon: '/facebook-icon.png', x: -160, y: -120, delay: 0 },
              { name: 'twitter', icon: '/twitter-icon.png', x: 0, y: -170, delay: 0.1 },
              { name: 'instagram', icon: '/instagram-icon.png', x: 160, y: -120, delay: 0.2 },
              { name: 'linkedin', icon: '/linkedin-icon.png', x: 200, y: 0, delay: 0.3 },
              { name: 'tiktok', icon: '/tiktok-icon.png', x: 160, y: 120, delay: 0.4 },
              { name: 'email', icon: '/email-icon.png', x: -160, y: 120, delay: 0.5 },
              { name: 'sms', icon: '/sms-icon.png', x: -200, y: 0, delay: 0.6 },
              { name: 'whatsapp', icon: '/whatsapp-icon.png', x: 0, y: 170, delay: 0.7 },
            ].map((platform, index) => (
              <React.Fragment key={platform.name}>
                {/* Connection Line */}
                <motion.div
                  className={`absolute left-1/2 top-1/2 h-0.5 origin-left
                            ${introPhase >= 2 ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400' : 'bg-gray-600'}`}
                  style={{ 
                    width: Math.sqrt(platform.x * platform.x + platform.y * platform.y),
                    transform: `translate(-50%, -50%) rotate(${Math.atan2(platform.y, platform.x)}rad)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: introPhase >= 1 ? 1 : 0,
                    scale: introPhase >= 1 ? 1 : 0
                  }}
                  transition={{ delay: 0.5 + platform.delay, duration: 0.5 }}
                >
                  {/* Animated pulse along connection */}
                  {introPhase >= 2 && (
                    <motion.div 
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-8 rounded-full bg-blue-400/80 blur-md"
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        delay: platform.delay, 
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Platform icon node */}
                <motion.div
                  className="absolute left-1/2 top-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
                  style={{ 
                    transform: `translate(calc(-50% + ${platform.x}px), calc(-50% + ${platform.y}px))`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: introPhase >= 1 ? 1 : 0,
                    scale: introPhase >= 1 ? 1 : 0,
                    boxShadow: introPhase >= 2 
                      ? ['0 0 0 rgba(59, 130, 246, 0)', '0 0 15px rgba(59, 130, 246, 0.7)', '0 0 5px rgba(59, 130, 246, 0.3)'] 
                      : '0 0 0 rgba(59, 130, 246, 0)'
                  }}
                  transition={{ 
                    delay: 0.8 + platform.delay, 
                    duration: 0.5,
                    boxShadow: {
                      duration: 2,
                      repeat: introPhase === 3 ? Infinity : 0,
                      repeatType: "reverse"
                    }
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {/* The fallback to using Lucide icons since we don't know if the specific platform icons exist */}
                    {platform.name === 'facebook' && <Facebook className="w-7 h-7 text-blue-600" />}
                    {platform.name === 'twitter' && <svg className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>}
                    {platform.name === 'instagram' && <Instagram className="w-7 h-7 text-pink-500" />}
                    {platform.name === 'linkedin' && <Linkedin className="w-7 h-7 text-blue-600" />}
                    {platform.name === 'tiktok' && <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>}
                    {platform.name === 'email' && <Mail className="w-7 h-7 text-red-500" />}
                    {platform.name === 'sms' && <MessageSquare className="w-7 h-7 text-green-500" />}
                    {platform.name === 'whatsapp' && <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
          
          {/* Text above the hub */}
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: introPhase >= 1 ? 1 : 0,
              y: introPhase >= 1 ? 0 : 20
            }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Multi-Channel Messaging
            </h1>
            <p className="text-blue-200 mt-1">Connecting all your communication channels</p>
          </motion.div>
        </motion.div>
      </div>
    );
  };
  
  return (
    <AppLayout>
      <AnimatePresence>
        {showIntro && renderIntro()}
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
            transition={{ duration: 0.5, delay: showIntro ? 6 : 0 }}
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
                transition={{ duration: 0.5, delay: showIntro ? 6.2 : 0.2 }}
              >
                <ConnectedAppsOverview connectedNumbers={connectedNumbers} services={services} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: showIntro ? 6.3 : 0.3 }}
              >
                <CrmPipeline />
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
              <Card className="overflow-hidden shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="h-5 w-5" />
                    Email Management
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Manage your email communications and templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-b from-slate-100 to-white">
                  <Button 
                    onClick={() => navigate("/email")}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Go to Email Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <Card className="overflow-hidden shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Share2 className="h-5 w-5" />
                    Social Media
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Manage your social media accounts and posts
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-gradient-to-b from-slate-100 to-white">
                  <Button 
                    onClick={() => navigate("/social")}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Go to Social Media Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AppLayout>
  );
}
