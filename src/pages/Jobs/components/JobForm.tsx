
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobNumberGenerator } from "./JobNumberGenerator";
import { JobDateSelector } from "./JobDateSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";

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
}

const JOB_TYPES = ["Plumbing", "Electrical", "HVAC", "Carpentry", "Painting", "Roofing", "Landscaping", "General Repair", "Flooring", "Tiling", "Concrete", "Other"];

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
  setDateUndecided
}: JobFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!jobNumber || !title || !customer || !type || (!date && !dateUndecided)) {
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
      date: dateUndecided ? "Yet to be decided" : date,
      status: "ready",
      location: [151.2093, -33.8688] // Default location for demo
    };

    toast({
      title: "Job Created",
      description: `Job "${title}" has been created successfully`
    });
    navigate("/jobs");
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-slate-300">
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobNumberGenerator 
              jobNumber={jobNumber} 
              setJobNumber={setJobNumber} 
            />
            
            <JobDateSelector 
              date={date}
              setDate={setDate}
              dateUndecided={dateUndecided}
              setDateUndecided={setDateUndecided}
            />
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Water Heater Installation" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name *</Label>
              <Input 
                id="customer" 
                value={customer} 
                onChange={e => setCustomer(e.target.value)} 
                placeholder="e.g., John Smith" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(jobType => (
                    <SelectItem key={jobType} value={jobType}>
                      {jobType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex items-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onShowTemplateSearch} 
                className="text-gray-950 bg-slate-400 hover:bg-slate-300"
              >
                Search Templates
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detailed description of the job" 
              rows={4} 
            />
          </div>
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
          <Button type="submit" className="bg-slate-400 hover:bg-slate-300">
            Create Job
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
