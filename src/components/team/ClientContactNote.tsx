
import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface ClientContactProps {
  id: string;
  date: string;
  time: string;
  noteText: string;
  clientName?: string;
}

export function ClientContactNote({ id, date, time, noteText, clientName }: ClientContactProps) {
  const isMobile = useIsMobile();
  
  const handleSync = () => {
    toast.success("Note synced to Endata");
  };
  
  const handlePortalVisibility = () => {
    toast.info("Portal visibility updated");
  };

  return (
    <Card className="overflow-hidden border-b border-gray-200 bg-gray-50 my-4">
      <CardHeader className="flex flex-row items-center justify-between p-3 bg-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-600" />
          <span className="font-medium">Client Contact</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePortalVisibility} className="text-xs">
            Visible In Portal
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSync} className="text-xs">
            Sync To Endata
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-[80px_1fr] text-sm">
            <span className="text-gray-500">Date:</span>
            <span>{date} {time}</span>
          </div>
          
          {clientName && (
            <div className="grid grid-cols-[80px_1fr] text-sm">
              <span className="text-gray-500">Client:</span>
              <span>{clientName}</span>
            </div>
          )}
          
          <div className="mt-2">
            <p className="text-sm">{noteText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
