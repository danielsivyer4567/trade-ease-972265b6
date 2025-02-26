
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";

interface JobHeaderProps {
  job: Job;
}

export const JobHeader = ({ job }: JobHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <Button variant="outline" onClick={() => navigate("/jobs")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
      <span className={`px-3 py-1 rounded-full text-sm ${
        job.status === "ready" ? "bg-yellow-100 text-yellow-800" :
        job.status === "in-progress" ? "bg-blue-100 text-blue-800" :
        job.status === "to-invoice" ? "bg-purple-100 text-purple-800" :
        "bg-green-100 text-green-800"
      }`}>
        {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    </div>
  );
};
