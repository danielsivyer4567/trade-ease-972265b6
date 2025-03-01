
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types/job";
import { Link } from "react-router-dom";

interface UnassignedJobsProps {
  jobs: Job[];
  onAssign: (job: Job) => void;
}

export function UnassignedJobs({ jobs, onAssign }: UnassignedJobsProps) {
  const readyJobs = jobs.filter(job => job.status === 'ready');
  
  return (
    <div className="p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Unassigned Jobs</h2>
        <div className="flex space-x-2">
          <Link to="/jobs/new-template">
            <Button variant="default">
              Create New Template
            </Button>
          </Link>
          <Link to="/jobs/new">
            <Button variant="outline">
              Create New Job
            </Button>
          </Link>
        </div>
      </div>
      
      {readyJobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No unassigned jobs</CardTitle>
            <CardDescription>
              All jobs have been assigned to teams
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readyJobs.map(job => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription>{job.customer}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{job.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">{job.jobNumber}</span>
                  <Button 
                    size="sm" 
                    onClick={() => onAssign(job)}
                  >
                    Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
