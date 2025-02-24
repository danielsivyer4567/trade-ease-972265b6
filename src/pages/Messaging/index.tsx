
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Messaging() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length > 0) {
      formattedValue = value.match(/.{1,3}/g)?.join('-') || value;
    }
    setPhoneNumber(formattedValue);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-ghl-number', {
        body: { phoneNumber: phoneNumber.replace(/\D/g, '') }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Phone number connected successfully");
        // Here you might want to save the connected number to your database
      } else {
        throw new Error(data.error || 'Failed to connect phone number');
      }
    } catch (error) {
      console.error('Error connecting phone number:', error);
      toast.error(error.message || "Failed to connect to messaging system");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Message Synchronization
            </CardTitle>
            <CardDescription>
              Connect your phone number to sync messages from Go High Level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-4">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number (XXX-XXX-XXXX)"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="flex-1"
                    maxLength={12}
                    pattern="\d{3}-\d{3}-\d{4}"
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={!phoneNumber || isConnecting || phoneNumber.replace(/\D/g, '').length !== 10}
                    className="flex items-center gap-2"
                  >
                    <PhoneCall className="h-4 w-4" />
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4 mt-6">
                <h3 className="font-medium mb-2">Connected Phone Numbers</h3>
                <p className="text-sm text-gray-500">
                  No phone numbers connected yet. Connect a number to start syncing messages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
