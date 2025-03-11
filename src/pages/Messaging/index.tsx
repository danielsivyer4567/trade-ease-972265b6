
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
            <CardHeader 
                className="rounded-t-lg py-8 text-center relative"
                style={{
                  background: "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "380px"
                }}>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-1">
                Multiple Messaging Platform
              </CardTitle>
              <CardDescription className="text-slate-800 text-lg font-medium mb-6">
                Connect and manage your messaging platforms in one place.
              </CardDescription>
              
              <div className="flex justify-center mt-8">
                <div className="flex flex-wrap gap-6 justify-center items-center max-w-xl">
                  {/* Social media icons are visible in the background image */}
                </div>
              </div>
              
              <p className="text-slate-800 text-lg font-medium mt-16 mb-2">
                Connect and manage your messaging platforms in one place!
              </p>
            </CardHeader>
            
            <CardContent className="bg-white py-8">
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

      <TwilioConfigDialog isOpen={twilioDialogOpen} onOpenChange={setTwilioDialogOpen} twilioConfig={twilioConfig} setTwilioConfig={setTwilioConfig} onConnect={handleTwilioConnect} isConnecting={isConnectingTwilio} />
    </AppLayout>;
}
