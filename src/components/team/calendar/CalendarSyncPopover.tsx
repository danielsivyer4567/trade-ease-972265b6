
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Job } from '@/types/job';

interface CalendarSyncPopoverProps {
  assignedJobs: Job[];
  date: Date | undefined;
}

export const CalendarSyncPopover: React.FC<CalendarSyncPopoverProps> = ({ 
  assignedJobs,
  date
}) => {
  const { toast } = useToast();
  const [syncPopoverOpen, setSyncPopoverOpen] = React.useState(false);

  const generateCalendarLink = (platform: 'google' | 'apple' | 'outlook') => {
    const events = assignedJobs.map(job => {
      const jobDate = new Date(job.date);
      const endDate = new Date(jobDate);
      endDate.setHours(endDate.getHours() + 2);
      
      return {
        title: job.title,
        description: job.description || `Job #${job.jobNumber}`,
        location: job.location ? `${job.location[1]},${job.location[0]}` : '',
        startDate: jobDate,
        endDate: endDate
      };
    });

    if (events.length === 0 && date) {
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 1);
      
      events.push({
        title: 'Team Schedule',
        description: 'Sync your team schedule',
        location: '',
        startDate: date,
        endDate: endDate
      });
    }

    if (events.length > 0) {
      const event = events[0];
      
      switch(platform) {
        case 'google':
          return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${format(event.startDate, 'yyyyMMdd')}T${format(event.startDate, 'HHmmss')}/${format(event.endDate, 'yyyyMMdd')}T${format(event.endDate, 'HHmmss')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
          
        case 'apple':
          return `webcal://calendar.google.com/calendar/ical/${encodeURIComponent('example@example.com')}/public/basic.ics`;
          
        case 'outlook':
          return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${format(event.startDate, 'yyyy-MM-dd')}T${format(event.startDate, 'HH:mm:ss')}&enddt=${format(event.endDate, 'yyyy-MM-dd')}T${format(event.endDate, 'HH:mm:ss')}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
          
        default:
          return '#';
      }
    }
    
    return '#';
  };

  const exportCalendar = (format: string) => {
    switch(format) {
      case 'ics':
        downloadICSFile();
        toast({
          title: "Calendar Exported",
          description: "Calendar has been exported as .ics file"
        });
        break;
        
      case 'google':
        window.open(generateCalendarLink('google'), '_blank');
        break;
        
      case 'apple':
        window.open(generateCalendarLink('apple'), '_blank');
        break;
        
      case 'outlook':
        window.open(generateCalendarLink('outlook'), '_blank');
        break;
        
      default:
        toast({
          title: "Export Error",
          description: "Unknown calendar format",
          variant: "destructive"
        });
    }
    
    setSyncPopoverOpen(false);
  };

  const downloadICSFile = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tradeboard//TeamCalendar//EN'
    ];

    assignedJobs.forEach(job => {
      const jobDate = new Date(job.date);
      const endDate = new Date(jobDate);
      endDate.setHours(endDate.getHours() + 2);
      
      icsContent = [
        ...icsContent,
        'BEGIN:VEVENT',
        `UID:${job.id}@tradeboard.com`,
        `DTSTAMP:${format(new Date(), 'yyyyMMdd')}T${format(new Date(), 'HHmmss')}Z`,
        `DTSTART:${format(jobDate, 'yyyyMMdd')}T${format(jobDate, 'HHmmss')}Z`,
        `DTEND:${format(endDate, 'yyyyMMdd')}T${format(endDate, 'HHmmss')}Z`,
        `SUMMARY:${job.title || `Job #${job.jobNumber}`}`,
        `DESCRIPTION:${job.description || ''}`,
        'END:VEVENT'
      ];
    });
    
    icsContent.push('END:VCALENDAR');
    
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Popover open={syncPopoverOpen} onOpenChange={setSyncPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-slate-400 hover:bg-slate-500">
          <CalendarIcon className="h-4 w-4" />
          <span>Sync Calendar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-2">
          <h4 className="font-medium mb-1">Export Calendar</h4>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start" 
            onClick={() => exportCalendar('google')}
          >
            Add to Google Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start" 
            onClick={() => exportCalendar('apple')}
          >
            Add to iPhone Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start" 
            onClick={() => exportCalendar('outlook')}
          >
            Add to Outlook
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start" 
            onClick={() => exportCalendar('ics')}
          >
            Download .ics File
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
