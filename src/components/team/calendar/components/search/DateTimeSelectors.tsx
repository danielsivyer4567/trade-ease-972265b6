
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { CalendarRange, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateTimeSelectorsProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

export const DateTimeSelectors: React.FC<DateTimeSelectorsProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}) => {
  const isMobile = useIsMobile();
  
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
      {/* Start section */}
      <div className="mx-0">
        <label className="block text-xs font-medium mb-1 text-gray-500">Start *</label>
        <div className="grid grid-cols-2 gap-1 mx-[7px] px-0">
          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 text-gray-950 text-base font-medium px-[29px] mx-[15px]">
                <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                {startDate ? format(startDate, 'd MMM') : format(new Date(), 'd MMM')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-300">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className={`p-2 bg-slate-300 pointer-events-auto ${isMobile ? 'scale-75 origin-top-left' : ''}`} />
            </PopoverContent>
          </Popover>
          
          {/* Start Time */}
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger className="w-full border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 font-medium text-lg mx-[15px] px-[15px]">
              <Clock className="mr-1 h-3 w-3 text-gray-500" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent className={`bg-slate-300 ${isMobile ? "max-h-32" : ""}`}>
              {timeOptions.map(time => <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* End section */}
      <div className={isMobile ? "mt-1" : ""}>
        <label className="block text-xs font-medium mb-1 text-gray-500">End *</label>
        <div className="grid grid-cols-2 gap-1">
          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 text-base font-medium mx-[3px]">
                <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                {endDate ? format(endDate, 'd MMM') : format(new Date(), 'd MMM')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-300">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className={`p-2 bg-slate-300 pointer-events-auto ${isMobile ? 'scale-75 origin-top-left' : ''}`} />
            </PopoverContent>
          </Popover>
          
          {/* End Time */}
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger className="w-full border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 font-medium text-lg">
              <Clock className="mr-1 h-3 w-3 text-gray-500" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent className={`bg-slate-300 ${isMobile ? "max-h-32" : ""}`}>
              {timeOptions.map(time => <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
