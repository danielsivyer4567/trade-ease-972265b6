import { AppLayout } from "@/components/ui/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { TemplateLibrary } from "./components/TemplateLibrary";
const JOB_TYPES = ["Plumbing", "Electrical", "HVAC", "Carpentry", "Painting", "Roofing", "Landscaping", "General Repair", "Flooring", "Tiling", "Concrete", "Other"];
export default function NewJob() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // State for the new job form
  const [jobNumber, setJobNumber] = useState("");
  const [title, setTitle] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [showTemplateSearch, setShowTemplateSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock templates for the template search
  const templates = [{
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
  const handleTemplateSelection = template => {
    // Fill form with template data
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    toast({
      title: "Template Applied",
      description: `Applied template: ${template.title}`
    });
    setShowTemplateSearch(false);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!jobNumber || !title || !customer || !type || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new job object
    const newJob = {
      id: crypto.randomUUID(),
      jobNumber,
      title,
      customer,
      description,
      type,
      date,
      status: "ready",
      location: [151.2093, -33.8688] // Default location for demo
    };
    toast({
      title: "Job Created",
      description: `Job "${title}" has been created successfully`
    });
    navigate("/jobs");
  };
  return <AppLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/jobs")} className="mr-2 rounded-md border border-gray-300 bg-slate-400 hover:bg-slate-300">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Job</h1>
        </div>
        
        {showTemplateSearch ? <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select a Template</h2>
              <Button variant="outline" onClick={() => setShowTemplateSearch(false)}>
                Back to Form
              </Button>
            </div>
            <TemplateLibrary templates={templates} searchQuery={searchQuery} onSearchChange={setSearchQuery} onAttachToJob={handleTemplateSelection} />
          </div> : <Card className="max-w-3xl mx-auto">
            <CardHeader className="bg-slate-300">
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 bg-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobNumber">Job Number *</Label>
                    <Input id="jobNumber" value={jobNumber} onChange={e => setJobNumber(e.target.value)} placeholder="e.g., JOB-001" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Job Date *</Label>
                    <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Water Heater Installation" required />
                  </div>
                  
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
                  
                  <div className="space-y-2 flex items-end">
                    <Button type="button" variant="outline" onClick={() => setShowTemplateSearch(true)} className="text-gray-950 bg-slate-400 hover:bg-slate-300">
                      Search Templates
                    </Button>
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
          </Card>}
      </div>
    </AppLayout>;
}