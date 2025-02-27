
import { AppLayout } from "@/components/ui/AppLayout";
import { useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { JobTemplate, Job } from "@/types/job";
import { UnassignedJobs } from "./components/UnassignedJobs";
import { CurrentJobs } from "./components/CurrentJobs";
import { JobAssignmentDialog } from "./components/JobAssignmentDialog";
import { JobDetails } from "./JobDetails";
import { TemplateLibrary } from "./components/TemplateLibrary";
import { TemplateCreation } from "./components/TemplateCreation";

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing",
  status: "ready",
  date: "2024-03-15",
  location: [151.2093, -33.8688],
  jobNumber: "PLM-001",
  title: "Water Heater Installation",
  description: "Install new water heater system",
  assignedTeam: "Red Team"
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "HVAC",
  status: "in-progress",
  date: "2024-03-14",
  location: [151.2543, -33.8688],
  jobNumber: "HVAC-001",
  title: "HVAC Maintenance",
  description: "Regular maintenance check",
  assignedTeam: "Blue Team"
}, {
  id: "3",
  customer: "Mike Brown",
  type: "Electrical",
  status: "to-invoice",
  date: "2024-03-13",
  location: [151.1943, -33.8788],
  jobNumber: "ELE-001",
  title: "Electrical Panel Upgrade",
  description: "Upgrade main electrical panel",
  assignedTeam: "Green Team"
}];

const teams = [
  { id: '1', name: 'Team Red', color: 'text-red-500' },
  { id: '2', name: 'Team Blue', color: 'text-blue-500' },
  { id: '3', name: 'Team Green', color: 'text-green-500' },
];

export default function Jobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedTemplates, setGeneratedTemplates] = useState<JobTemplate[]>([]);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssign = (job: Job) => {
    setSelectedJob(job);
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedTeam || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select both a team and date",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Job Assigned",
      description: `Job ${selectedJob?.jobNumber} has been assigned to ${teams.find(t => t.id === selectedTeam)?.name} for ${selectedDate.toLocaleDateString()}`,
    });

    setIsAssignDialogOpen(false);
    setSelectedJob(null);
    setSelectedTeam('');
    setSelectedDate(undefined);
    updateJobStatus(selectedJob!.id, 'in-progress');
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(currentJobs => currentJobs.map(job => job.id === jobId ? {
      ...job,
      status: newStatus
    } : job));
    toast({
      title: "Status Updated",
      description: `Job status has been updated successfully`
    });
  };

  const handleAttachToJob = (template: JobTemplate) => {
    toast({
      title: "Template Attached",
      description: `Template "${template.title}" has been attached to a new job. Redirecting to job creation...`
    });
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/jobs/new');
  };

  const JobsList = () => (
    <div className="space-y-6 p-6">
      <UnassignedJobs jobs={jobs} onAssign={handleAssign} />
      <CurrentJobs jobs={jobs} onStatusUpdate={updateJobStatus} />

      <JobAssignmentDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedJob={selectedJob}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onAssign={handleAssignSubmit}
        teams={teams}
      />

      <TemplateLibrary
        templates={generatedTemplates}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAttachToJob={handleAttachToJob}
      />

      <TemplateCreation
        onTemplateCreate={(template) => setGeneratedTemplates([template, ...generatedTemplates])}
      />
    </div>
  );

  return (
    <AppLayout>
      <Routes>
        <Route index element={<JobsList />} />
        <Route path=":id" element={<JobDetails />} />
      </Routes>
    </AppLayout>
  );
}
