
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from '@/types/job';

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => void;
}

export const CurrentJobs: React.FC<CurrentJobsProps> = ({ jobs, onStatusUpdate }) => {
  const inProgressJobs = jobs.filter(job => job.status === 'in-progress');

  const getStatusClass = (status: Job['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'to-invoice':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (jobId: string, newStatus: Job['status']) => {
    onStatusUpdate(jobId, newStatus);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Jobs</CardTitle>
        <CardDescription>Jobs currently in progress or awaiting invoicing</CardDescription>
      </CardHeader>
      <CardContent>
        {inProgressJobs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No jobs currently in progress
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {inProgressJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden border-l-4 border-l-yellow-400">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Link to={`/jobs/${job.id}`} className="text-lg font-semibold hover:underline truncate max-w-[70%]">
                        {job.title}
                      </Link>
                      <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusClass(job.status)}`}>
                        {job.status === 'in-progress' ? 'In Progress' : 'To Invoice'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 truncate">
                      Customer: {job.customer}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Job #: {job.jobNumber}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Type: {job.type}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Team: {job.assignedTeam}</span>
                      <span>{new Date(job.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      {job.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'to-invoice')}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Mark Ready for Invoice
                        </button>
                      )}
                      
                      {job.status === 'to-invoice' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'invoiced')}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Mark as Invoiced
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
