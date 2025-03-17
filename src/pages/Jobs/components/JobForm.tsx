import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ListChecks, Users } from "lucide-react";
import { JobNumberGenerator } from "./JobNumberGenerator";
import { JobDateSelector } from "./JobDateSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Job, JobTemplate } from "@/types/job";

interface JobFormProps {
  onShowTemplateSearch: () => void;
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
  title: string;
  setTitle: (title: string) => void;
  customer: string;
  setCustomer: (customer: string) => void;
  description: string;
  setDescription: (description: string) => void;
  type: string;
  setType: (type: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateUndecided: boolean;
  setDateUndecided: (undecided: boolean) => void;
  team: string;
  setTeam: (team: string) => void;
}

const JOB_TYPES = [
  "Plumbing", 
  "Electrical", 
  "HVAC", 
  "Carpentry", 
  "Painting", 
  "Roofing", 
  "Landscaping", 
  "General Repair", 
  "Flooring", 
  "Tiling", 
  "Concrete", 
  "Fencing", 
  "Yard Maintenance", 
  "Shed Building", 
  "Shop Fitouts", 
  "Cabinet Making",
  "Other"
];

const TEAMS = [
  { id: "tba", name: "TBA (To Be Allocated)" },
  { id: "red", name: "Team Red" },
  { id: "blue", name: "Team Blue" },
  { id: "green", name: "Team Green" }
];

const QUICK_TEMPLATES: JobTemplate[] = [{
  id: "t1",
  title: "Basic Maintenance",
  description: "Standard maintenance service",
  type: "General Repair",
  estimatedDuration: 1,
  price: 100,
  materials: ["Basic tools"]
}, {
  id: "t2",
  title: "Emergency Plumbing",
  description: "Urgent plumbing repair for leaks or blockages",
  type: "Plumbing",
  estimatedDuration: 2,
  price: 200,
  materials: ["Pipes", "Fittings"]
}, {
  id: "t3",
  title: "Electrical Inspection",
  description: "Safety inspection of electrical systems",
  type: "Electrical",
  estimatedDuration: 1.5,
  price: 150,
  materials: ["Testing equipment"]
}];

export function JobForm({
  onShowTemplateSearch,
  jobNumber,
  setJobNumber,
  title,
  setTitle,
  customer,
  setCustomer,
  description,
  setDescription,
  type,
  setType,
  date,
  setDate,
  dateUndecided,
  setDateUndecided,
  team,
  setTeam
}: JobFormProps) {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  const handleSubmit = e => {
    e.preventDefault();
    if (!jobNumber || !title || !customer || !type || !date && !dateUndecided) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newJob = {
      id: crypto.randomUUID(),
      jobNumber,
      title,
      customer,
      description,
      type,
      date: dateUndecided ? "Yet to be decided" : date,
      status: "ready",
      location: [151.2093, -33.8688],
      assignedTeam: team !== "tba" ? TEAMS.find(t => t.id === team)?.name : undefined
    };
    toast({
      title: "Job Created",
      description: `Job "${title}" has been created successfully`
    });
    navigate("/jobs");
  };

  const applyTemplate = (template: JobTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    toast({
      title: "Template Applied",
      description: `Applied template: ${template.title}`
    });
  };

  return <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-slate-300">
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobNumberGenerator jobNumber={jobNumber} setJobNumber={setJobNumber} />
            
            <JobDateSelector date={date} setDate={setDate} dateUndecided={dateUndecided} setDateUndecided={setDateUndecided} />
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name *</Label>
              <Input id="customer" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g., John Smith" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(jobType => <SelectItem key={jobType} value={jobType}>
                      {jobType}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Allocate Team</span>
              </Label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team or TBA" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex flex-col justify-end">
              <Label>Templates</Label>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full text-gray-950 bg-slate-400 hover:bg-slate-300">
                      <ListChecks className="h-4 w-4 mr-2" />
                      Quick Templates
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white w-56">
                    {QUICK_TEMPLATES.map(template => <DropdownMenuItem key={template.id} onClick={() => applyTemplate(template)}>
                        {template.title}
                      </DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button type="button" variant="outline" onClick={onShowTemplateSearch} className="text-gray-950 bg-slate-400 hover:bg-slate-300">
                  Browse All
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description of the job" rows={4} />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/jobs")} className="bg-slate-400 hover:bg-slate-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-slate-400 hover:bg-slate-300">
            Create Job
          </Button>
        </CardFooter>
      </form>
    </Card>;
}
