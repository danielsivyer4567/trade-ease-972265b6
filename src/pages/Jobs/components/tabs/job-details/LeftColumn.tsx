
import { CustomerDetails } from "./CustomerDetails";
import { JobDescription } from "./JobDescription";
import { AdditionalNotes } from "./AdditionalNotes";
import type { Job } from "@/types/job";

interface LeftColumnProps {
  job: Job;
}

export const LeftColumn = ({ job }: LeftColumnProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <CustomerDetails job={job} />
      <JobDescription description={job.description} />
      <AdditionalNotes />
    </div>
  );
};
