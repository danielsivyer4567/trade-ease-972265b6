
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Clock } from "lucide-react";
import { JobDetailsTab } from "./JobDetailsTab";
import { JobNotesTab } from "./JobNotesTab";
import { JobCalendarTab } from "./JobCalendarTab";
import { JobTimerTab } from "./JobTimerTab";
import type { Job } from "@/types/job";
import { useIsMobile } from "@/hooks/use-mobile";

interface StandardTabsProps {
  job: Job;
  jobTimer: number;
  jobNotes: string;
  setJobNotes: (notes: string) => void;
  locationHistory: Array<{
    timestamp: number;
    coords: [number, number];
  }>;
  hasLocationPermission: boolean | null;
  handleTimerToggle: () => void;
  handleBreakToggle: () => void;
  isTimerRunning: boolean;
  isOnBreak: boolean;
}

export const StandardTabs = ({
  job,
  jobTimer,
  jobNotes,
  setJobNotes,
  locationHistory,
  hasLocationPermission,
  handleTimerToggle,
  handleBreakToggle,
  isTimerRunning,
  isOnBreak
}: StandardTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <TabsTrigger 
        value="details" 
        className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300"
      >
        Details
      </TabsTrigger>
      
      <TabsTrigger 
        value="notes" 
        className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300"
      >
        {!isMobile && <FileText className="w-4 h-4 mr-2" />}
        Notes
      </TabsTrigger>
      
      <TabsTrigger 
        value="calendar" 
        className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300"
      >
        {!isMobile && <Calendar className="w-4 h-4 mr-2" />}
        Calendar
      </TabsTrigger>
      
      <TabsTrigger 
        value="timer" 
        className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300"
      >
        {!isMobile && <Clock className="w-4 h-4 mr-2" />}
        Timer
      </TabsTrigger>

      <TabsContent value="details" className="mt-4 px-1 relative">
        <JobDetailsTab job={job} />
      </TabsContent>
      
      <TabsContent value="notes" className="mt-4 px-1 relative">
        <JobNotesTab notes={jobNotes} setNotes={setJobNotes} />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-4 px-1 relative">
        <JobCalendarTab job={job} />
      </TabsContent>
      
      <TabsContent value="timer" className="mt-4 px-1 relative">
        <JobTimerTab 
          jobTimer={jobTimer} 
          hasLocationPermission={hasLocationPermission} 
          handleTimerToggle={handleTimerToggle} 
          handleBreakToggle={handleBreakToggle} 
          isTimerRunning={isTimerRunning} 
          isOnBreak={isOnBreak} 
          locationHistory={locationHistory} 
        />
      </TabsContent>
    </>
  );
};
