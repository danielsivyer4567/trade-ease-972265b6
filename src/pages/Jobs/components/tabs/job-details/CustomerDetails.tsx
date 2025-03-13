
import { User } from "lucide-react";
import type { Job } from "@/types/job";

interface CustomerDetailsProps {
  job: Job;
}

export const CustomerDetails = ({ job }: CustomerDetailsProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium flex items-center mb-3">
        <User className="mr-2 h-5 w-5 text-gray-500" />
        Customer Details
      </h3>
      <div className="space-y-2">
        <p className="text-sm"><span className="font-semibold">Name:</span> {job.customer}</p>
        <p className="text-sm"><span className="font-semibold">Job Number:</span> {job.jobNumber}</p>
        <p className="text-sm"><span className="font-semibold">Job Type:</span> {job.type}</p>
        <p className="text-sm"><span className="font-semibold">Assigned Team:</span> {job.assignedTeam}</p>
      </div>
    </div>
  );
};
