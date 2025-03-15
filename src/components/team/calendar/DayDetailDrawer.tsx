
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { SearchQuotes } from '@/pages/Jobs/components/tabs/financials/SearchQuotes';
import { SearchBar } from './components/SearchBar';

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

  const handleCreateJob = () => {
    console.log("Create new job", {
      date: format(date, 'yyyy-MM-dd'),
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      startTime,
      endTime
    });
  };

  return <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 top-20 transform max-w-2xl h-auto border shadow-lg rounded-xl bg-slate-50 px-[10px] py-0 mx-auto my-0 max-h-[45vh] overflow-auto">
        <DrawerHeader className="border-b py-1">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            New Appointment
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="overflow-auto">
          <div className="flex flex-col items-center">
            {/* Search Bar Component - This is the main content we want to show */}
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
            
            {/* We're not showing these sections by default to make the menu shorter */}
            {showQuoteSearch && (
              <div className="max-w-md w-full mx-auto">
                <SearchQuotes onSelectQuote={handleQuoteSelect} customerQuotes={mockCustomerQuotes} />
              </div>
            )}
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-between border-t gap-3 p-2">
          <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
          <Button onClick={handleCreateJob} className="flex-1">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>;
};
