
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface CalendarIntegrationDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onProviderSelect: (provider: string) => void;
}

export function CalendarIntegrationDialog({ 
  open, 
  onOpenChange, 
  onProviderSelect 
}: CalendarIntegrationDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Connect Calendar
          </DialogTitle>
          <DialogDescription>
            Sync your team calendars with external calendar services
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
            onClick={() => onProviderSelect('Google Calendar')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="h-5 w-5" />
            Connect with Google Calendar
          </Button>
          
          <Button 
            className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
            onClick={() => onProviderSelect('Apple Calendar')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/IOS_Calendar_Icon.png" alt="Apple Calendar" className="h-5 w-5" />
            Connect with Apple Calendar
          </Button>
          
          <Button 
            className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
            onClick={() => onProviderSelect('Microsoft Outlook')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Microsoft Outlook" className="h-5 w-5" />
            Connect with Outlook Calendar
          </Button>
          
          <Button 
            className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
            onClick={() => {
              onOpenChange(false);
              navigate('/settings/integrations');
            }}
          >
            <Plus className="h-5 w-5" />
            Add Other Calendar
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
