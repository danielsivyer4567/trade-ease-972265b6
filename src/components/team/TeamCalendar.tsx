import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Droplet, CloudRain, CloudLightning, Sun, CloudSun, Droplets, Calendar as CalendarIcon } from 'lucide-react';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

interface TeamCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  teamColor: string;
  onJobAssign?: (jobId: string, date: Date) => void;
  assignedJobs?: Job[];
}

interface WeatherData {
  date: string;
  rainfall: number;
  temperature: number;
  rainChance: number;
  hasLightning: boolean;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'storm';
}

interface RainData extends WeatherData {
  amount: number;
}

export function TeamCalendar({
  date,
  setDate,
  teamColor,
  onJobAssign,
  assignedJobs = []
}: TeamCalendarProps) {
  const { toast } = useToast();
  const [syncPopoverOpen, setSyncPopoverOpen] = useState(false);
  const navigate = useNavigate();
  
  const [weatherDates, setWeatherDates] = useState<RainData[]>([{
    date: '2024-03-18',
    rainfall: 0,
    temperature: 25,
    rainChance: 5,
    hasLightning: false,
    condition: 'sunny',
    amount: 0
  }, {
    date: '2024-03-19',
    rainfall: 5,
    temperature: 22,
    rainChance: 40,
    hasLightning: false,
    condition: 'rainy',
    amount: 5
  }, {
    date: '2024-03-20',
    rainfall: 12,
    temperature: 19,
    rainChance: 80,
    hasLightning: true,
    condition: 'storm',
    amount: 12
  }, {
    date: '2024-03-21',
    rainfall: 8,
    temperature: 21,
    rainChance: 60,
    hasLightning: false,
    condition: 'rainy',
    amount: 8
  }]);

  const getWeatherIcon = (data: RainData) => {
    if (data.hasLightning) {
      return <CloudLightning className="h-4 w-4 text-purple-600" />;
    }
    if (data.rainfall > 10) {
      return <CloudRain className="h-4 w-4 text-blue-600" />;
    }
    if (data.rainfall > 5) {
      return <Droplets className="h-4 w-4 text-blue-500" />;
    }
    if (data.rainfall > 0) {
      return <Droplet className="h-4 w-4 text-blue-400" />;
    }
    if (data.condition === 'partly-cloudy') {
      return <CloudSun className="h-4 w-4 text-orange-400" />;
    }
    return <Sun className="h-4 w-4 text-orange-500" />;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId && onJobAssign) {
      onJobAssign(jobId, targetDate);
      toast({
        title: "Job Rescheduled",
        description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`
      });
    }
  };

  const handleJobClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${jobId}`);
  };

  const modifiers = {
    rainy: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return weatherDates.some(rd => rd.date === dateStr);
    }
  };

  const modifiersStyles = {
    rainy: {
      position: 'relative' as const
    }
  };

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
    <section>
      <div className="p-6 rounded-lg shadow-md bg-slate-300 my-[32px] px-0 py-[31px] mx-px">
        <div className="flex justify-between items-center mb-4 px-4">
          <h3 className="text-sm font-medium">Team Schedule</h3>
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
        </div>
        
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate} 
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const weatherData = weatherDates.find(rd => rd.date === dateStr);
              const jobsForDate = assignedJobs?.filter(job => {
                try {
                  const jobDate = new Date(job.date);
                  return format(jobDate, 'yyyy-MM-dd') === dateStr;
                } catch (e) {
                  console.error('Invalid date in job:', job);
                  return false;
                }
              });

              return (
                <div 
                  className="relative w-full h-full flex items-center justify-center" 
                  onDragOver={e => e.preventDefault()} 
                  onDrop={e => handleDrop(e, date)}
                >
                  <span className="absolute top-1">{date.getDate()}</span>
                  {weatherData && (
                    <>
                      <div className="absolute top-4">
                        {getWeatherIcon(weatherData)}
                      </div>
                      <div className="absolute top-[35px] text-[10px] font-medium">
                        {weatherData.temperature}°C
                      </div>
                      {weatherData.rainfall > 0 && (
                        <div className="absolute bottom-1 text-[10px] text-blue-500 font-medium">
                          {weatherData.rainfall}mm
                        </div>
                      )}
                    </>
                  )}
                  
                  {jobsForDate && jobsForDate.length > 0 && (
                    <div className="absolute bottom-5 left-0 right-0 px-1">
                      {jobsForDate.slice(0, 2).map((job, idx) => (
                        <div 
                          key={`${job.id}-${idx}`}
                          onClick={(e) => handleJobClick(job.id, e)}
                          className={`text-[9px] truncate rounded mb-[2px] px-1 cursor-pointer hover:opacity-80 bg-${teamColor}-500 text-white`}
                          title={job.title || job.jobNumber}
                        >
                          {job.title || `Job #${job.jobNumber}`}
                        </div>
                      ))}
                      {jobsForDate.length > 2 && (
                        <div className="text-[9px] text-center text-gray-600 font-semibold">
                          +{jobsForDate.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  
                  {jobsForDate && jobsForDate.length > 0 && (
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {jobsForDate.length}
                    </div>
                  )}
                </div>
              );
            }
          }}
          classNames={{
            months: "w-full",
            month: "w-full",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell: "text-muted-foreground text-center text-sm font-medium p-2",
            row: "grid grid-cols-7",
            cell: "h-16 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md cursor-pointer",
            day: `h-16 w-full p-2 font-normal aria-selected:bg-${teamColor}-600 aria-selected:text-white hover:bg-gray-100 rounded-md`,
            day_range_end: "day-range-end",
            day_selected: `bg-${teamColor}-600 text-white hover:bg-${teamColor}-600 hover:text-white focus:bg-${teamColor}-600 focus:text-white`,
            day_today: "bg-blue-100 text-blue-900 hover:bg-blue-200",
            day_outside: "text-gray-400",
            nav: "space-x-1 flex items-center justify-between p-2",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "flex justify-center py-4 relative items-center text-lg font-semibold"
          }}
          className="w-full bg-slate-200"
        />
      </div>
    </section>
  );
}
