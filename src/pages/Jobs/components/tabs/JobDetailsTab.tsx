
import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import { LeftColumn } from "./job-details/LeftColumn";
import { RightColumn } from "./job-details/RightColumn";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobDetailsTabProps {
  job: Job;
}

export const JobDetailsTab = ({
  job
}: JobDetailsTabProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsContent value="details" className="p-3 sm:p-6 mb-6 sm:mb-16">
      <div className="flex flex-col space-y-6">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-8'} w-full max-w-full`}>
          <LeftColumn job={job} />
          <RightColumn job={job} />
        </div>
      </div>
    </TabsContent>
  );
};
