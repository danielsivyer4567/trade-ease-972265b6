
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UnassignedJobsList } from "../UnassignedJobsList";
import { Job } from "@/types/job";

interface UnassignedJobsTabProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
  onAssign: (job: Job) => void;
}

export function UnassignedJobsTab({ jobs, onJobClick, onAssign }: UnassignedJobsTabProps) {
  return (
    <>
      <Separator className="h-[2px] bg-gray-400 my-[8px]" />
      <SectionHeader title="Unassigned Jobs" className="ml-0 mt-2 mb-2" />
      <UnassignedJobsList 
        jobs={jobs}
        onJobClick={onJobClick}
        onAssign={onAssign}
      />
    </>
  );
}
