
import JobMap from '@/components/JobMap';
import type { Job } from '@/types/job';

interface JobMapViewProps {
  job: Job;
}

export const JobMapView = ({ job }: JobMapViewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="h-[300px] w-full">
        <JobMap 
          center={[job.location[0], job.location[1]]} 
          zoom={15} 
          markers={[{
            position: [job.location[1], job.location[0]],
            title: job.title
          }]} 
        />
      </div>
    </div>
  );
};
