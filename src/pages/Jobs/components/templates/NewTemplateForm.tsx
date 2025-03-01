
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { JobTemplate } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Job types for the dropdown
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
  "Other"
];

export function NewTemplateForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [rateType, setRateType] = useState<"hourly" | "squareMeter" | "linearMeter">("hourly");
  const [materialsList, setMaterialsList] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rates state
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [squareMeterRate, setSquareMeterRate] = useState<number>(0);
  const [linearMeterRate, setLinearMeterRate] = useState<number>(0);
  const [materialsMarkup, setMaterialsMarkup] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const materials = materialsList
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
        
      const newTemplate: JobTemplate = {
        id: crypto.randomUUID(),
        title,
        description,
        type,
        estimatedDuration,
        price,
        materials,
        category: category || undefined,
        rateType,
        rates: {
          hourly: hourlyRate,
          squareMeter: squareMeterRate,
          linearMeter: linearMeterRate,
          materialsMarkup: materialsMarkup
        }
      };
      
      // In a real app, you would save this to a database
      // For now, we'll just show a success toast
      toast({
        title: "Template created",
        description: `Job template "${title}" has been created successfully`,
      });
      
      // Navigate back to jobs page after successful creation
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "There was a problem creating the template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Job Template</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Template Title *</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Water Heater Installation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select 
                value={type} 
                onValueChange={setType}
                required
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Residential, Commercial, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
              <Input 
                id="estimatedDuration" 
                type="number"
                min="0"
                step="0.5"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Base Price ($)</Label>
              <Input 
                id="price" 
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rateType">Rate Type</Label>
              <Select 
                value={rateType} 
                onValueChange={(value: "hourly" | "squareMeter" | "linearMeter") => setRateType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="squareMeter">Square Meter</SelectItem>
                  <SelectItem value="linearMeter">Linear Meter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the job template"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="materials">Materials (comma separated)</Label>
            <Textarea 
              id="materials" 
              value={materialsList}
              onChange={(e) => setMaterialsList(e.target.value)}
              placeholder="Water heater, copper pipe, fittings, solder, etc."
              rows={3}
            />
          </div>
          
          <div className="bg-accent/30 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Rates Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input 
                  id="hourlyRate" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="squareMeterRate">Square Meter Rate ($)</Label>
                <Input 
                  id="squareMeterRate" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={squareMeterRate}
                  onChange={(e) => setSquareMeterRate(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linearMeterRate">Linear Meter Rate ($)</Label>
                <Input 
                  id="linearMeterRate" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={linearMeterRate}
                  onChange={(e) => setLinearMeterRate(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materialsMarkup">Materials Markup (%)</Label>
                <Input 
                  id="materialsMarkup" 
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={materialsMarkup}
                  onChange={(e) => setMaterialsMarkup(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/jobs")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
