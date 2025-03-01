
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Link2, 
  ArrowLeft, 
  Save, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube, 
  Slack, 
  Trello, 
  Figma, 
  FileText, 
  Calendar, 
  Mail, 
  CreditCard, 
  MessageSquare, 
  Phone, 
  Github as GitHubIcon,
  BarChart,
  Briefcase,
  Building,
  Clock,
  Database,
  Headphones,
  LineChart,
  ShoppingCart,
  Truck,
  Wrench,
  Webhook
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  requiredFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
}

const integrationTemplates: IntegrationTemplate[] = [
  // CRM & Marketing
  {
    id: 'gohighlevel',
    name: 'Go High Level',
    description: 'Sync messages and communication with Go High Level',
    icon: MessageSquare,
    category: 'CRM & Marketing',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your Go High Level API key' },
      { name: 'location', label: 'Location ID', type: 'text', placeholder: 'Enter your location ID' }
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect with HubSpot CRM',
    icon: Database,
    category: 'CRM & Marketing',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your HubSpot API key' },
      { name: 'portalId', label: 'Portal ID', type: 'text', placeholder: 'Enter your HubSpot portal ID' }
    ]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and automation',
    icon: Mail,
    category: 'CRM & Marketing',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your Mailchimp API key' },
      { name: 'listId', label: 'List ID', type: 'text', placeholder: 'Enter your primary list ID' }
    ]
  },
  
  // Payment & Finance
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    icon: CreditCard,
    category: 'Payment & Finance',
    requiredFields: [
      { name: 'publishableKey', label: 'Publishable Key', type: 'text', placeholder: 'Enter your Stripe publishable key' },
      { name: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'Enter your Stripe secret key' }
    ]
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Sync invoices, payments and accounting data',
    icon: FileText,
    category: 'Payment & Finance',
    requiredFields: [
      { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your Xero client ID' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Xero client secret' },
      { name: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: 'Enter your Xero tenant ID' }
    ]
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting and bookkeeping integration',
    icon: Briefcase,
    category: 'Payment & Finance',
    requiredFields: [
      { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your QuickBooks client ID' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter your QuickBooks client secret' },
      { name: 'realmId', label: 'Realm ID', type: 'text', placeholder: 'Enter your QuickBooks realm ID' }
    ]
  },
  {
    id: 'myob',
    name: 'MYOB',
    description: 'Australian accounting software',
    icon: BarChart,
    category: 'Payment & Finance',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your MYOB API key' },
      { name: 'companyFile', label: 'Company File', type: 'text', placeholder: 'Enter your company file name' }
    ]
  },
  
  // Communication & Email
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Send automated emails and notifications',
    icon: Mail,
    category: 'Communication & Email',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your SendGrid API key' },
      { name: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'Enter your sender email address' }
    ]
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and phone call integration',
    icon: Phone,
    category: 'Communication & Email',
    requiredFields: [
      { name: 'accountSid', label: 'Account SID', type: 'text', placeholder: 'Enter your Twilio account SID' },
      { name: 'authToken', label: 'Auth Token', type: 'password', placeholder: 'Enter your Twilio auth token' },
      { name: 'phoneNumber', label: 'Phone Number', type: 'text', placeholder: 'Enter your Twilio phone number' }
    ]
  },
  
  // Calendar & Scheduling
  {
    id: 'googlecalendar',
    name: 'Google Calendar',
    description: 'Sync appointments and schedules',
    icon: Calendar,
    category: 'Calendar & Scheduling',
    requiredFields: [
      { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your Google client ID' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Google client secret' },
      { name: 'calendarId', label: 'Calendar ID', type: 'text', placeholder: 'Enter your calendar ID' }
    ]
  },
  {
    id: 'microsoft365calendar',
    name: 'Microsoft 365 Calendar',
    description: 'Sync with Outlook and Microsoft 365',
    icon: Calendar,
    category: 'Calendar & Scheduling',
    requiredFields: [
      { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter your Microsoft client ID' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter your Microsoft client secret' },
      { name: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: 'Enter your Microsoft tenant ID' }
    ]
  },
  
  // Productivity & Project Management
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    icon: Slack,
    category: 'Productivity & Project Management',
    requiredFields: [
      { name: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'Enter your Slack bot token' },
      { name: 'channel', label: 'Default Channel', type: 'text', placeholder: 'Enter your default channel name' }
    ]
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Project management and task tracking',
    icon: Trello,
    category: 'Productivity & Project Management',
    requiredFields: [
      { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Enter your Trello API key' },
      { name: 'token', label: 'Token', type: 'password', placeholder: 'Enter your Trello token' },
      { name: 'boardId', label: 'Board ID', type: 'text', placeholder: 'Enter your board ID' }
    ]
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Task management and project tracking',
    icon: Clock,
    category: 'Productivity & Project Management',
    requiredFields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your Asana access token' },
      { name: 'workspaceId', label: 'Workspace ID', type: 'text', placeholder: 'Enter your workspace ID' }
    ]
  },
  
  // Social Media
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Manage Facebook pages and posts',
    icon: Facebook,
    category: 'Social Media',
    requiredFields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your Facebook access token' },
      { name: 'pageId', label: 'Page ID', type: 'text', placeholder: 'Enter your page ID' }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Instagram business integration',
    icon: Instagram,
    category: 'Social Media',
    requiredFields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your Instagram access token' },
      { name: 'businessId', label: 'Business ID', type: 'text', placeholder: 'Enter your business ID' }
    ]
  },
  
  // Support & Customer Service
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Customer support and ticket management',
    icon: Headphones,
    category: 'Support & Customer Service',
    requiredFields: [
      { name: 'subdomain', label: 'Subdomain', type: 'text', placeholder: 'Enter your Zendesk subdomain' },
      { name: 'email', label: 'Email', type: 'text', placeholder: 'Enter your Zendesk email' },
      { name: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Enter your API token' }
    ]
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Customer messaging platform',
    icon: MessageSquare,
    category: 'Support & Customer Service',
    requiredFields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your Intercom access token' },
      { name: 'appId', label: 'App ID', type: 'text', placeholder: 'Enter your app ID' }
    ]
  },
  
  // E-commerce
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform integration',
    icon: ShoppingCart,
    category: 'E-commerce',
    requiredFields: [
      { name: 'shopName', label: 'Shop Name', type: 'text', placeholder: 'Enter your shop name' },
      { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Enter your API key' },
      { name: 'apiPassword', label: 'API Password', type: 'password', placeholder: 'Enter your API password' }
    ]
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'WordPress e-commerce integration',
    icon: ShoppingCart,
    category: 'E-commerce',
    requiredFields: [
      { name: 'siteUrl', label: 'Site URL', type: 'text', placeholder: 'Enter your WooCommerce site URL' },
      { name: 'consumerKey', label: 'Consumer Key', type: 'text', placeholder: 'Enter your consumer key' },
      { name: 'consumerSecret', label: 'Consumer Secret', type: 'password', placeholder: 'Enter your consumer secret' }
    ]
  },
  
  // Developer Tools
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository integration',
    icon: GitHubIcon,
    category: 'Developer Tools',
    requiredFields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter your GitHub access token' },
      { name: 'owner', label: 'Owner', type: 'text', placeholder: 'Enter repository owner (username or organization)' },
      { name: 'repo', label: 'Repository', type: 'text', placeholder: 'Enter repository name' }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with other apps via Zapier',
    icon: Webhook,
    category: 'Developer Tools',
    requiredFields: [
      { name: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'Enter your Zapier webhook URL' }
    ]
  }
];

