import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CurrentJobs from './components/CurrentJobs';
import UnassignedJobs from './components/UnassignedJobs';
import TemplateLibrary from './components/TemplateLibrary';
// Correct the import for JobDetails
import JobDetails from './JobDetails';

const Jobs = () => {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
          <Button asChild>
            <Link to="/jobs/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Job
            </Link>
          </Button>
        </div>

        <CurrentJobs />

        <UnassignedJobs />

        <TemplateLibrary />
      </div>
    </AppLayout>
  );
};

export default Jobs;
