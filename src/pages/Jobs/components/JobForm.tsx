
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobNumberGenerator } from "./JobNumberGenerator";
import { JobDateSelector } from "./JobDateSelector";
import { CustomerDetails } from "./form-sections/CustomerDetails";
import { JobTypeSelector } from "./form-sections/JobTypeSelector";
import { TeamSelector } from "./form-sections/TeamSelector";
import { TemplateSelector } from "./form-sections/TemplateSelector";
import { JobDescription } from "./form-sections/JobDescription";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { JobTemplate } from "@/types/job";
import { TEAMS } from "../constants/teams";

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
  const { toast } = useToast();

  const handleSubmit = e => {
    e.preventDefault();
    if (!jobNumber || !title || !customer || !type || (!date && !dateUndecided)) {
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

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-slate-300">
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobNumberGenerator jobNumber={jobNumber} setJobNumber={setJobNumber} />
            
            <JobDateSelector 
              date={date} 
              setDate={setDate} 
              dateUndecided={dateUndecided} 
              setDateUndecided={setDateUndecided} 
            />
            
            <CustomerDetails customer={customer} setCustomer={setCustomer} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Kitchen Renovation" 
                required 
              />
            </div>
            
            <JobTypeSelector type={type} setType={setType} />
            
            <TeamSelector team={team} setTeam={setTeam} />
            
            <TemplateSelector 
              onShowTemplateSearch={onShowTemplateSearch} 
              applyTemplate={applyTemplate} 
            />
          </div>
          
          <JobDescription description={description} setDescription={setDescription} />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/jobs")} 
            className="bg-slate-400 hover:bg-slate-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-slate-400 hover:bg-slate-300"
          >
            Create Job
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
