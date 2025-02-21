
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Droplet } from 'lucide-react';
import { WeatherChart } from './WeatherChart';

interface TeamCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  teamColor: string;
}

interface RainData {
  date: string;
  amount: number;
}

export function TeamCalendar({ date, setDate, teamColor }: TeamCalendarProps) {
  const [rainyDates, setRainyDates] = useState<RainData[]>([]);

  // Initialize weather data
  useEffect(() => {
    const weatherData = [
      { date: '2024-03-18', rainfall: 0 },
      { date: '2024-03-19', rainfall: 5 },
      { date: '2024-03-20', rainfall: 12 },
      { date: '2024-03-21', rainfall: 8 },
      { date: '2024-03-22', rainfall: 0 },
      { date: '2024-03-23', rainfall: 3 },
      { date: '2024-03-24', rainfall: 15 },
    ];
    
    const rainData = weatherData
      .filter(day => day.rainfall > 0)
      .map(day => ({
        date: day.date,
        amount: day.rainfall
      }));
    
    setRainyDates(rainData);
  }, []);

  const modifiers = {
    rainy: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return rainyDates.some(rd => rd.date === dateStr);
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
              const dateStr = date.toISOString().split('T')[0];
              const rainData = rainyDates.find(rd => rd.date === dateStr);
              const isRainy = !!rainData;
              
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{date.getDate()}</span>
                  {isRainy && (
                    <div className="absolute top-1 left-1 flex items-center gap-0.5">
                      <Droplet className="h-3 w-3 text-blue-500" />
                      <span className="text-[10px] text-blue-500 font-medium">{rainData?.amount}mm</span>
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
            cell: "h-16 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md",
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
        <div className="mt-6">
          <WeatherChart selectedDate={date} onRainyDateHighlight={() => {}} />
        </div>
      </div>
    </section>
  );
}
