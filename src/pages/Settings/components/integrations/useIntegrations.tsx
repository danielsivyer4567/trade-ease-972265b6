import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Integration, IntegrationConfig } from './types';

export const useIntegrations = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [integrationStatuses, setIntegrationStatuses] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [commandOpen, setCommandOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async (): Promise<IntegrationConfig[]> => {
    try {
      console.log('Fetching integration configs...');
      // This is a mock implementation - in a real app, this would fetch from an API
      return [
        {
          integration_name: "Go High Level",
          status: "connected"
        }, 
        {
          integration_name: "Stripe",
          status: "not_connected"
        },
        {
          integration_name: "Xero",
          status: "not_connected"
        },
        {
          integration_name: "WhatsApp Business",
          status: "not_connected"
        },
        {
          integration_name: "Facebook",
          status: "not_connected"
        }
      ];
    } catch (error) {
      console.error('Error fetching integration configs:', error);
      setError('Failed to fetch integration configurations');
      return [];
    }
  };

  const loadIntegrationStatuses = async () => {
    try {
      console.log('Loading integration statuses...');
      const integrationData = await fetchConfigs();
      const statuses = Object.fromEntries(
        integrationData.map(item => [item.integration_name, item.status])
      );
      setIntegrationStatuses(statuses);
      console.log('Integration statuses loaded:', statuses);
    } catch (error) {
      console.error('Error loading integration statuses:', error);
      setError('Failed to load integration statuses');
      toast.error('Failed to load integration statuses');
    }
  };

  useEffect(() => {
    console.log('useIntegrations hook mounted');
    loadIntegrationStatuses();
  }, []);

  const handleApiKeyChange = (integration: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [integration]: value
    }));
  };

  const handleApiKeySubmit = async (integration: string) => {
    setLoading(prev => ({ ...prev, [integration]: true }));
    try {
      console.log(`Submitting API key for ${integration}...`);
      const apiKey = apiKeys[integration];
      
      // For now, just simulate a successful validation
      // In production, you would call the Supabase function
      console.log('Simulating API key validation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${integration} configured successfully`);
      await loadIntegrationStatuses();
      setApiKeys(prev => ({ ...prev, [integration]: '' }));
    } catch (error) {
      console.error('Error submitting API key:', error);
      setError(`Failed to configure ${integration}`);
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

  const handleConnect = (integration: Integration) => {
    if (apiKeys[integration.title]) {
      handleApiKeySubmit(integration.title);
    } else {
      toast.error(`Please enter an API key for ${integration.title} first`);
    }
  };

  const filterIntegrations = (integrations: Integration[], searchTerm: string, category: string) => {
    return integrations.filter(integration => {
      const matchesSearch = integration.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || integration.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  return {
    apiKeys,
    loading,
    integrationStatuses,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    commandOpen,
    setCommandOpen,
    handleApiKeyChange,
    handleApiKeySubmit,
    handleIntegrationAction,
    handleConnect,
    filterIntegrations,
    error
  };
};
