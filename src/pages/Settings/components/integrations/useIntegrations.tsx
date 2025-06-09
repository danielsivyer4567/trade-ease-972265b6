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
  const [xeroClientId, setXeroClientId] = useState("");
  const [xeroClientSecret, setXeroClientSecret] = useState("");

  const fetchConfigs = async (): Promise<IntegrationConfig[]> => {
    try {
      console.log('Fetching integration configs...');
      const { data, error } = await supabase
        .from('integration_configs')
        .select('integration_name, status, client_id, client_secret');

      if (error) {
        console.warn('Error fetching integration configs (using defaults):', error);
        return [];
      }

      // Ensure data is an array
      const configData = Array.isArray(data) ? data : [];

      // Set Xero credentials if they exist
      const xeroConfig = configData.find(config => config?.integration_name === 'Xero');
      if (xeroConfig) {
        setXeroClientId(xeroConfig.client_id || '');
        setXeroClientSecret(xeroConfig.client_secret || '');
      }

      return configData;
    } catch (error) {
      console.warn('Error fetching integration configs (using defaults):', error);
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

  const handleXeroClientIdChange = (value: string) => {
    setXeroClientId(value);
  };

  const handleXeroClientSecretChange = (value: string) => {
    setXeroClientSecret(value);
  };

  const handleApiKeySubmit = async (integration: string) => {
    setLoading(prev => ({ ...prev, [integration]: true }));
    try {
      console.log(`Submitting API key for ${integration}...`);
      
      if (integration === 'Xero') {
        // For Xero, we store both client ID and secret
        const { error } = await supabase
          .from('integration_configs')
          .upsert({
            integration_name: 'Xero',
            client_id: xeroClientId,
            client_secret: xeroClientSecret,
            status: 'pending'
          });

        if (error) throw error;
      } else {
        // For other integrations, store the API key
        const apiKey = apiKeys[integration];
        const { error } = await supabase
          .from('integration_configs')
          .upsert({
            integration_name: integration,
            api_key: apiKey,
            status: 'connected'
          });

        if (error) throw error;
      }
      
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
    if (integration.title === 'Xero') {
      if (!xeroClientId || !xeroClientSecret) {
        toast.error('Please enter both Client ID and Client Secret for Xero');
        return;
      }
      handleApiKeySubmit('Xero');
    } else if (apiKeys[integration.title]) {
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
    error,
    xeroClientId,
    xeroClientSecret,
    handleXeroClientIdChange,
    handleXeroClientSecretChange
  };
};
