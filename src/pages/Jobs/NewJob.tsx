
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, FileUp, Zap, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { JobTemplate } from "@/types/job";

export default function NewJob() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);

  const templates: JobTemplate[] = [
    {
      id: "1",
      title: "Basic Plumbing Service",
      estimatedDuration: "2-3 hours",
      materials: ["Pipe wrench", "Plumber's tape", "Replacement parts"],
      price: "$150-200",
      description: "Standard plumbing service including inspection and basic repairs",
      category: "Plumbing"
    },
    {
      id: "2",
      title: "Electrical Inspection",
      estimatedDuration: "1-2 hours",
      materials: ["Multimeter", "Safety equipment", "Testing tools"],
      price: "$120-180",
      description: "Complete electrical system inspection and safety check",
      category: "Electrical"
    }
  ];

  const handleGenerateTemplate = async () => {
    if (!aiPrompt) return;
    
    setIsGenerating(true);
    try {
      // Mock AI generation for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newTemplate: JobTemplate = {
        id: crypto.randomUUID(),
        title: "AI Generated Template",
        estimatedDuration: "TBD",
        materials: [],
        price: "TBD",
        description: `Generated based on: ${aiPrompt}`,
        category: "Custom"
      };
      setSelectedTemplate(newTemplate);
    } catch (error) {
      console.error("Error generating template:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Job</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Template</CardTitle>
                <CardDescription>Choose from our pre-made templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {template.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Template</CardTitle>
                <CardDescription>Upload your own job template</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Generate Template</CardTitle>
                <CardDescription>Let AI create a template based on your description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe the job you need a template for..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  onClick={handleGenerateTemplate}
                  disabled={isGenerating || !aiPrompt.trim()}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Selected Template</CardTitle>
                <CardDescription>
                  {selectedTemplate 
                    ? "Customize the template for your job"
                    : "Select or generate a template to start"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input defaultValue={selectedTemplate.title} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea defaultValue={selectedTemplate.description} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration</label>
                      <Input defaultValue={selectedTemplate.estimatedDuration} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <Input defaultValue={selectedTemplate.price} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Materials</label>
                      <div className="space-y-2">
                        {selectedTemplate.materials.map((material, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input defaultValue={material} />
                            <Button variant="ghost" size="icon">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Create Job</Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No template selected
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
