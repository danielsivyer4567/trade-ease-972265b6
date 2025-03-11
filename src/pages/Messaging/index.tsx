import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, RefreshCw } from "lucide-react";
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
export default function Messaging() {
  const navigate = useNavigate();
  const {
    userConfig
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
    services
  } = useServicesFetch();
  return <AppLayout>
      <div className="w-full h-full px-3 md:px-4">
        <div className="space-y-4">
          <Card>
            <CardHeader className="bg-slate-200 pb-2">
              <CardTitle className="flex items-center gap-2 text-3xl">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Messaging CRM
              </CardTitle>
              <CardDescription className="py-[8px]">
                Manage customer communications and track sales pipeline in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="crm" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="crm" className="mx-[18px] bg-slate-500 hover:bg-slate-400">Pipelines</TabsTrigger>
              <TabsTrigger value="connections" className="bg-slate-400 hover:bg-slate-300 px-0 mx-[35px]">Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="crm" className="space-y-4">
              <ConnectedAppsOverview connectedNumbers={connectedNumbers} services={services} />
              <CrmPipeline />
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="bg-slate-200 pb-2">
                    <CardTitle className="text-lg">Phone Numbers</CardTitle>
                    <CardDescription>Manage your connected phone numbers</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 bg-slate-200">
                    <PhoneNumberInput phoneNumber={phoneNumber} isConnecting={isConnectingPhone} onChange={handlePhoneNumberChange} onConnect={handleConnect} />
                    <div className="mt-4">
                      <ConnectedPhonesList connectedNumbers={connectedNumbers} onRemoveNumber={handleRemoveNumber} onAddTwilioAccount={() => setTwilioDialogOpen(true)} />
                    </div>
                  </CardContent>
                </Card>
                
                <ServiceSyncCard />
              </div>
              
              <TwilioConfigDialog open={twilioDialogOpen} onOpenChange={setTwilioDialogOpen} config={twilioConfig} setConfig={setTwilioConfig} onConnect={handleTwilioConnect} isConnecting={isConnectingTwilio} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>;
}