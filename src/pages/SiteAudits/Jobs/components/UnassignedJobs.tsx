
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { JobsHeader } from "./JobsHeader";
import { UnassignedJobsTab } from "./tabs/UnassignedJobsTab";
import { JobTemplatesTab } from "./tabs/JobTemplatesTab";
import { ServiceRemindersTab } from "./tabs/ServiceRemindersTab";
import { RecurringJobsTab } from "./tabs/RecurringJobsTab";

interface UnassignedJobsProps {
  jobs: Job[];
  onAssign: (job: Job) => void;
}

export function UnassignedJobs({ jobs, onAssign }: UnassignedJobsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="mb-4 px-0">
      <Tabs defaultValue="unassigned-jobs" className="mt-2">
        <JobsHeader />
        
        <TabsContent value="unassigned-jobs" className="bg-slate-300">
          <UnassignedJobsTab 
            jobs={jobs}
            onJobClick={handleJobClick}
            onAssign={onAssign}
          />
        </TabsContent>

        <TabsContent value="job-templates">
          <JobTemplatesTab />
        </TabsContent>

        <TabsContent value="service-reminders">
          <ServiceRemindersTab />
        </TabsContent>

        <TabsContent value="recurring-jobs">
          <RecurringJobsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
