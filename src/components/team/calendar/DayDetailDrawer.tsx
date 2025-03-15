
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
import { Calendar, Clock, MapPin, User, Plus, Search, ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchQuotes } from '@/pages/Jobs/components/tabs/financials/SearchQuotes';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuoteSearch, setShowQuoteSearch] = useState(false);
  
  if (!selectedDay) return null;
  
  const { date, jobs } = selectedDay;
  
  // Mock quotes data for the search feature
  const mockCustomerQuotes = [
    { id: "Q001", customerName: "John Smith", amount: 750 },
    { id: "Q002", customerName: "Sarah Johnson", amount: 1200 },
    { id: "Q003", customerName: "Mike Brown", amount: 950 }
  ];

  const filteredJobs = searchQuery 
    ? jobs.filter(job => 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;

  const handleQuoteSelect = (amount: number) => {
    console.log("Selected quote with amount:", amount);
    // Here you would typically create a job from the quote
    // For now, we'll just close the quote search
    setShowQuoteSearch(false);
    // Show a toast notification that a job has been created
  };
  
  return (
    <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] bg-slate-300">
        <DrawerHeader className="bg-slate-300">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            Jobs for {format(date, 'MMMM d, yyyy')}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 overflow-auto bg-slate-300">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-white"
                />
              </div>
              <Button 
                onClick={() => setShowQuoteSearch(!showQuoteSearch)} 
                variant="secondary"
                className="shrink-0"
              >
                <ClipboardList className="mr-1" />
                Quotes
              </Button>
              <Button 
                onClick={() => console.log("Create new job for", format(date, 'yyyy-MM-dd'))} 
                className="shrink-0"
              >
                <Plus className="mr-1" />
                Add Job
              </Button>
            </div>
            
            {showQuoteSearch && (
              <div className="bg-white p-3 rounded-lg">
                <SearchQuotes 
                  onSelectQuote={handleQuoteSelect} 
                  customerQuotes={mockCustomerQuotes}
                />
              </div>
            )}
            
            {searchQuery && filteredJobs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground bg-white rounded-lg">
                No jobs found matching "{searchQuery}"
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground bg-white rounded-lg">
                No jobs scheduled for this day
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map(job => (
                  <div 
                    key={job.id}
                    onClick={(e) => onJobClick(job.id, e)}
                    className="border p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors bg-white"
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
        
        <DrawerFooter className="bg-slate-300">
          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
