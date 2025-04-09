
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

// Sample job data - will be replaced with real database data later
const jobs = [
  { id: 1, jobId: 'JOB-2024-001', type: 'Renovation', client: 'Smith Family', value: '$18,500', date: '2024-04-08', status: 'completed' },
  { id: 2, jobId: 'JOB-2024-002', type: 'New Construction', client: 'Johnson Residence', value: '$42,000', date: '2024-04-07', status: 'in progress' },
  { id: 3, jobId: 'JOB-2024-003', type: 'Remodel', client: 'Davis Commercial', value: '$15,600', date: '2024-04-06', status: 'completed' },
  { id: 4, jobId: 'JOB-2024-004', type: 'Repair', client: 'Miller Property', value: '$3,250', date: '2024-04-05', status: 'completed' },
  { id: 5, jobId: 'JOB-2024-005', type: 'Installation', client: 'Thompson Office', value: '$8,750', date: '2024-04-04', status: 'completed' },
];

const RecentTrades = () => {
  const { toast } = useToast();
  
  const handleNewJob = () => {
    toast({
      title: "Create New Job",
      description: "Redirecting you to the job creation page.",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Jobs</h2>
        <Button onClick={handleNewJob}>New Job</Button>
      </div>
      
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Job ID</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Client</th>
                  <th className="text-right py-2 font-medium">Value</th>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-center py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="py-3 font-medium">{job.jobId}</td>
                    <td className="py-3">{job.type}</td>
                    <td className="py-3">{job.client}</td>
                    <td className="py-3 text-right">{job.value}</td>
                    <td className="py-3">{job.date}</td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className={`capitalize ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        job.status === 'in progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {job.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentTrades;
