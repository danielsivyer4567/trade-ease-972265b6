import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Wrench, Zap, Wind, Loader2, Upload, FileUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { JobTemplate } from "@/types/job";

const categories = [
  { name: "Plumbing", icon: Wrench, color: "text-blue-500" },
  { name: "Electrical", icon: Zap, color: "text-yellow-500" },
  { name: "HVAC", icon: Wind, color: "text-green-500" },
];

export default function Jobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<JobTemplate[]>([]);

  const generateTemplate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description first",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: "You are a professional job template creator. Create detailed job templates based on descriptions."
          }, {
            role: "user",
            content: `Create a job template for: ${jobDescription}. Include title, estimated duration, required materials, price range, and category (Plumbing, Electrical, or HVAC).`
          }]
        })
      });
      const data = await response.json();
      const template = JSON.parse(data.choices[0].message.content);
      setGeneratedTemplates([template, ...generatedTemplates]);
      setJobDescription("");
      toast({
        title: "Success",
        description: "Job template generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parseTextTemplate = (text: string): JobTemplate => {
    const lines = text.split('\n').map(line => line.trim());
    const template: JobTemplate = {
      id: crypto.randomUUID(),
      title: lines.find(line => line.toLowerCase().includes('title:'))?.split(':')[1]?.trim() || "Untitled Template",
      estimatedDuration: lines.find(line => line.toLowerCase().includes('duration:'))?.split(':')[1]?.trim() || "Not specified",
      materials: lines
        .find(line => line.toLowerCase().includes('materials:'))
        ?.split(':')[1]
        ?.split(',')
        .map(item => item.trim()) || [],
      price: lines.find(line => line.toLowerCase().includes('price:'))?.split(':')[1]?.trim() || "Not specified",
      category: (lines.find(line => line.toLowerCase().includes('category:'))?.split(':')[1]?.trim() || "Plumbing") as "Plumbing" | "Electrical" | "HVAC",
    };
    return template;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let template: JobTemplate;
          
          if (file.type === 'application/json') {
            template = JSON.parse(e.target?.result as string);
            if (!template.id) {
              template.id = crypto.randomUUID();
            }
          } else {
            template = parseTextTemplate(e.target?.result as string);
          }
          
          setGeneratedTemplates([template, ...generatedTemplates]);
          toast({
            title: "Success",
            description: "Template uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid template format. Please check your file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const createBlankTemplate = () => {
    const blankTemplate: JobTemplate = {
      id: crypto.randomUUID(),
      title: "New Template",
      estimatedDuration: "",
      materials: [],
      price: "",
      category: "Plumbing",
    };
    setGeneratedTemplates([blankTemplate, ...generatedTemplates]);
    toast({
      title: "Success",
      description: "Blank template created",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Templates</h1>
            <p className="text-gray-500 mt-1">Generate and manage job templates with AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Generation Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generate with AI</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe the job you need a template for
                </label>
                <Textarea
                  placeholder="E.g., Install a new water heater in a residential building..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                onClick={generateTemplate} 
                disabled={isGenerating || !jobDescription.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Template
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Upload Template Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Template</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="template-upload"
                />
                <label 
                  htmlFor="template-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload a template file
                  </span>
                  <span className="text-xs text-gray-400">
                    Supports JSON and TXT formats
                  </span>
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                <p className="font-medium mb-1">Text file format:</p>
                <p>Title: [Job Title]</p>
                <p>Duration: [Estimated Duration]</p>
                <p>Materials: [item1, item2, item3]</p>
                <p>Price: [Price Range]</p>
                <p>Category: [Plumbing/Electrical/HVAC]</p>
              </div>
            </div>
          </Card>

          {/* Blank Template Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Start from Blank</h2>
            <div className="space-y-4">
              <div className="text-center p-6">
                <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">
                  Create a new blank template and customize it from scratch
                </p>
                <Button 
                  onClick={createBlankTemplate}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blank Template
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedTemplates.map((template, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">{template.title}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Duration:</span> {template.estimatedDuration}</p>
                <p><span className="font-medium">Price:</span> {template.price}</p>
                <p><span className="font-medium">Category:</span> {template.category}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Materials:</span> {template.materials.join(", ")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
