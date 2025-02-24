import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MessageSquare, CreditCard, Mail, Calendar, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationConfig {
  integration_name: string;
  status: string;
}

const availableIntegrations = [
  {
    title: "Go High Level",
    icon: MessageSquare,
    description: "Sync messages and communication with Go High Level",
    path: "/messaging",
    apiKeyRequired: true
  },
  {
    title: "Stripe",
    icon: CreditCard,
    description: "Process payments and manage subscriptions",
    path: "/settings/integrations/stripe"
  },
  {
    title: "SendGrid",
    icon: Mail,
    description: "Send automated emails and notifications",
    path: "/settings/integrations/sendgrid"
  },
  {
    title: "Google Calendar",
    icon: Calendar,
    description: "Sync appointments and schedules",
    path: "/settings/integrations/google-calendar"
  }
];

const fetchConfigs = async () => {
  try {
    const { data: configs, error } = await supabase
      .from('integration_configs')
      .select('*');

    if (error) throw error;
    return configs || [];
  } catch (error) {
    console.error('Error fetching integration configs:', error);
    return [];
  }
};

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [integrationStatuses, setIntegrationStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    loadIntegrationStatuses();
  }, []);

  const loadIntegrationStatuses = async () => {
    try {
      const { data: integrationData, error } = await supabase
        .from('integration_configs')
        .select('integration_name, status') as { data: IntegrationConfig[] | null, error: any };

      if (error) throw error;

      if (integrationData) {
        const statuses = Object.fromEntries(
          integrationData.map(item => [item.integration_name, item.status])
        );
        setIntegrationStatuses(statuses);
      }
    } catch (error) {
      console.error('Error loading integration statuses:', error);
      toast.error('Failed to load integration statuses');
    }
  };

  const handleApiKeySubmit = async (integration: string) => {
    setLoading(prev => ({ ...prev, [integration]: true }));
    try {
      const response = await fetch('/api/validate-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integration,
          apiKey: apiKeys[integration]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to configure integration');
      }

      toast.success(data.message);
      await loadIntegrationStatuses();
      setApiKeys(prev => ({ ...prev, [integration]: '' }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [integration]: false }));
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">API Integrations</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <integration.icon className="h-5 w-5 text-gray-600" />
                    <CardTitle>{integration.title}</CardTitle>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    integrationStatuses[integration.title] === "connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {integrationStatuses[integration.title]?.charAt(0).toUpperCase() + 
                     integrationStatuses[integration.title]?.slice(1) || 'Not Connected'}
                  </span>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.apiKeyRequired && (
                  <div className="space-y-2">
                    <Label htmlFor={`${integration.title}-api-key`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`${integration.title}-api-key`}
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys[integration.title] || ''}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          [integration.title]: e.target.value
                        }))}
                      />
                      <Button 
                        onClick={() => handleApiKeySubmit(integration.title)}
                        disabled={loading[integration.title] || !apiKeys[integration.title]}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {loading[integration.title] ? 'Saving...' : 'Save Key'}
                      </Button>
                    </div>
                  </div>
                )}
                <Link to={integration.path}>
                  <Button 
                    className="w-full" 
                    variant={integrationStatuses[integration.title] === "connected" ? "default" : "outline"}
                  >
                    {integrationStatuses[integration.title] === "connected" ? "Manage Integration" : "Connect"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
