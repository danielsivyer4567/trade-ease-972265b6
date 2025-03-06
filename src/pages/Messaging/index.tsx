
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MessageSquare, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Messaging() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNumbers, setConnectedNumbers] = useState<string[]>([]);
  const navigate = useNavigate();

  // Simulate fetching connected numbers
  useEffect(() => {
    // In a real implementation, you would fetch this from your database
    const savedNumbers = localStorage.getItem('connectedPhoneNumbers');
    if (savedNumbers) {
      setConnectedNumbers(JSON.parse(savedNumbers));
    }
  }, []);

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
      console.log('Connecting phone number:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('validate-ghl-number', {
        body: { phoneNumber: phoneNumber.replace(/\D/g, '') }
      });

      console.log('Response from edge function:', data, error);

      if (error) throw error;

      if (data.success) {
        toast.success("Phone number connected successfully");
        
        // Save to local storage (in a real app, you'd save to a database)
        const newConnectedNumbers = [...connectedNumbers, phoneNumber];
        setConnectedNumbers(newConnectedNumbers);
        localStorage.setItem('connectedPhoneNumbers', JSON.stringify(newConnectedNumbers));
        
        // Reset the input
        setPhoneNumber('');
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

  const handleRemoveNumber = (index: number) => {
    const updatedNumbers = [...connectedNumbers];
    updatedNumbers.splice(index, 1);
    setConnectedNumbers(updatedNumbers);
    localStorage.setItem('connectedPhoneNumbers', JSON.stringify(updatedNumbers));
    toast.success("Phone number removed");
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(-1)} 
                  className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
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
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={!phoneNumber || isConnecting || phoneNumber.replace(/\D/g, '').length !== 10}
                    className="flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4 mt-6">
                <h3 className="font-medium mb-2">Connected Phone Numbers</h3>
                {connectedNumbers.length > 0 ? (
                  <ul className="space-y-2">
                    {connectedNumbers.map((number, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{number}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveNumber(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No phone numbers connected yet. Connect a number to start syncing messages.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
