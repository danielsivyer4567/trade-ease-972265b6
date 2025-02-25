
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Droplet, CloudRain, CloudLightning, Sun, CloudSun, Droplets } from 'lucide-react';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

export function TeamCalendar({ date, setDate, teamColor, onJobAssign, assignedJobs = [] }: TeamCalendarProps) {
  const { toast } = useToast();
  const [weatherDates, setWeatherDates] = useState<RainData[]>([
    { 
      date: '2024-03-18', 
      rainfall: 0, 
      temperature: 25,
      rainChance: 5, 
      hasLightning: false, 
      condition: 'sunny',
      amount: 0 
    },
    { 
      date: '2024-03-19', 
      rainfall: 5, 
      temperature: 22,
      rainChance: 40, 
      hasLightning: false, 
      condition: 'rainy',
      amount: 5 
    },
    { 
      date: '2024-03-20', 
      rainfall: 12, 
      temperature: 19,
      rainChance: 80, 
      hasLightning: true, 
      condition: 'storm',
      amount: 12 
    },
    { 
      date: '2024-03-21', 
      rainfall: 8, 
      temperature: 21,
      rainChance: 60, 
      hasLightning: false, 
      condition: 'rainy',
      amount: 8 
    },
  ]);

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
        description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`,
      });
    }
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

  return (
    <section>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate} 
          className="w-full"
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
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, date)}
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
        />
      </div>
    </section>
  );
}
