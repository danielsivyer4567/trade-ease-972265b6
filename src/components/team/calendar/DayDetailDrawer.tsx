
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, Search, ClipboardList, CalendarRange } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchQuotes } from '@/pages/Jobs/components/tabs/financials/SearchQuotes';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

interface DayDetailDrawerProps {
  selectedDay: { date: Date, jobs: Job[] } | null;
  onClose: () => void;
  onJobClick: (jobId: string, e: React.MouseEvent) => void;
}

export const DayDetailDrawer: React.FC<DayDetailDrawerProps> = ({ 
  selectedDay, 
  onClose, 
  onJobClick 
}) => {
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [quoteSearchQuery, setQuoteSearchQuery] = useState("");
  const [showQuoteSearch, setShowQuoteSearch] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  
  if (!selectedDay) return null;
  
  const { date, jobs } = selectedDay;
  
  // Mock quotes data for the search feature
  const mockCustomerQuotes = [
    { id: "Q001", customerName: "John Smith", amount: 750 },
    { id: "Q002", customerName: "Sarah Johnson", amount: 1200 },
    { id: "Q003", customerName: "Mike Brown", amount: 950 }
  ];

  const filteredJobs = jobSearchQuery 
    ? jobs.filter(job => 
        job.title?.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
        job.jobNumber.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.customer.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(jobSearchQuery.toLowerCase())
      )
    : jobs;

  const handleQuoteSelect = (amount: number) => {
    console.log("Selected quote with amount:", amount);
    // Here you would typically create a job from the quote
    // For now, we'll just close the quote search
    setShowQuoteSearch(false);
    // Show a toast notification that a job has been created
  };

  // Generate time options
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
    <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] bg-slate-300">
        <DrawerHeader className="bg-slate-300">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Jobs for {format(date, 'MMMM d, yyyy')}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 overflow-auto bg-slate-300">
          <div className="space-y-4 flex flex-col items-center">
            {/* Search and Actions Section */}
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto">
              <div className="grid grid-cols-1 gap-5">
                {/* Job title/quote search */}
                <div className="text-center">
                  <h3 className="font-medium mb-3 text-lg">Job Search</h3>
                  <div className="relative w-full mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs or quotes..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                
                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left"
                          >
                            <CalendarRange className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'MMM d, yyyy') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left"
                          >
                            <CalendarRange className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'MMM d, yyyy') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="w-full">
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="w-full">
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 mt-2">
                    <Button 
                      onClick={() => setShowQuoteSearch(!showQuoteSearch)} 
                      variant="secondary"
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Find Quote
                    </Button>
                    <Button 
                      onClick={() => console.log("Create new job", {
                        date: format(date, 'yyyy-MM-dd'),
                        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
                        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
                        startTime,
                        endTime
                      })} 
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Job
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quote Search section - moved below the main search bar */}
            {showQuoteSearch && (
              <div className="bg-white p-3 rounded-lg max-w-md w-full mx-auto">
                <SearchQuotes 
                  onSelectQuote={handleQuoteSelect} 
                  customerQuotes={mockCustomerQuotes}
                />
              </div>
            )}
            
            {/* Jobs list section */}
            <div className="bg-white p-4 rounded-lg mt-4 w-full max-w-4xl">
              <h3 className="font-medium mb-2">Jobs for this day</h3>
              {jobSearchQuery && filteredJobs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No jobs found matching "{jobSearchQuery}"
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No jobs scheduled for this day
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map(job => (
                    <div 
                      key={job.id}
                      onClick={(e) => onJobClick(job.id, e)}
                      className="border p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <h3 className="font-medium">{job.title || `Job #${job.jobNumber}`}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{job.customer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{job.type}</span>
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Coordinates: {job.location.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DrawerFooter className="bg-slate-300">
          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
