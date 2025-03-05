import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, JobTemplate } from "@/types/job";
import { Link, useNavigate } from "react-router-dom";
import { TemplateLibrary } from "./TemplateLibrary";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UnassignedJobsProps {
  jobs: Job[];
  onAssign: (job: Job) => void;
}
export function UnassignedJobs({
  jobs,
  onAssign
}: UnassignedJobsProps) {
  const navigate = useNavigate();
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
    toast({
      title: "Template selected",
      description: `Selected template: ${template.title}`
    });
    setShowTemplateSearch(false);
  };

  return <div className="mb-4 px-0">
      <Tabs defaultValue="unassigned-jobs" className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 ml-4 mt-4">
            <Button variant="outline" size="icon" className="rounded-md border border-gray-300" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <TabsList className="flex gap-2 mr-4">
            <TabsTrigger 
              value="unassigned-jobs" 
              className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
            >
              Unassigned Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="job-templates" 
              className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
            >
              Job Templates
            </TabsTrigger>
            <TabsTrigger 
              value="service-reminders" 
              className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
            >
              Service Reminders
            </TabsTrigger>
            <TabsTrigger 
              value="recurring-jobs" 
              className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
            >
              Recurring Jobs
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex space-x-2 ml-4 mb-4">
          <Link to="/jobs/new-template">
            <Button variant="default" className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A]">
              Create New Template
            </Button>
          </Link>
          <Button variant="default" onClick={() => setShowTemplateSearch(true)} className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A]">
            Create New Job
          </Button>
        </div>

        <TabsContent value="unassigned-jobs">
          <SectionHeader title="Unassigned Jobs" className="ml-4 mt-2 mb-2" />
          <Separator className="h-[2px] bg-gray-400 my-[8px]" />
          
          {showTemplateSearch ? <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Select a Template</h3>
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
                    <div className="flex justify-between items-center p-2 my-[61px]">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium">{job.title}</h3>
                            <p className="text-xs text-gray-500">{job.customer}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2">{job.jobNumber}</span>
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
        </TabsContent>

        <TabsContent value="job-templates">
          <SectionHeader title="Job Templates" className="ml-4 mt-2 mb-2" />
          <Separator className="h-[2px] bg-gray-400 my-[8px]" />
          <TemplateLibrary templates={templates} searchQuery={searchQuery} onSearchChange={setSearchQuery} onAttachToJob={handleTemplateSelection} />
        </TabsContent>

        <TabsContent value="service-reminders">
          <SectionHeader title="Service Reminders" className="ml-4 mt-2 mb-2" />
          <Separator className="h-[2px] bg-gray-400 my-[8px]" />
          <Card>
            <CardHeader>
              <CardTitle>Service Reminders</CardTitle>
              <CardDescription>
                Set up recurring service reminders for your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No service reminders have been set up yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring-jobs">
          <SectionHeader title="Recurring Jobs" className="ml-4 mt-2 mb-2" />
          <Separator className="h-[2px] bg-gray-400 my-[8px]" />
          <Card>
            <CardHeader>
              <CardTitle>Recurring Jobs</CardTitle>
              <CardDescription>
                Set up jobs that automatically repeat on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No recurring jobs have been set up yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
