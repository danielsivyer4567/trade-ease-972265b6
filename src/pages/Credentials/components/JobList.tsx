import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Placeholder data - replace with actual data fetching
const mockJobs = [
  { id: 'job1', name: 'Main St Tower Project', location: '123 Main St' },
  { id: 'job2', name: 'Downtown Renovation', location: '456 Central Ave' },
  { id: 'job3', name: 'Suburban Office Build', location: '789 Suburb Ln' },
];

export const JobList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs / Sites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockJobs.map((job) => (
          <div key={job.id} className="p-2 border rounded">
            <p className="font-medium">{job.name}</p>
            <p className="text-sm text-gray-600">{job.location}</p>
          </div>
        ))}
         {/* Add Job Button Placeholder */}
         <div className="p-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer mt-2">
            <span className="text-gray-500">+ Add Job/Site</span>
         </div>
      </CardContent>
    </Card>
  );
}; 