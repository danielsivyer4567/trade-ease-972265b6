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
import { motion } from "framer-motion";

export default function Messaging() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
  
  return (
    <AppLayout>
      <div className="w-full h-full px-3 md:px-4">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
                <ConnectedAppsOverview connectedNumbers={connectedNumbers} services={services} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
      </div>
    </AppLayout>
  );
}
