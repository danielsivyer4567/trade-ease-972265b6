
import React from 'react';
import { Job } from '@/types/job';

interface JobsDisplayProps {
  jobsForDate: Job[];
  teamColor: string;
  onJobClick: (jobId: string, e: React.MouseEvent) => void;
}

export const JobsDisplay: React.FC<JobsDisplayProps> = ({ 
  jobsForDate, 
  teamColor,
  onJobClick 
}) => {
  if (!jobsForDate || jobsForDate.length === 0) return null;
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <>
      <div className="absolute bottom-5 left-0 right-0 px-1">
        {jobsForDate.slice(0, 2).map((job, idx) => (
          <div 
            key={`${job.id}-${idx}`}
            onClick={(e) => onJobClick(job.id, e)}
            className={`text-[9px] truncate rounded mb-[2px] px-1 cursor-pointer hover:opacity-80 ${getColorClass(teamColor)} text-white`}
            title={job.title || job.jobNumber}
          >
            {job.title || `Job #${job.jobNumber}`}
          </div>
        ))}
        {jobsForDate.length > 2 && (
          <div className="text-[9px] text-center text-gray-600 font-semibold">
            +{jobsForDate.length - 2} more
          </div>
        )}
      </div>
      
      <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {jobsForDate.length}
      </div>
    </>
  );
};
