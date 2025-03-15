
import React from 'react';
import { Job } from '@/types/job';
import { Clock, MapPin, User } from 'lucide-react';

interface JobsListProps {
  jobSearchQuery: string;
  filteredJobs: Job[];
  onJobClick: (jobId: string, e: React.MouseEvent) => void;
}

export const JobsList: React.FC<JobsListProps> = ({ 
  jobSearchQuery, 
  filteredJobs, 
  onJobClick 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg mt-4 w-full max-w-4xl">
      <h3 className="font-medium mb-2">Jobs for this day</h3>
      {jobSearchQuery && filteredJobs.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No jobs found matching "{jobSearchQuery}"
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No jobs scheduled for this day
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <div 
              key={job.id}
              onClick={(e) => onJobClick(job.id, e)}
              className="border p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <h3 className="font-medium">{job.title || `Job #${job.jobNumber}`}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{job.customer}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{job.type}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1 col-span-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Coordinates: {job.location.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
