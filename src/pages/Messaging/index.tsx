
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Messaging() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // This is a placeholder for the actual Go High Level integration
      // You would need to implement the actual API integration here
      toast.info("This feature will be connected to Go High Level's API");
      console.log("Connecting phone number:", phoneNumber);
    } catch (error) {
      toast.error("Failed to connect to messaging system");
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
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={!phoneNumber || isConnecting}
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
