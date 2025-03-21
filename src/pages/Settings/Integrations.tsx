import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MessageSquare, CreditCard, Mail, Calendar, Key, FileText, Phone, Facebook } from "lucide-react";
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
    title: "WhatsApp Business",
    icon: Phone,
    description: "Connect with customers via WhatsApp Business API",
    path: "/settings/integrations/whatsapp",
    apiKeyRequired: true
  },
  {
    title: "Facebook",
    icon: Facebook,
    description: "Connect with Facebook for messaging and social media",
    path: "/settings/integrations/facebook",
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
  },
  {
    title: "Xero",
    icon: FileText,
    description: "Sync invoices, payments and accounting data with Xero",
    path: "/settings/integrations/xero",
    apiKeyRequired: true,
    devMode: true
  }
];

const fetchConfigs = async () => {
  try {
    return [{
      integration_name: "Go High Level",
      status: "connected"
    }, {
      integration_name: "Stripe",
      status: "not_connected"
    }, {
      integration_name: "Xero",
      status: "not_connected"
    }, {
      integration_name: "WhatsApp Business",
      status: "not_connected"
    }, {
      integration_name: "Facebook",
      status: "not_connected"
    }];
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
      const integrationData = await fetchConfigs();
      const statuses = Object.fromEntries(
        integrationData.map(item => [item.integration_name, item.status])
      );
      setIntegrationStatuses(statuses);
    } catch (error) {
      console.error('Error loading integration statuses:', error);
      toast.error('Failed to load integration statuses');
    }
  };

  const handleApiKeySubmit = async (integration: string) => {
    setLoading(prev => ({ ...prev, [integration]: true }));
    try {
      const response = await supabase.functions.invoke('validate-integration', {
        body: {
          integration,
          apiKey: apiKeys[integration]
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to configure integration');
      }

      toast.success(`${integration} configured successfully`);
      await loadIntegrationStatuses();
      setApiKeys(prev => ({ ...prev, [integration]: '' }));
    } catch (error) {
      console.error('Error submitting API key:', error);
      toast.error(error.message || 'Failed to configure integration');
    } finally {
      setLoading(prev => ({ ...prev, [integration]: false }));
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6 md:h-8 md:w-8 text-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold">API Integrations</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.title} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <integration.icon className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg md:text-xl">{integration.title}</CardTitle>
                  </div>
                  {integration.devMode && (
                    <span className="bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">Dev</span>
                  )}
                  <span className={`text-xs md:text-sm px-2 py-1 rounded-full ${
                    integrationStatuses[integration.title] === "connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {integrationStatuses[integration.title]?.charAt(0).toUpperCase() + 
                     integrationStatuses[integration.title]?.slice(1) || 'Not Connected'}
                  </span>
                </div>
                <CardDescription className="text-xs md:text-sm mt-1">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 flex-grow flex flex-col justify-end">
                {integration.apiKeyRequired && (
                  <div className="space-y-2">
                    <Label htmlFor={`${integration.title}-api-key`} className="text-sm">API Key</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id={`${integration.title}-api-key`}
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys[integration.title] || ''}
                        onChange={(e) => setApiKeys(prev => ({
                          ...prev,
                          [integration.title]: e.target.value
                        }))}
                        className="text-sm h-9"
                      />
                      <Button 
                        onClick={() => handleApiKeySubmit(integration.title)}
                        disabled={loading[integration.title] || !apiKeys[integration.title]}
                        className={`h-9 text-xs whitespace-nowrap ${integration.devMode ? 'bg-violet-500 hover:bg-violet-600' : ''}`}
                        size="sm"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        {loading[integration.title] ? 'Saving...' : 'Save Key'}
                      </Button>
                    </div>
                  </div>
                )}
                <Link to={integration.path} className="w-full mt-auto">
                  <Button 
                    className={`w-full h-9 text-sm ${integration.devMode ? 'bg-violet-500 hover:bg-violet-600' : ''}`}
                    variant={integrationStatuses[integration.title] === "connected" ? "default" : "outline"}
                    size="sm"
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
