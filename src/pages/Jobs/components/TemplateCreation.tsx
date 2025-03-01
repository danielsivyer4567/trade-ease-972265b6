import { Plus, Loader2, Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { JobTemplate } from "@/types/job";
import { parseTextTemplate, parseCSVTemplate } from "@/utils/templateUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TemplateCreationProps {
  onTemplateCreate: (template: JobTemplate) => void;
}

export function TemplateCreation({ onTemplateCreate }: TemplateCreationProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
          model: "gpt-4",
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
      onTemplateCreate(template);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        let template: JobTemplate;
        if (file.type === 'application/json') {
          template = JSON.parse(e.target?.result as string);
          if (!template.id) {
            template.id = crypto.randomUUID();
          }
          template.estimatedDuration = Number(template.estimatedDuration) || 0;
          template.price = Number(template.price) || 0;
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          template = parseCSVTemplate(e.target?.result as string);
        } else {
          template = parseTextTemplate(e.target?.result as string);
        }
        onTemplateCreate(template);
        toast({
          title: "Success",
          description: "Template uploaded successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid file format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const createBlankTemplate = () => {
    navigate('/jobs/new-template');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create New Template</h1>
          <p className="text-gray-500 mt-1">Generate and manage job templates with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                onChange={e => setJobDescription(e.target.value)}
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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Template</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".json,.txt,.pdf,.doc,.docx,.csv"
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
                  Supports JSON, TXT, CSV, PDF, and Word documents
                </span>
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Start from Blank</h2>
          <div className="space-y-4">
            <div className="text-center p-6">
              <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-4">
                Create a new blank template and customize it from scratch
              </p>
              <Button onClick={createBlankTemplate} className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Blank Template
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
