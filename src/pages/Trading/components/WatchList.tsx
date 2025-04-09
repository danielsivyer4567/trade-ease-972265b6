
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Sample job monitoring data - will be replaced with real database data later
const initialJobs = [
  { jobId: 'JOB-2023-001', description: 'Kitchen Renovation', status: 'In Progress', nextAction: 'Material Delivery', dueDate: '2024-04-15', priority: 'High' },
  { jobId: 'JOB-2023-002', description: 'Bathroom Remodel', status: 'Scheduled', nextAction: 'Initial Consultation', dueDate: '2024-04-18', priority: 'Medium' },
  { jobId: 'JOB-2023-003', description: 'Deck Construction', status: 'Quote Sent', nextAction: 'Follow-up Call', dueDate: '2024-04-12', priority: 'Low' },
  { jobId: 'JOB-2023-004', description: 'Basement Finishing', status: 'In Progress', nextAction: 'Drywall Installation', dueDate: '2024-04-20', priority: 'High' },
  { jobId: 'JOB-2023-005', description: 'Fence Installation', status: 'Scheduled', nextAction: 'Material Order', dueDate: '2024-04-25', priority: 'Medium' },
];

const WatchList = () => {
  const [monitoredJobs, setMonitoredJobs] = useState(initialJobs);
  const [newJobId, setNewJobId] = useState('');
  
  const handleAddJob = () => {
    if (!newJobId) return;
    
    // In a real app, we would validate the job ID and fetch its data
    // For now, let's just add a dummy entry
    const mockNewJob = {
      jobId: newJobId,
      description: `New Job ${newJobId}`,
      status: 'Pending',
      nextAction: 'Initial Assessment',
      dueDate: '2024-04-30',
      priority: 'Medium'
    };
    
    setMonitoredJobs([...monitoredJobs, mockNewJob]);
    setNewJobId('');
    toast.success(`Added job ${newJobId} to monitoring list`);
  };
  
  const handleRemoveJob = (jobId) => {
    setMonitoredJobs(monitoredJobs.filter(item => item.jobId !== jobId));
    toast.success(`Removed job ${jobId} from monitoring list`);
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Job Monitoring</CardTitle>
            <CardDescription>Track important jobs and their status</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Input 
              value={newJobId} 
              onChange={(e) => setNewJobId(e.target.value)} 
              placeholder="Add job ID..." 
              className="w-24 md:w-32"
            />
            <Button size="sm" onClick={handleAddJob}>
              <Plus className="h-4 w-4 mr-1" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Job ID</th>
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Next Action</th>
                <th className="text-left py-2 font-medium">Due Date</th>
                <th className="text-right py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {monitoredJobs.map((job) => (
                <tr key={job.jobId} className="border-b">
                  <td className="py-3 font-medium">{job.jobId}</td>
                  <td className="py-3">{job.description}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      job.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      job.status === 'Quote Sent' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3">{job.nextAction}</td>
                  <td className="py-3">{job.dueDate}</td>
                  <td className="py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => handleRemoveJob(job.jobId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchList;
