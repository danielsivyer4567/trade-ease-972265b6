
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

interface ServiceItemProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
  isLoading: boolean;
  onToggleSync: (id: string) => void;
  onConnect: (id: string) => void;
  onRemove: (id: string) => void;
  isDefault: boolean;
}

export const ServiceItem = ({
  id,
  name,
  icon,
  isConnected,
  syncEnabled,
  lastSynced,
  isLoading,
  onToggleSync,
  onConnect,
  onRemove,
  isDefault
}: ServiceItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-300">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{name}</p>
          {isConnected && (
            <p className="text-xs text-gray-500">
              {lastSynced ? `Last synced: ${lastSynced}` : 'Not synced yet'}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {isConnected ? (
          <>
            <div className="flex items-center gap-2">
              <Switch 
                checked={syncEnabled} 
                onCheckedChange={() => onToggleSync(id)} 
                disabled={isLoading} 
              />
              <Label className="text-xs">Auto Sync</Label>
            </div>
            {!isDefault && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemove(id)} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onConnect(id)} 
            disabled={isLoading} 
            className="bg-slate-400 hover:bg-slate-500"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
          </Button>
        )}
      </div>
    </div>
  );
};
