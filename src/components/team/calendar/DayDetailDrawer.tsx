import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { SearchQuotes } from '@/pages/Jobs/components/tabs/financials/SearchQuotes';
import { SearchBar } from './components/SearchBar';
import { JobsList } from './components/JobsList';

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

  if (!selectedDay) return null;
  
  const {
    date,
    jobs
  } = selectedDay;

  // Mock quotes data for the search feature
  const mockCustomerQuotes = [
    {
      id: "Q001",
      customerName: "John Smith",
      amount: 750
    },
    {
      id: "Q002",
      customerName: "Sarah Johnson",
      amount: 1200
    },
    {
      id: "Q003",
      customerName: "Mike Brown",
      amount: 950
    }
  ];

  const filteredJobs = jobSearchQuery ? jobs.filter(job => 
    job.title?.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
    job.jobNumber.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
    job.customer.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
    job.type.toLowerCase().includes(jobSearchQuery.toLowerCase())
  ) : jobs;

  const handleQuoteSelect = (amount: number) => {
    console.log("Selected quote with amount:", amount);
    // Here you would typically create a job from the quote
    // For now, we'll just close the quote search
    setShowQuoteSearch(false);
    // Show a toast notification that a job has been created
  };

  const handleToggleQuoteSearch = () => {
    setShowQuoteSearch(!showQuoteSearch);
  };

  const handleCreateJob = () => {
    console.log("Create new job", {
      date: format(date, 'yyyy-MM-dd'),
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      startTime,
      endTime
    });
    // Here you would typically create a new job
  };

  return (
    <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 top-1/2 transform -translate-y-1/2 max-w-2xl mx-auto rounded-lg h-auto border shadow-lg">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            New Appointment
          </DrawerTitle>
        </DrawerHeader>
        
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
            />
            
            {/* Quote Search section */}
            {showQuoteSearch && (
              <div className="max-w-md w-full mx-auto">
                <SearchQuotes 
                  onSelectQuote={handleQuoteSelect} 
                  customerQuotes={mockCustomerQuotes} 
                />
              </div>
            )}
            
            {/* Jobs List Component */}
            {!showQuoteSearch && filteredJobs.length > 0 && (
              <JobsList 
                jobSearchQuery={jobSearchQuery} 
                filteredJobs={filteredJobs} 
                onJobClick={onJobClick} 
              />
            )}
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-between border-t gap-4 p-4">
          <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
          <Button onClick={handleCreateJob} className="flex-1">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
