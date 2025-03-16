
import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import { LeftColumn } from "./job-details/LeftColumn";
import { RightColumn } from "./job-details/RightColumn";

interface JobDetailsTabProps {
  job: Job;
}

export const JobDetailsTab = ({ job }: JobDetailsTabProps) => {
  return (
    <TabsContent value="details" className="space-y-8 p-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-full">
        <LeftColumn job={job} />
        <RightColumn job={job} />
      </div>
    </TabsContent>
  );
};
