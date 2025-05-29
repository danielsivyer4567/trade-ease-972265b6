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
      <div className="absolute bottom-6 left-0 right-0 px-1 z-10">
        {jobsForDate.slice(0, 2).map((job, idx) => (
          <div 
            key={`${job.id}-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              onJobClick(job.id, e);
            }}
            className={`text-[10px] truncate rounded mb-1 px-1 py-[2px] cursor-pointer hover:opacity-80 ${getColorClass(teamColor)} text-white shadow-sm`}
            title={job.title || job.jobNumber}
          >
            {job.title || `Job #${job.jobNumber}`}
          </div>
        ))}
        {jobsForDate.length > 2 && (
          <div className="text-[10px] text-center text-gray-600 font-semibold">
            +{jobsForDate.length - 2} more
          </div>
        )}
      </div>
      
      <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-sm">
        {jobsForDate.length}
      </div>
    </>
  );
};
