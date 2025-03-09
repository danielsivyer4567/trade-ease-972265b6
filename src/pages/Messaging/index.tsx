
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
import { PhoneNumberInput } from "@/components/messaging/PhoneNumberInput";
import { ConnectedPhonesList } from "@/components/messaging/ConnectedPhonesList";
import { TwilioConnectButton } from "@/components/messaging/TwilioConnectButton";
import { TwilioConfigDialog } from "@/components/messaging/TwilioConfigDialog";
import { usePhoneNumbers } from "@/components/messaging/hooks/usePhoneNumbers";
import { useTwilioConnection } from "@/components/messaging/hooks/useTwilioConnection";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";

export default function Messaging() {
  const navigate = useNavigate();
  const { userConfig } = useUserConfig();
  
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

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-200">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(-1)} 
                    className="rounded-md border border-gray-300 px-3 py-1 text-[#1E40AF] hover:text-[#1E3A8A] bg-slate-400 hover:bg-slate-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <MessageSquare className="h-6 w-6" />
                  Message Synchronization
                </div>
              </CardTitle>
              <CardDescription>
                Connect your phone number to sync messages from Go High Level
              </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-slate-200">
              <div className="space-y-6">
                <PhoneNumberInput 
                  phoneNumber={phoneNumber}
                  isConnecting={isConnectingPhone}
                  onChange={handlePhoneNumberChange}
                  onConnect={handleConnect}
                />

                <ConnectedPhonesList 
                  connectedNumbers={connectedNumbers}
                  onRemoveNumber={handleRemoveNumber}
                  onAddTwilioAccount={() => setTwilioDialogOpen(true)}
                />

                <TwilioConnectButton />
              </div>
            </CardContent>
          </Card>
          
          <ServiceSyncCard />
        </div>
      </div>

      <TwilioConfigDialog 
        isOpen={twilioDialogOpen}
        onOpenChange={setTwilioDialogOpen}
        twilioConfig={twilioConfig}
        setTwilioConfig={setTwilioConfig}
        onConnect={handleTwilioConnect}
        isConnecting={isConnectingTwilio}
      />
    </AppLayout>
  );
}
