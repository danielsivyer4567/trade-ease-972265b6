
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, UserPlus } from "lucide-react";
import { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";

interface UnassignedJobsProps {
  jobs: Job[];
  onAssign: (job: Job) => void;
}

export function UnassignedJobs({ jobs, onAssign }: UnassignedJobsProps) {
  const navigate = useNavigate();
  const unassignedJobs = jobs.filter(job => job.status === 'ready');

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">To be Assigned</h2>
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ListTodo className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Unassigned Jobs</span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Jobs
          </Button>
        </div>
        <div className="bg-white rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unassignedJobs.map(job => (
                <tr 
                  key={job.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{job.jobNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title || job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssign(job);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
              {unassignedJobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No jobs waiting to be assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
