
import { AppLayout } from "@/components/ui/AppLayout";
import { Link2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IntegrationsList } from "./components/integrations/IntegrationsList";
import { IntegrationSearch } from "./components/integrations/IntegrationSearch";
import { IntegrationCommandDialog } from "./components/integrations/IntegrationCommandDialog";
import { useIntegrations } from "./components/integrations/useIntegrations";
import { availableIntegrations, categoryOptions } from "./components/integrations/integrationData";

export default function IntegrationsPage() {
  const {
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
  } = useIntegrations();

  const filteredIntegrations = filterIntegrations(
    availableIntegrations,
    searchTerm,
    selectedCategory
  );

  const handleSelectIntegration = (integration) => {
    setSearchTerm(integration.title);
    setSelectedCategory(integration.category);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-6 w-6 md:h-8 md:w-8 text-gray-700" />
            <h1 className="text-2xl md:text-3xl font-bold">API Integrations</h1>
          </div>
          
          <IntegrationSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenCommandDialog={() => setCommandOpen(true)}
          />
        </div>

        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            {categoryOptions.map(category => (
              <TabsTrigger key={category.value} value={category.value} className="text-xs md:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <IntegrationsList
              filteredIntegrations={filteredIntegrations}
              integrationStatuses={integrationStatuses}
              apiKeys={apiKeys}
              onApiKeyChange={handleApiKeyChange}
              onApiKeySubmit={handleApiKeySubmit}
              loading={loading}
              onConnect={handleConnect}
              onIntegrationAction={handleIntegrationAction}
            />
          </TabsContent>
        </Tabs>
      </div>

      <IntegrationCommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        integrations={availableIntegrations}
        onSelectIntegration={handleSelectIntegration}
      />
    </AppLayout>
  );
}
