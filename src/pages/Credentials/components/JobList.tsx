import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Mock data with compliance status
const mockJobs = [
  { id: 'job1', name: 'Main St Tower Project', location: '123 Main St', status: 'Compliant' }, // Compliant
  { id: 'job2', name: 'Downtown Renovation', location: '456 Central Ave', status: 'Incomplete' }, // Incomplete
  { id: 'job3', name: 'Suburban Office Build', location: '789 Suburb Ln', status: 'Pending' }, // Pending/Unknown
];

// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Compliant': return 'bg-green-500';
    case 'Incomplete': return 'bg-red-500';
    case 'Pending': return 'bg-yellow-400';
    default: return 'bg-gray-400';
  }
};

export const JobList = () => {
  return (
    // Added subtle background and border
    <Card className="bg-slate-50 border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Jobs / Sites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockJobs.map((job) => (
          // Styling for drop target indication on hover
          <div 
            key={job.id} 
            className="p-3 border border-slate-300 rounded bg-white shadow-xs hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-slate-800">{job.name}</p>
              <p className="text-sm text-slate-500">{job.location}</p>
            </div>
            {/* Status Indicator Dot */}
            <span 
              title={`Status: ${job.status}`}
              className={`w-3 h-3 rounded-full ${getStatusColor(job.status)} flex-shrink-0 ml-2`}
            />
          </div>
        ))}
         {/* Add Job Button Placeholder - styled */}
         <div className="p-3 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-400 cursor-pointer mt-3 transition-colors">
            <span>+ Add Job/Site</span>
         </div>
      </CardContent>
    </Card>
  );
}; 