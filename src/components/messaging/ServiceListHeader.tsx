
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Loader2 } from "lucide-react";

interface ServiceListHeaderProps {
  isLoading: boolean;
  onAddService: () => void;
  onSyncAll: () => void;
  hasSyncableServices: boolean;
}

export const ServiceListHeader = ({
  isLoading,
  onAddService,
  onSyncAll,
  hasSyncableServices
}: ServiceListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600">Enable automatic sync for connected services</p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddService} 
          className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Service
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSyncAll} 
          disabled={isLoading || !hasSyncableServices} 
          className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync All Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
