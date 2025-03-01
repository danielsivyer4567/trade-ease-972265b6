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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const [squareMeterRate, setSquareMeterRate] = useState("45");
  const [linearMeterRate, setLinearMeterRate] = useState("35");
  const [hourlyRate, setHourlyRate] = useState("85");
  const [materialsMarkup, setMaterialsMarkup] = useState("30");
  const [rateType, setRateType] = useState<"hourly" | "squareMeter" | "linearMeter">("hourly");

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
      images,
      rateType,
      rates: {
        hourly: parseFloat(hourlyRate) || 0,
        squareMeter: parseFloat(squareMeterRate) || 0,
        linearMeter: parseFloat(linearMeterRate) || 0,
        materialsMarkup: parseFloat(materialsMarkup) || 0,
      }
    };

    console.log("Saving template:", template);
    
    localStorage.setItem('newTemplate', JSON.stringify(template));
    
    toast({
      title: "Template Saved",
      description: "Your job template has been saved successfully"
    });
    
    navigate('/jobs');
  };

  const handleRateTypeChange = (value: string) => {
    if (value === "hourly" || value === "squareMeter" || value === "linearMeter") {
      setRateType(value);
    }
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
                <SelectItem value="Fencing">Fencing</SelectItem>
                <SelectItem value="Retaining Walls">Retaining Walls</SelectItem>
                <SelectItem value="Gates">Gates</SelectItem>
                <SelectItem value="Solar">Solar</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Painting">Painting</SelectItem>
                <SelectItem value="Landscaping">Landscaping</SelectItem>
                <SelectItem value="Roofing">Roofing</SelectItem>
                <SelectItem value="Flooring">Flooring</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>Rate Calculation Method</Label>
            <Tabs defaultValue={rateType} onValueChange={handleRateTypeChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="squareMeter">Square Meter</TabsTrigger>
                <TabsTrigger value="linearMeter">Linear Meter</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hourly" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourlyRate"
                      type="number" 
                      min="0" 
                      value={hourlyRate} 
                      onChange={e => setHourlyRate(e.target.value)} 
                    />
                  </div>
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
                </div>
              </TabsContent>
              
              <TabsContent value="squareMeter" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="squareMeterRate">Rate per m² ($)</Label>
                    <Input 
                      id="squareMeterRate"
                      type="number" 
                      min="0" 
                      value={squareMeterRate} 
                      onChange={e => setSquareMeterRate(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Estimated Area (m²)</Label>
                    <Input 
                      id="area"
                      type="number" 
                      min="0" 
                      value={estimatedDuration} 
                      onChange={e => setEstimatedDuration(e.target.value)} 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="linearMeter" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linearMeterRate">Rate per Linear Meter ($)</Label>
                    <Input 
                      id="linearMeterRate"
                      type="number" 
                      min="0" 
                      value={linearMeterRate} 
                      onChange={e => setLinearMeterRate(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Estimated Length (m)</Label>
                    <Input 
                      id="length"
                      type="number" 
                      min="0" 
                      value={estimatedDuration} 
                      onChange={e => setEstimatedDuration(e.target.value)} 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="materialsMarkup">Materials Markup (%)</Label>
              <Input 
                id="materialsMarkup"
                type="number" 
                min="0" 
                value={materialsMarkup} 
                onChange={e => setMaterialsMarkup(e.target.value)} 
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
            <Label htmlFor="materials">Materials Ordered</Label>
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
