
import { Calendar } from "lucide-react";
import type { Job } from "@/types/job";

interface ScheduledDateProps {
  job: Job;
}

export const ScheduledDate = ({ job }: ScheduledDateProps) => {
  const date = new Date(job.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium flex items-center mb-3">
        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
        Scheduled Date
      </h3>
      <p className="text-sm">{formattedDate}</p>
    </div>
  );
};
