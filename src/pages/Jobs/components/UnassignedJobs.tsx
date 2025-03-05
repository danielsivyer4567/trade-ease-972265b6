import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, JobTemplate } from "@/types/job";
import { Link } from "react-router-dom";
import { TemplateLibrary } from "./TemplateLibrary";
import { useToast } from "@/hooks/use-toast";

interface UnassignedJobsProps {
  jobs: Job[];
  onAssign: (job: Job) => void;
}

export function UnassignedJobs({
  jobs,
  onAssign
}: UnassignedJobsProps) {
  const readyJobs = jobs.filter(job => job.status === 'ready');
  const {
    toast
  } = useToast();

  // Template search state
  const [showTemplateSearch, setShowTemplateSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample templates - in a real app, these would come from an API or database
  const templates: JobTemplate[] = [{
    id: "1",
    title: "Basic Plumbing Fix",
    description: "Standard plumbing repair service",
    type: "Plumbing",
    estimatedDuration: 2,
    price: 150,
    materials: ["Pipes", "Fixtures", "Sealant"],
    category: "Residential"
  }, {
    id: "2",
    title: "Electrical Wiring",
    description: "Basic electrical wiring service",
    type: "Electrical",
    estimatedDuration: 3,
    price: 200,
    materials: ["Wires", "Switches", "Junction boxes"],
    category: "Commercial"
  }, {
    id: "3",
    title: "Bathroom Renovation",
    description: "Complete bathroom renovation",
    type: "Renovation",
    estimatedDuration: 40,
    price: 5000,
    materials: ["Tiles", "Fixtures", "Pipes", "Paint"],
    category: "Residential"
  }];

  const handleTemplateSelection = (template: JobTemplate) => {
    // In a real app, this would create a new job based on the template
    // and navigate to the job details or edit page
    toast({
      title: "Template selected",
      description: `Selected template: ${template.title}`
    });
    setShowTemplateSearch(false);
  };

  return <div className="p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        
        <div className="flex space-x-2 px-[240px]">
          <Link to="/jobs/new-template">
            <Button variant="default" className="mx-0 my-0 rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A]">
              Create New Template
            </Button>
          </Link>
          <Button 
            variant="default" 
            onClick={() => setShowTemplateSearch(true)} 
            className="mx-0 my-0 rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A]"
          >
            Create New Job
          </Button>
        </div>
      </div>
      
      {showTemplateSearch ? <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Select a Template</h3>
            <Button variant="ghost" onClick={() => setShowTemplateSearch(false)}>
              Close
            </Button>
          </div>
          <TemplateLibrary templates={templates} searchQuery={searchQuery} onSearchChange={setSearchQuery} onAttachToJob={handleTemplateSelection} />
        </div> : readyJobs.length === 0 ? <Card>
            <CardHeader>
              <CardTitle>No unassigned jobs</CardTitle>
              <CardDescription>
                All jobs have been assigned to teams
              </CardDescription>
            </CardHeader>
          </Card> : <div className="space-y-2">
            {readyJobs.map(job => <Card key={job.id} className="w-full">
                <div className="flex justify-between items-center p-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.customer}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-3">{job.jobNumber}</span>
                        <Button size="sm" onClick={() => onAssign(job)}>
                          Assign
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs mt-1 line-clamp-1">{job.description}</p>
                  </div>
                </div>
              </Card>)}
          </div>}
    </div>;
}
