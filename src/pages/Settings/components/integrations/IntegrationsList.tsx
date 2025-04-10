
import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { Integration } from './types';

interface IntegrationsListProps {
  filteredIntegrations: Integration[];
  integrationStatuses: Record<string, string>;
  apiKeys: Record<string, string>;
  onApiKeyChange: (integration: string, value: string) => void;
  onApiKeySubmit: (integration: string) => void;
  loading: Record<string, boolean>;
  onConnect: (integration: Integration) => void;
  onIntegrationAction: (event: React.MouseEvent, integration: Integration) => void;
}

export const IntegrationsList: React.FC<IntegrationsListProps> = ({
  filteredIntegrations,
  integrationStatuses,
  apiKeys,
  onApiKeyChange,
  onApiKeySubmit,
  loading,
  onConnect,
  onIntegrationAction
}) => {
  if (filteredIntegrations.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-muted-foreground">No integrations found matching your search. Try a different term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredIntegrations.map((integration) => (
        <IntegrationCard
          key={integration.title}
          integration={integration}
          status={integrationStatuses[integration.title] || 'not_connected'}
          apiKey={apiKeys[integration.title] || ''}
          onApiKeyChange={onApiKeyChange}
          onApiKeySubmit={onApiKeySubmit}
          loading={!!loading[integration.title]}
          onConnect={onConnect}
          onIntegrationAction={onIntegrationAction}
        />
      ))}
    </div>
  );
};
