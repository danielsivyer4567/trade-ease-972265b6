
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

  const fetchConfigs = async (): Promise<IntegrationConfig[]> => {
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

  useEffect(() => {
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
    filterIntegrations
  };
};
