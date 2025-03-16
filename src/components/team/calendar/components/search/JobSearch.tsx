
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { syncSingleJobToCalendars } from '@/integrations/calendar/syncEvents';
import { useCalendarConnections } from '@/hooks/useCalendarConnections';
import { toast } from 'sonner';

interface JobSearchProps {
  jobSearchQuery: string;
  setJobSearchQuery: (value: string) => void;
  startDate: Date | undefined;
  startTime: string;
  endDate: Date | undefined;
  endTime: string;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  jobSearchQuery,
  setJobSearchQuery,
  startDate,
  startTime,
  endDate,
  endTime
}) => {
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
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
  
  const { connections, userId, isConnected } = useCalendarConnections();

  useEffect(() => {
    // Fetch real jobs from API or use mock data
    const fetchJobs = async () => {
      // In a real app, you would fetch from your API
      // const { data, error } = await supabase.from('jobs').select('*');
      // if (!error && data) {
      //   setJobs(data);
      // }
      
      // For now, use mock data
      setJobs([{
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
      }]);
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
    if (syncToUserCalendar && connections.length > 0 && startDate) {
      syncJobToUserCalendars(job);
    }
  };
  
  const syncJobToUserCalendars = async (job: any) => {
    if (!userId || !startDate) return;
    
    try {
      // Create a job-like object from our selected job
      const jobForSync: Job = {
        id: job.id,
        customer: job.customer,
        title: job.title || `Job #${job.jobNumber}`,
        jobNumber: job.jobNumber,
        status: 'ready',
        type: 'General',
        location: job.location,
        // Create a date object with combined date and time
        date: startDate.toISOString()
      };
      
      // Use the syncEvents utility
      const result = await syncSingleJobToCalendars(jobForSync, connections, userId);
      
      if (result.success) {
        toast.success('Job synced to your calendars');
      } else {
        toast.error('Failed to sync with one or more calendars');
      }
    } catch (error) {
      console.error('Error syncing to calendars:', error);
      toast.error('Failed to sync with your calendars');
    }
  };

  const handleNewJobClick = () => {
    navigate('/jobs/new');
  };

  return (
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
          <Input 
            placeholder="Search by job #, customer name, address..." 
            value={jobSearchQuery} 
            onChange={e => setJobSearchQuery(e.target.value)} 
            className="pl-7 w-full border-gray-300 h-7 text-xs bg-slate-300 py-[22px] mx-0 my-0 px-[22px]" 
            onFocus={() => jobSearchQuery && setIsJobDropdownOpen(filteredJobs.length > 0)} 
            onBlur={() => setTimeout(() => setIsJobDropdownOpen(false), 200)} 
          />
          
          {/* Dropdown for job search results */}
          {isJobDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredJobs.map(job => (
                <div 
                  key={job.id}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-xs" 
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="font-medium">{job.jobNumber} - {job.title}</div>
                  <div className="text-gray-500">
                    {job.customer} | {job.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 px-[22px] py-[21px] mx-[7px] my-[3px]"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Calendar sync option for jobs */}
      {userId && connections.length > 0 && (
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
  );
};