const AddIntegration = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories = ['All', ...Array.from(new Set(integrationTemplates.map(template => template.category)))];
  
  const filteredTemplates = integrationTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const handleSelectTemplate = (template: IntegrationTemplate) => {
    setSelectedTemplate(template);
    // Initialize form data with empty values for each required field
    const initialData: Record<string, string> = {};
    template.requiredFields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  };
  
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    
    setIsSubmitting(true);
    
    // Validate form
    const missingFields = selectedTemplate.requiredFields.filter(field => !formData[field.name]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd save to database or call an API
      console.log('Integration data submitted:', {
        integrationId: selectedTemplate.id,
        integrationName: selectedTemplate.name,
        ...formData
      });
      
      toast.success(`${selectedTemplate.name} integration added successfully!`);
      navigate('/integrations');
    } catch (error) {
      console.error('Error adding integration:', error);
      toast.error('Failed to add integration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/integrations')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Link2 className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Add Integration</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Categories</CardTitle>
                <CardDescription>Choose a category to filter integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"} 
                    className="w-full justify-start mb-1"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Search integrations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <template.icon className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template);
                        }}
                      >
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No integrations found matching your criteria. Try changing your search or filters.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Integration Configuration Sheet */}
        {selectedTemplate && (
          <Sheet open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <selectedTemplate.icon className="h-6 w-6 text-primary" />
                  <SheetTitle>{selectedTemplate.name} Integration</SheetTitle>
                </div>
                <SheetDescription>
                  Configure the connection details for {selectedTemplate.name}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {selectedTemplate.requiredFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    
                    {field.type === 'select' ? (
                      <Select 
                        value={formData[field.name]} 
                        onValueChange={(value) => handleInputChange(field.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
                
                <Button 
                  className="w-full mt-6" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Connecting...' : 'Connect Integration'}
                  {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </AppLayout>
  );
};

export default AddIntegration;
