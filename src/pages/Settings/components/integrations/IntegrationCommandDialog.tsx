
import React from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Integration } from './types';
import { categoryOptions } from './integrationData';

interface IntegrationCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrations: Integration[];
  onSelectIntegration: (integration: Integration) => void;
}

export const IntegrationCommandDialog: React.FC<IntegrationCommandDialogProps> = ({
  open,
  onOpenChange,
  integrations = [],
  onSelectIntegration
}) => {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search for integrations..." />
        <CommandList>
          <CommandEmpty>No integrations found.</CommandEmpty>
          {(categoryOptions || []).filter(c => c.value !== "all").map((category) => (
            <CommandGroup key={category.value} heading={category.label}>
              {(integrations || [])
                .filter(integration => integration.category === category.value)
                .map(integration => {
                  const IntegrationIcon = integration.icon;
                  return (
                    <CommandItem
                      key={integration.title}
                      onSelect={() => {
                        onSelectIntegration(integration);
                        onOpenChange(false);
                      }}
                      className="flex items-center"
                    >
                      <IntegrationIcon className="mr-2 h-4 w-4" />
                      <span>{integration.title}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
