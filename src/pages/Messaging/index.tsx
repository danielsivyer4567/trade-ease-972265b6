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
import { SectionHeader } from "@/components/ui/SectionHeader";
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
  return <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-200 pb-2">
              <CardTitle className="flex items-center gap-2 text-5xl">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Multiple Messaging
              </CardTitle>
              <CardDescription className="py-[8px]">Connect and manage your messaging platforms into one place!
            </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-slate-200 mx-[9px] py-[159px]">
              <div className="space-y-6">
                <PhoneNumberInput phoneNumber={phoneNumber} isConnecting={isConnectingPhone} onChange={handlePhoneNumberChange} onConnect={handleConnect} />

                <ConnectedPhonesList connectedNumbers={connectedNumbers} onRemoveNumber={handleRemoveNumber} onAddTwilioAccount={() => setTwilioDialogOpen(true)} />

                <TwilioConnectButton />
              </div>
            </CardContent>
          </Card>
          
          <ServiceSyncCard />
        </div>
      </div>

      
    </AppLayout>;
}