
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { JOB_TYPES } from "../../constants/jobTypes";
import { JobTemplate } from "@/types/job";

export function NewTemplateForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("1");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState("Residential");
  const [materials, setMaterials] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create template object
    const newTemplate: JobTemplate = {
      id: crypto.randomUUID(),
      title,
      description,
      type,
      estimatedDuration: parseFloat(duration) || 0,
      price: parseFloat(price) || 0,
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      category
    };
    
    // Save to localStorage (in a real app, we'd save to a database)
    try {
      const existingTemplates = localStorage.getItem('userJobTemplates');
      const templates = existingTemplates ? JSON.parse(existingTemplates) : [];
      templates.push(newTemplate);
      localStorage.setItem('userJobTemplates', JSON.stringify(templates));
      
      toast({
        title: "Template Created",
        description: `Template "${title}" has been created successfully`
      });
      
      navigate("/jobs");
    } catch (err) {
      console.error("Error saving template:", err);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title *</Label>
            <Input 
              id="title" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Basic Plumbing Fix" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this job template includes..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(jobType => (
                    <SelectItem key={jobType} value={jobType}>{jobType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration (hours)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="0.25"
                step="0.25"
                value={duration}
                onChange={e => setDuration(e.target.value)}
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
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="materials">Required Materials (comma-separated)</Label>
            <Textarea 
              id="materials" 
              value={materials}
              onChange={e => setMaterials(e.target.value)}
              placeholder="e.g., Pipes, Fittings, Sealant"
              rows={2}
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
          <Button 
            type="submit"
            className="bg-slate-400 hover:bg-slate-300"
          >
            Save Template
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
