
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Droplet, CloudRain, CloudLightning, Sun, CloudSun, Droplets } from 'lucide-react';
import { WeatherChart } from './WeatherChart';

interface TeamCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  teamColor: string;
}

interface WeatherData {
  date: string;
  rainfall: number;
  rainChance: number;
  hasLightning: boolean;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'storm';
}

interface RainData extends WeatherData {
  amount: number;
}

export function TeamCalendar({ date, setDate, teamColor }: TeamCalendarProps) {
  const [weatherDates, setWeatherDates] = useState<RainData[]>([]);

  const handleRainyDateHighlight = (dates: string[], weatherData: WeatherData[]) => {
    const enhancedData = weatherData.map(data => ({
      ...data,
      amount: data.rainfall
    }));
    setWeatherDates(enhancedData);
  };

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

  const modifiers = {
    rainy: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
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
              const dateStr = date.toISOString().split('T')[0];
              const weatherData = weatherDates.find(rd => rd.date === dateStr);
              
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{date.getDate()}</span>
                  {weatherData && (
                    <>
                      {weatherData.rainChance > 1 && (
                        <div className="absolute top-1 right-1 flex items-center gap-0.5">
                          <span className="text-[10px] text-blue-500 font-medium">
                            {weatherData.rainChance}%
                          </span>
                          {getWeatherIcon(weatherData)}
                        </div>
                      )}
                      {weatherData.amount > 0 && (
                        <div className="absolute bottom-1 left-1 flex items-center gap-0.5">
                          <span className="text-[10px] text-blue-500 font-medium">
                            {weatherData.amount}mm
                          </span>
                        </div>
                      )}
                    </>
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
      </div>
    </section>
  );
}
