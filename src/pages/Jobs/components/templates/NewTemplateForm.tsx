
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import type { JobTemplate } from "@/types/job";

export function NewTemplateForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templateTitle, setTemplateTitle] = useState("New Template");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [estimatedDuration, setEstimatedDuration] = useState("0");
  const [price, setPrice] = useState("0");
  const [materials, setMaterials] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newImages: string[] = [];
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length) {
            setImages(prevImages => [...prevImages, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveTemplate = () => {
    if (!templateTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your template",
        variant: "destructive"
      });
      return;
    }

    const template: JobTemplate = {
      id: crypto.randomUUID(),
      title: templateTitle,
      description,
      type: "",
      estimatedDuration: parseFloat(estimatedDuration) || 0,
      price: parseFloat(price) || 0,
      materials: materials.split("\n").filter(item => item.trim()),
      category,
      images
    };

    // In a real app, save to database here
    console.log("Saving template:", template);
    
    localStorage.setItem('newTemplate', JSON.stringify(template));
    
    toast({
      title: "Template Saved",
      description: "Your job template has been saved successfully"
    });
    
    navigate('/jobs');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <Button onClick={handleSaveTemplate}>
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Template Title</Label>
            <Input 
              id="title"
              value={templateTitle} 
              onChange={e => setTemplateTitle(e.target.value)} 
              placeholder="Enter template title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={value => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="Carpentry">Carpentry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration (hours)</Label>
              <Input 
                id="duration"
                type="number" 
                min="0" 
                step="0.5" 
                value={estimatedDuration} 
                onChange={e => setEstimatedDuration(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (estimate)</Label>
              <Input 
                id="price"
                type="number" 
                min="0" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea 
              id="description"
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detailed description of the job..." 
              className="min-h-[150px]" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="materials">Required Materials</Label>
            <Textarea 
              id="materials"
              value={materials} 
              onChange={e => setMaterials(e.target.value)} 
              placeholder="Enter each material on a new line" 
              className="min-h-[100px]" 
            />
            <p className="text-sm text-gray-500">
              Enter each material on a new line
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Photos</Label>
            <FileUpload 
              onFileUpload={handleImageUpload} 
              label="Upload images related to this job template" 
            />
          </div>
          
          <ImagesGrid 
            images={images} 
            title="Uploaded Images" 
          />
        </div>
      </Card>
    </div>
  );
}
