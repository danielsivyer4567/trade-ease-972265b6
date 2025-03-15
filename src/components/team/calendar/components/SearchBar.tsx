
import React from 'react';
import { Search, Plus, CalendarRange, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

interface SearchBarProps {
  jobSearchQuery: string;
  setJobSearchQuery: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onToggleQuoteSearch: () => void;
  onCreateJob: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  jobSearchQuery,
  setJobSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onToggleQuoteSearch,
  onCreateJob
}) => {
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
    <div className="w-full py-1 px-2">
      <div className="grid grid-cols-1 gap-1">
        {/* Combined Date and Time row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Start section */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Start *</label>
            <div className="grid grid-cols-2 gap-1">
              {/* Start Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 text-xs">
                    <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                    {startDate ? format(startDate, 'd MMM') : format(new Date(), 'd MMM')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-2" />
                </PopoverContent>
              </Popover>
              
              {/* Start Time */}
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full border-gray-300 h-7 text-xs">
                  <Clock className="mr-1 h-3 w-3 text-gray-500" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* End section */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">End *</label>
            <div className="grid grid-cols-2 gap-1">
              {/* End Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 text-xs">
                    <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                    {endDate ? format(endDate, 'd MMM') : format(new Date(), 'd MMM')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-2" />
                </PopoverContent>
              </Popover>
              
              {/* End Time */}
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full border-gray-300 h-7 text-xs">
                  <Clock className="mr-1 h-3 w-3 text-gray-500" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Job section */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Job</label>
          <div className="flex">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input 
                placeholder="Search jobs..." 
                value={jobSearchQuery} 
                onChange={e => setJobSearchQuery(e.target.value)} 
                className="pl-7 w-full border-gray-300 h-7 text-xs" 
              />
            </div>
            <Button variant="outline" className="ml-1 border-gray-300 h-7 w-7 p-0" size="sm">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Staff & Connections section */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Staff & Connections *</label>
          <div className="flex">
            <Input 
              placeholder="Add staff members or connections..." 
              className="w-full border-gray-300 h-7 text-xs" 
            />
            <Button variant="outline" className="ml-1 border-gray-300 h-7 w-7 p-0" size="sm">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Notes section - The last section */}
        <div className="mb-1">
          <label className="block text-xs font-medium mb-1 text-gray-500">Notes</label>
          <Textarea 
            placeholder="Add notes here..." 
            className="w-full h-10 px-3 py-1 border border-gray-300 rounded-md text-xs"
          />
        </div>
      </div>
    </div>
  );
};
