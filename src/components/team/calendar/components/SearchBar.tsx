
import React from 'react';
import { Search, Plus, CalendarRange, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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
  
  const handleNewJobClick = () => {
    navigate('/jobs/new');
  };
  
  return (
    <div className={`w-full ${isMobile ? 'py-0.5 px-1' : 'py-1 px-2'}`}>
      <div className="grid grid-cols-1 gap-1 my-0">
        {/* Combined Date and Time row */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {/* Start section */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Start *</label>
            <div className="grid grid-cols-2 gap-1">
              {/* Start Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 text-gray-950 text-base font-medium">
                    <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                    {startDate ? format(startDate, 'd MMM') : format(new Date(), 'd MMM')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar 
                    mode="single" 
                    selected={startDate} 
                    onSelect={setStartDate} 
                    initialFocus 
                    className={`p-2 ${isMobile ? 'scale-75 origin-top-left' : ''}`} 
                  />
                </PopoverContent>
              </Popover>
              
              {/* Start Time */}
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 font-medium text-lg">
                  <Clock className="mr-1 h-3 w-3 text-gray-500" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className={isMobile ? "max-h-32" : ""}>
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
                  <Button variant={"outline"} className="w-full justify-start text-left border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 text-base font-medium">
                    <CalendarRange className="mr-1 h-3 w-3 text-gray-500" />
                    {endDate ? format(endDate, 'd MMM') : format(new Date(), 'd MMM')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar 
                    mode="single" 
                    selected={endDate} 
                    onSelect={setEndDate} 
                    initialFocus 
                    className={`p-2 ${isMobile ? 'scale-75 origin-top-left' : ''}`} 
                  />
                </PopoverContent>
              </Popover>
              
              {/* End Time */}
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full border-gray-300 h-7 bg-slate-400 hover:bg-slate-300 font-medium text-lg">
                  <Clock className="mr-1 h-3 w-3 text-gray-500" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className={isMobile ? "max-h-32" : ""}>
                  {timeOptions.map(time => <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Job section */}
        <div className="px-0 mx-0">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-500">Job</label>
            <Button 
              onClick={handleNewJobClick}
              className="h-6 px-2 text-xs bg-slate-500 hover:bg-slate-400 text-white flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              New Job
            </Button>
          </div>
          <div className="flex py-px px-0 my-0 mx-[4px]">
            <div className="relative w-full py-[3px] px-px my-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input placeholder="Search jobs..." value={jobSearchQuery} onChange={e => setJobSearchQuery(e.target.value)} className="pl-7 w-full border-gray-300 h-7 text-xs bg-slate-300 py-[22px] mx-0 my-0 px-[22px]" />
            </div>
            <Button variant="outline" size="sm" className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 px-[22px] py-[21px] mx-[7px] my-[3px]">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Staff & Connections section */}
        <div className="my-[8px] py-0">
          <label className="block text-xs font-medium mb-1 text-gray-500">Staff & Connections</label>
          <div className="flex py-px px-0 my-0 mx-[4px]">
            <Input placeholder="Add staff members or connections..." className="w-full border-gray-300 h-7 text-xs bg-slate-300 py-[25px] my-0 px-[14px] mx-[3px]" />
            <Button variant="outline" size="sm" className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 my-0 py-[25px] mx-[11px] px-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Notes section - The last section */}
        <div className="mb-1">
          <label className="block text-xs font-medium mb-1 text-gray-500">Notes</label>
          <Textarea placeholder="Add notes here..." className="w-full h-10 px-3 py-1 border border-gray-300 rounded-md text-xs bg-slate-300" />
        </div>
      </div>
    </div>
  );
};
