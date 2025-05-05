
import { CustomerDetails } from "./CustomerDetails";
import { JobDescription } from "./JobDescription";
import { AdditionalNotes } from "./AdditionalNotes";
import type { Job } from "@/types/job";

interface LeftColumnProps {
  job: Job;
}

export const LeftColumn = ({ job }: LeftColumnProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <CustomerDetails job={job} />
      <JobDescription description={job.description} />
      <AdditionalNotes />
    </div>
  );
};
