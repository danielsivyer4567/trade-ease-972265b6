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
  return <>
      <TabsTrigger value="details" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        Details
      </TabsTrigger>
      
      <TabsTrigger value="notes" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-200 hover:bg-slate-100">
        {!isMobile && <FileText className="w-4 h-4 mr-2" />}
        Notes
      </TabsTrigger>
      
      <TabsTrigger value="calendar" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <Calendar className="w-4 h-4 mr-2" />}
        Calendar
      </TabsTrigger>
      
      <TabsTrigger value="timer" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <Clock className="w-4 h-4 mr-2" />}
        Timer
      </TabsTrigger>
    </>;
};