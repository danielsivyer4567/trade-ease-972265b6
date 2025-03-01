
import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Create a job object with the id to pass to the components
  const job = { id: id || '' };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <JobHeader job={job} />
        <JobTabs job={job} />
      </div>
    </AppLayout>
  );
};

export default JobDetails;
