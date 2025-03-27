
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Clock, CheckSquare } from "lucide-react";
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
  includeProgressTab?: boolean;
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
  isOnBreak,
  includeProgressTab = false
}: StandardTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <TabsTrigger value="details" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300 px-[26px] mx-0">
        Details
      </TabsTrigger>
      
      <TabsTrigger value="notes" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-500 hover:bg-slate-400 px-[29px] mx-[22px]">
        {!isMobile && <FileText className="w-4 h-4 mr-2" />}
        Notes
      </TabsTrigger>
      
      <TabsTrigger value="calendar" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300 px-[30px] mx-[5px]">
        {!isMobile && <Calendar className="w-4 h-4 mr-2" />}
        Calendar
      </TabsTrigger>
      
      <TabsTrigger value="timer" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300 px-[23px] mx-[23px]">
        {!isMobile && <Clock className="w-4 h-4 mr-2 px-0" />}
        Timer
      </TabsTrigger>

      {includeProgressTab && (
        <TabsTrigger value="progress" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300 px-[23px] mx-[23px]">
          {!isMobile && <CheckSquare className="w-4 h-4 mr-2 px-0" />}
          Progress
        </TabsTrigger>
      )}
    </>
  );
};
