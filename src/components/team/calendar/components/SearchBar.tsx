
import React, { useState } from 'react';
import { Search, Plus, ClipboardList, CalendarRange, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

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
  const today = new Date();
  const currentDay = today.getDate();
  
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 gap-5">
        <div>
          {/* Start section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-500">Start *</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Start Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300">
                    <CalendarRange className="mr-2 h-4 w-4 text-gray-500" />
                    {startDate ? format(startDate, 'd MMM yyyy') : new Date().getDate().toString()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              
              {/* Start Time */}
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full border-gray-300">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Select time" />
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-500">End *</label>
            <div className="grid grid-cols-2 gap-2">
              {/* End Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300">
                    <CalendarRange className="mr-2 h-4 w-4 text-gray-500" />
                    {endDate ? format(endDate, 'd MMM yyyy') : new Date().getDate().toString()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              
              {/* End Time */}
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full border-gray-300">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Select time" />
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
          
          {/* Job section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-500">Job</label>
            <div className="flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search jobs..." 
                  value={jobSearchQuery} 
                  onChange={e => setJobSearchQuery(e.target.value)} 
                  className="pl-10 w-full border-gray-300" 
                />
              </div>
              <Button variant="outline" className="ml-2 border-gray-300" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Staff & Connections section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-500">Staff & Connections *</label>
            <div className="flex">
              <Input 
                placeholder="Add staff members or connections..." 
                className="w-full border-gray-300" 
              />
              <Button variant="outline" className="ml-2 border-gray-300" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Notes section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-500">Notes *</label>
            <textarea 
              placeholder="Add notes here..." 
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
