
import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { Job } from '@/types/job';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Create a job object with the id and other required properties to pass to the components
  const job: Job = {
    id: id || '',
    customer: { id: '', name: '' },
    type: '',
    status: 'Pending',
    date: new Date().toISOString(),
    address: '',
    description: ''
  };

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
