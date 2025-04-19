import React from 'react';
import { useDirectTabNavigation } from '@/hooks/useDirectTabNavigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TabNavigator() {
  const { 
    directNavigationEnabled, 
    toggleDirectNavigation, 
    targetPath, 
    executeNavigation, 
    clearTabTarget 
  } = useDirectTabNavigation();

  // If no target path is set, don't render anything
  if (!targetPath && !directNavigationEnabled) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={directNavigationEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleDirectNavigation}
              className={cn(
                "flex items-center gap-1",
                directNavigationEnabled ? 
                  "bg-green-600 hover:bg-green-700" : 
                  "border-amber-400 text-amber-600"
              )}
            >
              <ExternalLink className="h-4 w-4" />
              <span>
                {directNavigationEnabled ? "Direct Navigation: ON" : "Direct Navigation: OFF"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {directNavigationEnabled ? 
                "Clicking tabs will navigate directly" : 
                "Tabs require confirmation before navigation"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Target Path Preview */}
      {targetPath && !directNavigationEnabled && (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg p-3 w-80 animate-in fade-in slide-in-from-right-5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Pending Navigation</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={clearTabTarget}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-xs text-gray-600 mb-2 truncate">
            Navigate to: <span className="font-medium">{targetPath.title}</span>
          </div>
          <div className="text-xs text-gray-500 mb-3 truncate">
            Path: {targetPath.path}
          </div>
          <Button 
            className="w-full bg-primary text-white"
            size="sm"
            onClick={executeNavigation}
          >
            Confirm Navigation
          </Button>
        </div>
      )}
    </div>
  );
} 