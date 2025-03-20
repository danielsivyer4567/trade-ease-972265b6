
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ListFilter, Search, Plus } from 'lucide-react';
import { SearchQuotes } from '@/pages/Jobs/components/tabs/financials/SearchQuotes';
import { SearchBar } from './components/SearchBar';
import { Input } from '@/components/ui/input';
import { JobsList } from './components/JobsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DayDetailDrawerProps {
  selectedDay: {
    date: Date;
    jobs: Job[];
  } | null;
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJobData, setSelectedJobData] = useState<any>(null);
  const [selectedStaffMember, setSelectedStaffMember] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  if (!selectedDay) return null;
  const {
    date,
    jobs
  } = selectedDay;

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => {
    const searchLower = jobSearchQuery.toLowerCase();
    return job.title?.toLowerCase().includes(searchLower) || job.customer?.toLowerCase().includes(searchLower) || job.jobNumber?.toLowerCase().includes(searchLower) || job.type?.toLowerCase().includes(searchLower);
  });

  // Mock quotes data for the search feature
  const mockCustomerQuotes = [{
    id: "Q001",
    customerName: "John Smith",
    amount: 750
  }, {
    id: "Q002",
    customerName: "Sarah Johnson",
    amount: 1200
  }, {
    id: "Q003",
    customerName: "Mike Brown",
    amount: 950
  }];

  const handleQuoteSelect = (amount: number) => {
    console.log("Selected quote with amount:", amount);
    setShowQuoteSearch(false);
  };

  const handleToggleQuoteSearch = () => {
    setShowQuoteSearch(!showQuoteSearch);
  };

  const handleStaffSelect = (staffMember: any) => {
    setSelectedStaffMember(staffMember);
    console.log("Selected staff member:", staffMember);
  };

  const handleJobSelect = (jobData: any) => {
    setSelectedJobData(jobData);
    console.log("Selected job:", jobData);
  };

  const handleCreateJob = async () => {
    setSaving(true);
    try {
      if (!selectedJobData) {
        toast.error("Please select a job");
        setSaving(false);
        return;
      }

      // Format date and time for saving
      const appointmentDate = startDate || date;
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');
      const formattedDateTime = `${formattedDate}T${startTime}:00`;

      // Create job entry
      const jobData = {
        customer: selectedJobData.customer || "Customer Name",
        title: selectedJobData.title || `Job #${selectedJobData.jobNumber}`,
        job_number: selectedJobData.jobNumber,
        date: formattedDateTime,
        type: 'Appointment',
        assigned_team: getCurrentTeamColor(),
        status: 'scheduled',
        description: `Appointment scheduled by ${selectedStaffMember?.name || 'team member'}`
      };

      // Save to database
      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select();

      if (error) {
        console.error("Error saving appointment:", error);
        toast.error("Failed to save appointment");
      } else {
        toast.success("Appointment saved successfully");
        console.log("Saved appointment:", data);
        
        // Close the form and drawer after successful save
        setShowCreateForm(false);
        onClose();
      }
    } catch (err) {
      console.error("Error in appointment creation:", err);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  // Helper function to determine current team color from URL
  const getCurrentTeamColor = () => {
    const url = window.location.pathname;
    if (url.includes('red')) return 'red';
    if (url.includes('blue')) return 'blue';
    if (url.includes('green')) return 'green';
    return 'blue'; // Default team
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    // Initialize start date to the selected day when opening form
    if (!showCreateForm) {
      setStartDate(date);
    }
  };

  return <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 top-20 transform max-w-2xl h-auto border shadow-lg rounded-xl bg-slate-50 px-[10px] py-0 mx-auto my-0 max-h-[80vh] overflow-auto">
        <DrawerHeader className="border-b py-1">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(date, 'MMMM d, yyyy')}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-2">
          {/* Jobs for the day section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 bg-slate-300">
              <h3 className="font-medium">Scheduled Jobs ({jobs.length})</h3>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input placeholder="Search jobs..." value={jobSearchQuery} onChange={e => setJobSearchQuery(e.target.value)} className="h-8 text-sm" />
              </div>
            </div>
            
            {jobSearchQuery && filteredJobs.length === 0 ? <div className="text-center py-4 text-muted-foreground">
                No jobs found matching "{jobSearchQuery}"
              </div> : filteredJobs.length === 0 ? <div className="text-center py-4 text-muted-foreground">
                No jobs scheduled for this day
              </div> : <JobsList jobSearchQuery={jobSearchQuery} filteredJobs={filteredJobs} onJobClick={onJobClick} />}
          </div>
          
          {/* Create new appointment button */}
          {!showCreateForm ? <div className="flex justify-center mt-4 mb-4">
              <Button onClick={toggleCreateForm} className="bg-slate-500 hover:bg-slate-400 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Appointment
              </Button>
            </div> : <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">New Appointment</h3>
                <Button variant="outline" size="sm" onClick={toggleCreateForm} className="text-sm bg-slate-400 hover:bg-slate-300">
                  Cancel
                </Button>
              </div>
              
              <div className="overflow-auto">
                <div className="flex flex-col items-center">
                  {/* Search Bar Component */}
                  <SearchBar 
                    jobSearchQuery={jobSearchQuery} 
                    setJobSearchQuery={setJobSearchQuery} 
                    startDate={startDate} 
                    setStartDate={setStartDate} 
                    endDate={endDate} 
                    setEndDate={setEndDate} 
                    startTime={startTime} 
                    setStartTime={setStartTime} 
                    endTime={endTime} 
                    setEndTime={setEndTime}
                    onToggleQuoteSearch={handleToggleQuoteSearch}
                    onCreateJob={handleCreateJob}
                    onSelectJob={handleJobSelect}
                    onSelectStaff={handleStaffSelect}
                  />
                  
                  {/* Quote search section (conditionally shown) */}
                  {showQuoteSearch && <div className="max-w-md w-full mx-auto">
                      <SearchQuotes onSelectQuote={handleQuoteSelect} customerQuotes={mockCustomerQuotes} />
                    </div>}
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handleCreateJob} 
                  className="bg-slate-500 hover:bg-slate-400"
                  disabled={saving || !selectedJobData}
                >
                  {saving ? 'Saving...' : 'Save Appointment'}
                </Button>
              </div>
            </div>}
        </div>
        
        <DrawerFooter className="flex flex-row justify-between border-t gap-3 p-2">
          <Button onClick={onClose} variant="outline" className="flex-1 text-gray-950 bg-slate-400 hover:bg-slate-300">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>;
};
