
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';

export function JobDetails() {
  const { id } = useParams();
  
  return (
    <div className="space-y-6 p-6">
      <JobHeader jobId={id || ''} />
      <JobTabs jobId={id || ''} />
    </div>
  );
}
