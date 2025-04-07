
import React from 'react';
import { Cloud, CloudOff, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';

interface WorkflowSyncStatusProps {
  lastSavedAt: Date | null;
  isSyncing: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isUserLoggedIn: boolean;
}

export const WorkflowSyncStatus: React.FC<WorkflowSyncStatusProps> = ({
  lastSavedAt,
  isSyncing,
  hasUnsavedChanges,
  onSave,
  isUserLoggedIn
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!isUserLoggedIn) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <CloudOff className="h-4 w-4 mr-1" />
        <span className={isMobile ? "hidden" : "inline"}>Sign in to save</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground flex items-center">
        {isSyncing ? (
          <>
            <Cloud className="h-4 w-4 mr-1 animate-pulse text-blue-500" />
            <span className={isMobile ? "hidden" : "inline"}>Syncing...</span>
          </>
        ) : hasUnsavedChanges ? (
          <>
            <CloudOff className="h-4 w-4 mr-1 text-amber-500" />
            <span className={isMobile ? "hidden" : "inline"}>Unsaved changes</span>
          </>
        ) : (
          <>
            <Cloud className="h-4 w-4 mr-1 text-green-500" />
            <span className={isMobile ? "hidden" : "inline"}>
              {lastSavedAt ? (
                <>
                  <Clock className="h-3 w-3 inline mr-1" />
                  Saved {formatLastSaved(lastSavedAt)}
                </>
              ) : (
                "All changes saved"
              )}
            </span>
          </>
        )}
      </div>
      
      {hasUnsavedChanges && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 px-2 text-xs"
          onClick={onSave}
        >
          <Save className="h-3 w-3 mr-1" />
          Save now
        </Button>
      )}
    </div>
  );
};

function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}
