
import React, { useState, useEffect } from 'react';
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
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Mock jobs data - in a real app, this would come from an API or parent component
const mockJobs = [{
  id: "1",
  jobNumber: "PLM-001",
  customer: "John Smith",
  address: "123 Main St",
  title: "Water Heater Installation"
}, {
  id: "2",
  jobNumber: "HVAC-001",
  customer: "Sarah Johnson",
  address: "456 Elm Ave",
  title: "HVAC Maintenance"
}, {
  id: "3",
  jobNumber: "ELE-001",
  customer: "Mike Brown",
  address: "789 Oak Dr",
  title: "Electrical Panel Upgrade"
}, {
  id: "4",
  jobNumber: "PLM-002",
  customer: "Jessica Lee",
  address: "321 Pine Rd",
  title: "Bathroom Renovation"
}, {
  id: "5",
  jobNumber: "ROOF-001",
  customer: "David Miller",
  address: "654 Cedar Ln",
  title: "Roof Repair"
}];

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
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    jobNumber: string;
    customer: string;
    address: string;
    title: string;
  } | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [syncToUserCalendar, setSyncToUserCalendar] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [calendarConnections, setCalendarConnections] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user data to check if they're logged in
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        // Fetch the user's calendar connections
        const { data: connections, error } = await supabase
          .from('user_calendar_connections')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('sync_enabled', true);
          
        if (!error && connections) {
          setCalendarConnections(connections);
        }
      }
    };
    
    getUserData();
    
    // Fetch real jobs from API or use mock data
    const fetchJobs = async () => {
      // In a real app, you would fetch from your API
      // const { data, error } = await supabase.from('jobs').select('*');
      // if (!error && data) {
      //   setJobs(data);
      // }
      
      // For now, use mock data
      setJobs(mockJobs);
    };
    
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobSearchQuery) {
      const lowercaseQuery = jobSearchQuery.toLowerCase();
      const filtered = jobs.filter(job => 
        job.jobNumber.toLowerCase().includes(lowercaseQuery) || 
        job.customer.toLowerCase().includes(lowercaseQuery) || 
        job.address.toLowerCase().includes(lowercaseQuery) || 
        job.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredJobs(filtered);
      setIsJobDropdownOpen(filtered.length > 0);
    } else {
      setFilteredJobs([]);
      setIsJobDropdownOpen(false);
    }
  }, [jobSearchQuery, jobs]);

  const handleJobSelect = (job: {
    id: string;
    jobNumber: string;
    customer: string;
    address: string;
    title: string;
  }) => {
    setSelectedJob(job);
    setJobSearchQuery(job.title || job.jobNumber);
    setIsJobDropdownOpen(false);
    
    // If sync is enabled and user has calendar connections, sync this job
    if (syncToUserCalendar && calendarConnections.length > 0 && startDate) {
      syncJobToUserCalendars(job);
    }
  };
  
  const syncJobToUserCalendars = async (job: any) => {
    if (!userId || !startDate) return;
    
    try {
      // For each calendar connection, create a sync event
      for (const connection of calendarConnections) {
        const eventStart = new Date(startDate);
        if (startTime) {
          const [hours, minutes] = startTime.split(':').map(Number);
          eventStart.setHours(hours, minutes);
        }
        
        const eventEnd = endDate ? new Date(endDate) : new Date(eventStart);
        if (endTime) {
          const [hours, minutes] = endTime.split(':').map(Number);
          eventEnd.setHours(hours, minutes);
        } else {
          // Default to 2 hours later if no end time/date
          eventEnd.setHours(eventStart.getHours() + 2);
        }
        
        await supabase.from('calendar_sync_events').insert({
          user_id: userId,
          connection_id: connection.id,
          trade_event_id: job.id,
          event_title: job.title || `Job #${job.jobNumber}`,
          event_start: eventStart.toISOString(),
          event_end: eventEnd.toISOString(),
          sync_status: 'pending'
        });
      }
      
      toast.success('Job scheduled and synced to your calendars');
    } catch (error) {
      console.error('Error syncing to calendars:', error);
      toast.error('Failed to sync with your calendars');
    }
  };

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

  return <div className={`w-full ${isMobile ? 'py-0.5 px-1' : 'py-1 px-2'}`}>
      <div className="grid grid-cols-1 gap-1 my-0 px-0">
        {/* Combined Date and Time row */}
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
        
        {/* Job section */}
        <div className="px-0 mx-0">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-500">Job</label>
            <Button onClick={handleNewJobClick} className="h-6 text-xs bg-slate-500 hover:bg-slate-400 text-white flex items-center gap-1 mx-[240px] px-[62px]">
              <Plus className="h-3 w-3" />
              New Job
            </Button>
          </div>
          <div className="flex py-px px-0 my-0 mx-[4px]">
            <div className="relative w-full py-[3px] px-px my-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input placeholder="Search by job #, customer name, address..." value={jobSearchQuery} onChange={e => setJobSearchQuery(e.target.value)} className="pl-7 w-full border-gray-300 h-7 text-xs bg-slate-300 py-[22px] mx-0 my-0 px-[22px]" onFocus={() => jobSearchQuery && setIsJobDropdownOpen(filteredJobs.length > 0)} onBlur={() => setTimeout(() => setIsJobDropdownOpen(false), 200)} />
              
              {/* Dropdown for job search results */}
              {isJobDropdownOpen && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredJobs.map(job => <div key={job.id} className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-xs" onClick={() => handleJobSelect(job)}>
                      <div className="font-medium">{job.jobNumber} - {job.title}</div>
                      <div className="text-gray-500">
                        {job.customer} | {job.address}
                      </div>
                    </div>)}
                </div>}
            </div>
            <Button variant="outline" size="sm" className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 px-[22px] py-[21px] mx-[7px] my-[3px]">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Calendar sync option for jobs */}
          {userId && calendarConnections.length > 0 && (
            <div className="flex items-center gap-2 mt-1 ml-1">
              <input 
                type="checkbox" 
                id="syncToCalendar" 
                checked={syncToUserCalendar} 
                onChange={() => setSyncToUserCalendar(!syncToUserCalendar)}
                className="h-3 w-3"
              />
              <label htmlFor="syncToCalendar" className="text-xs text-gray-500">
                Sync this job to my calendars
              </label>
            </div>
          )}
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
    </div>;
};
