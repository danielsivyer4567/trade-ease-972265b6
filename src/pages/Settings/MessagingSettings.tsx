import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function MessagingSettings() {
  const navigate = useNavigate();
  const { userConfig, setUserConfig } = useUserConfig();

  const handleMessagingToggle = async (enabled: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to update settings');
        return;
      }

      const userId = session.user.id;
      
      const { error } = await supabase
        .from('users_configuration')
        .update({ messaging_enabled: enabled })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      setUserConfig(prev => ({
        ...prev,
        messaging_enabled: enabled
      }));
      
      toast.success(enabled ? 'Messaging features enabled' : 'Messaging features disabled');
    } catch (error) {
      console.error('Error updating messaging settings:', error);
      toast.error('Failed to update messaging settings');
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-6 h-full p-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <MessageSquare className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Messaging Settings</h1>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messaging Features</CardTitle>
              <CardDescription>
                Enable or disable messaging features for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Messaging</Label>
                  <p className="text-sm text-gray-500">
                    Allow access to messaging features including SMS, WhatsApp, and email
                  </p>
                </div>
                <Switch
                  checked={userConfig?.messaging_enabled}
                  onCheckedChange={handleMessagingToggle}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage your connected messaging services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/messaging')}
                className="w-full md:w-auto"
              >
                Manage Connected Services
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 