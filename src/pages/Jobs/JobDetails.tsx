
import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <JobHeader jobId={id || ''} />
        <JobTabs jobId={id || ''} />
      </div>
    </AppLayout>
  );
};

export default JobDetails;
