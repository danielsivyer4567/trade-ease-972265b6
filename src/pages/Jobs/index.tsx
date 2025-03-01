
import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CurrentJobs } from './components/CurrentJobs';
import { UnassignedJobs } from './components/UnassignedJobs';
import { TemplateLibrary } from './components/TemplateLibrary';
import { Job, JobTemplate } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

const Jobs = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for jobs
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      customer: 'John Smith',
      type: 'Plumbing',
      status: 'in-progress',
      date: new Date().toISOString(),
      location: [151.2093, -33.8688], // Sydney coordinates
      jobNumber: 'JOB-001',
      title: 'Kitchen Sink Repair',
      address: '123 Main St, Sydney'
    },
    {
      id: '2',
      customer: 'Jane Doe',
      type: 'Electrical',
      status: 'ready',
      date: new Date().toISOString(),
      location: [144.9631, -37.8136], // Melbourne coordinates
      jobNumber: 'JOB-002',
      title: 'Ceiling Fan Installation',
      address: '456 Oak Ave, Melbourne'
    }
  ]);
  
  // Mock data for templates
  const [templates, setTemplates] = useState<JobTemplate[]>([
    {
      id: '1',
      title: 'Basic Plumbing Fix',
      description: 'Standard plumbing repair service',
      type: 'Plumbing',
      estimatedDuration: 2,
      price: 150
    },
    {
      id: '2',
      title: 'Electrical Wiring',
      description: 'Basic electrical wiring service',
      type: 'Electrical',
      estimatedDuration: 3,
      price: 200
    }
  ]);
  
  const handleStatusUpdate = (jobId: string, newStatus: Job['status']) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    toast({
      title: "Job Updated",
      description: `Job ${jobId} status changed to ${newStatus}`
    });
  };
  
  const handleAssignJob = (job: Job) => {
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'in-progress' } : j));
    toast({
      title: "Job Assigned",
      description: `Job ${job.title} has been assigned`
    });
  };
  
  const handleTemplateSelection = (template: JobTemplate) => {
    toast({
      title: "Template Selected",
      description: `Template ${template.title} has been selected`
    });
  };
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
          <Button asChild>
            <Link to="/jobs/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Job
            </Link>
          </Button>
        </div>

        <CurrentJobs 
          jobs={jobs.filter(job => job.status === 'in-progress')}
          onStatusUpdate={handleStatusUpdate}
        />

        <UnassignedJobs 
          jobs={jobs.filter(job => job.status === 'ready')}
          onAssign={handleAssignJob}
        />

        <TemplateLibrary 
          templates={templates}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAttachToJob={handleTemplateSelection}
        />
      </div>
    </AppLayout>
  );
};

export default Jobs;
