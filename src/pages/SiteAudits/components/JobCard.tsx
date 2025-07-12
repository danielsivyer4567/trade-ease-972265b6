
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onJobClick: (jobId: string) => void;
  onAssign: (job: Job) => void;
}

export function JobCard({ job, onJobClick, onAssign }: JobCardProps) {
  return (
    <Card key={job.id} className="w-full bg-neutral-50 hover:bg-neutral-100 transition-colors">
      <div className="flex justify-between items-center p-4">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => onJobClick(job.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{job.title}</h3>
              <p className="text-xs text-gray-500">{job.customer}</p>
            </div>
            <div className="text-xs font-medium mr-2">{job.jobNumber}</div>
          </div>
          <p className="text-xs mt-1 line-clamp-1">{job.description}</p>
        </div>
        <Button 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent job click event
            onAssign(job);
          }} 
          className="bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
        >
          Assign
        </Button>
      </div>
    </Card>
  );
}
