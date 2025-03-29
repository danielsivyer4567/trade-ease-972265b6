
import React from 'react';
import JobMap from '@/components/JobMap';
import CustomPropertyMap from '@/components/property-map';
import type { Job } from '@/types/job';

interface JobMapViewProps {
  job: Job;
}

export const JobMapView = ({ job }: JobMapViewProps) => {
  // Safely check if job has boundary data
  const hasBoundaries = job.boundaries && job.boundaries.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="h-[300px] md:h-[400px] w-full">
        {hasBoundaries ? (
          <CustomPropertyMap
            boundaries={job.boundaries || []}
            title={`Property Boundaries - ${job.title}`}
            description={`Location details for job #${job.id}`}
            centerPoint={[job.location[0], job.location[1]]}
            measureMode={false}
          />
        ) : (
          <JobMap 
            center={[job.location[0], job.location[1]]} 
            zoom={15} 
            markers={[{
              position: [job.location[1], job.location[0]],
              title: job.title
            }]} 
          />
        )}
      </div>
    </div>
  );
};
