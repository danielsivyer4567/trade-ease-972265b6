
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MessageSquare, CreditCard, Mail, Calendar, Key, FileText, Phone, Facebook, Building, Calculator, PenTool, Users, Database, Briefcase, HardHat, Construction, Hammer, Wrench, BookOpen, Server, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IntegrationConfig {
  integration_name: string;
  status: string;
}

interface Integration {
  title: string;
  icon: React.ElementType;
  description: string;
  path: string;
  category: string;
  apiKeyRequired?: boolean;
}

// Extended list of integrations including accounting, CRM and construction apps
const availableIntegrations: Integration[] = [
  // CRM Integrations
  {
    title: "Go High Level",
    icon: MessageSquare,
    description: "Sync messages and communication with Go High Level",
    path: "/messaging",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "Salesforce",
    icon: Users,
    description: "Connect with the world's leading CRM platform",
    path: "/settings/integrations/salesforce",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "HubSpot",
    icon: Database,
    description: "Manage customer relationships and marketing campaigns",
    path: "/settings/integrations/hubspot",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "Zoho CRM",
    icon: Users,
    description: "Manage your sales, marketing and customer support",
    path: "/settings/integrations/zoho",
    apiKeyRequired: true,
    category: "crm"
  },
  
  // Communication Integrations
  {
    title: "WhatsApp Business",
    icon: Phone,
    description: "Connect with customers via WhatsApp Business API",
    path: "/settings/integrations/whatsapp",
    apiKeyRequired: true,
    category: "communication"
  },
  {
    title: "Facebook",
    icon: Facebook,
    description: "Connect with Facebook for messaging and social media",
    path: "/settings/integrations/facebook",
    apiKeyRequired: true,
    category: "communication"
  },
  {
    title: "SendGrid",
    icon: Mail,
    description: "Send automated emails and notifications",
    path: "/settings/integrations/sendgrid",
    category: "communication"
  },
  {
    title: "Twilio",
    icon: Phone,
    description: "SMS, voice, and messaging integration",
    path: "/settings/integrations/twilio",
    apiKeyRequired: true,
    category: "communication"
  },
  
  // Payment Integrations
  {
    title: "Stripe",
    icon: CreditCard,
    description: "Process payments and manage subscriptions",
    path: "/settings/integrations/stripe",
    category: "payment"
  },
  {
    title: "PayPal",
    icon: CreditCard,
    description: "Accept payments online with PayPal",
    path: "/settings/integrations/paypal",
    category: "payment"
  },
  {
    title: "Square",
    icon: CreditCard,
    description: "Process payments in-person and online",
    path: "/settings/integrations/square",
    apiKeyRequired: true,
    category: "payment"
  },
  
  // Accounting Integrations
  {
    title: "Xero",
    icon: FileText,
    description: "Sync invoices, payments and accounting data with Xero",
    path: "/settings/integrations/xero",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "QuickBooks",
    icon: Calculator,
    description: "Connect your accounting data with QuickBooks",
    path: "/settings/integrations/quickbooks",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "MYOB",
    icon: Calculator,
    description: "Sync with MYOB accounting software",
    path: "/settings/integrations/myob",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "Sage",
    icon: BookOpen,
    description: "Connect with Sage accounting software",
    path: "/settings/integrations/sage",
    apiKeyRequired: true,
    category: "accounting"
  },
  
  // Construction Specific Integrations
  {
    title: "Procore",
    icon: HardHat,
    description: "Manage construction projects and documents",
    path: "/settings/integrations/procore",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "PlanGrid",
    icon: PenTool,
    description: "Construction blueprint and document management",
    path: "/settings/integrations/plangrid",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "BuilderTrend",
    icon: Hammer,
    description: "Construction project management software",
    path: "/settings/integrations/buildertrend",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "CoConstruct",
    icon: Wrench,
    description: "Custom home builder and remodeler software",
    path: "/settings/integrations/coconstruct",
    apiKeyRequired: true,
    category: "construction"
  },
  
  // Calendar/Scheduling
  {
    title: "Google Calendar",
    icon: Calendar,
    description: "Sync appointments and schedules",
    path: "/settings/integrations/google-calendar",
    category: "calendar"
  },
  {
    title: "Microsoft 365",
    icon: Calendar,
    description: "Connect with Microsoft 365 calendar and email",
    path: "/settings/integrations/microsoft365",
    apiKeyRequired: true,
    category: "calendar"
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [commandOpen, setCommandOpen] = useState(false);

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

  const handleIntegrationAction = (event: React.MouseEvent, integration: Integration) => {
    if (integrationStatuses[integration.title] !== "connected" && 
        integration.apiKeyRequired && 
        !apiKeys[integration.title]) {
      event.preventDefault();
      toast.error(`Please enter an API key for ${integration.title} first`);
    }
  };

  // Filter integrations based on search term and category
  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesSearch = integration.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Integrations" },
    { value: "accounting", label: "Accounting" },
    { value: "crm", label: "CRM" },
    { value: "construction", label: "Construction" },
    { value: "payment", label: "Payment" },
    { value: "communication", label: "Communication" },
    { value: "calendar", label: "Calendar" },
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-6 w-6 md:h-8 md:w-8 text-gray-700" />
            <h1 className="text-2xl md:text-3xl font-bold">API Integrations</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[300px] max-w-[600px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map(category => (
              <TabsTrigger key={category.value} value={category.value} className="text-xs md:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <Card key={integration.title} className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <integration.icon className="h-5 w-5 text-gray-600" />
                          <CardTitle className="text-lg md:text-xl">{integration.title}</CardTitle>
                        </div>
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
                              className="h-9 text-xs whitespace-nowrap"
                              size="sm"
                            >
                              <Key className="h-3 w-3 mr-1" />
                              {loading[integration.title] ? 'Saving...' : 'Save Key'}
                            </Button>
                          </div>
                        </div>
                      )}
                      {integrationStatuses[integration.title] !== "connected" && integration.apiKeyRequired ? (
                        <Button 
                          className="w-full h-9 text-sm"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (apiKeys[integration.title]) {
                              handleApiKeySubmit(integration.title);
                            } else {
                              toast.error(`Please enter an API key for ${integration.title} first`);
                            }
                          }}
                        >
                          Connect
                        </Button>
                      ) : (
                        <Link to={integration.path} className="w-full mt-auto" onClick={(e) => handleIntegrationAction(e, integration)}>
                          <Button 
                            className="w-full h-9 text-sm"
                            variant={integrationStatuses[integration.title] === "connected" ? "default" : "outline"}
                            size="sm"
                          >
                            {integrationStatuses[integration.title] === "connected" ? "Manage Integration" : "Connect"}
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No integrations found matching your search. Try a different term.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search for integrations..." />
          <CommandList>
            <CommandEmpty>No integrations found.</CommandEmpty>
            {categories.filter(c => c.value !== "all").map((category) => (
              <CommandGroup key={category.value} heading={category.label}>
                {availableIntegrations
                  .filter(integration => integration.category === category.value)
                  .map(integration => (
                    <CommandItem
                      key={integration.title}
                      onSelect={() => {
                        setSearchTerm(integration.title);
                        setSelectedCategory(integration.category);
                        setCommandOpen(false);
                      }}
                      className="flex items-center"
                    >
                      <integration.icon className="mr-2 h-4 w-4" />
                      <span>{integration.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </AppLayout>
  );
}
