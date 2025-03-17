
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Job } from "@/types/job";
import { JobCard } from "./JobCard";

interface UnassignedJobsListProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
  onAssign: (job: Job) => void;
}

export function UnassignedJobsList({ jobs, onJobClick, onAssign }: UnassignedJobsListProps) {
  const readyJobs = jobs.filter(job => job.status === 'ready');

  if (readyJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No unassigned jobs</CardTitle>
          <CardDescription>
            All jobs have been assigned to teams
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {readyJobs.map(job => (
        <JobCard 
          key={job.id} 
          job={job} 
          onJobClick={onJobClick} 
          onAssign={onAssign} 
        />
      ))}
    </div>
  );
}
