
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Clock } from "lucide-react";
import { JobDetailsTab } from "./JobDetailsTab";
import { JobNotesTab } from "./JobNotesTab";
import { JobCalendarTab } from "./JobCalendarTab";
import { JobTimerTab } from "./JobTimerTab";
import type { Job } from "@/types/job";

interface StandardTabsProps {
  job: Job;
  jobTimer: number;
  jobNotes: string;
  setJobNotes: (notes: string) => void;
  locationHistory: Array<{timestamp: number; coords: [number, number]}>;
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
  return (
    <>
      <TabsTrigger value="details" className="min-w-[100px] whitespace-nowrap">Details</TabsTrigger>
      <TabsTrigger value="notes" className="min-w-[100px] whitespace-nowrap">
        <FileText className="w-4 h-4 mr-2" />
        Notes
      </TabsTrigger>
      <TabsTrigger value="calendar" className="min-w-[100px] whitespace-nowrap">
        <Calendar className="w-4 h-4 mr-2" />
        Calendar
      </TabsTrigger>
      <TabsTrigger value="timer" className="min-w-[100px] whitespace-nowrap">
        <Clock className="w-4 h-4 mr-2" />
        Timer
      </TabsTrigger>

      <JobDetailsTab job={job} />
      <JobNotesTab notes={jobNotes} setNotes={setJobNotes} />
      <JobCalendarTab job={job} />
      <JobTimerTab 
        jobTimer={jobTimer}
        hasLocationPermission={hasLocationPermission}
        handleTimerToggle={handleTimerToggle}
        handleBreakToggle={handleBreakToggle}
        isTimerRunning={isTimerRunning}
        isOnBreak={isOnBreak}
        locationHistory={locationHistory}
      />
    </>
  );
};
