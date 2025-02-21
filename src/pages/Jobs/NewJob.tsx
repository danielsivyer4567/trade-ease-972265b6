
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, FileUp, Zap, Plus, Facebook, Search, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { JobTemplate } from "@/types/job";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function NewJob() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Mock customers data - in a real app this would come from your backend
  const customers = [
    { id: 1, name: "John Smith", email: "john.smith@email.com" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com" },
    { id: 3, name: "Michael Brown", email: "michael.b@email.com" },
  ];

  const templates: JobTemplate[] = [{
    id: "1",
    title: "Basic Plumbing Service",
    estimatedDuration: "2-3 hours",
    materials: ["Pipe wrench", "Plumber's tape", "Replacement parts"],
    price: "$150-200",
    description: "Standard plumbing service including inspection and basic repairs",
    category: "Plumbing"
  }, {
    id: "2",
    title: "Electrical Inspection",
    estimatedDuration: "1-2 hours",
    materials: ["Multimeter", "Safety equipment", "Testing tools"],
    price: "$120-180",
    description: "Complete electrical system inspection and safety check",
    category: "Electrical"
  }];

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

  const handleDragStart = (template: JobTemplate, event: React.DragEvent) => {
    event.dataTransfer.setData('application/json', JSON.stringify(template));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!selectedCustomer) return;
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    if (!selectedCustomer) return;

    try {
      const template = JSON.parse(event.dataTransfer.getData('application/json')) as JobTemplate;
      console.log('Creating new job:', {
        template,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name
      });
      // Here you would typically create the job in your backend
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/jobs">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Create New Job</h1>
          </div>
          <a 
            href="https://facebook.com/groups/tradeease" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Facebook className="h-4 w-4" />
            Join our Trade Community
          </a>
        </div>

        <Card 
          className={`mb-6 transition-colors ${isDraggingOver && selectedCustomer ? 'bg-blue-50 border-blue-300' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardHeader>
            <CardTitle>Select Customer</CardTitle>
            <CardDescription>
              {selectedCustomer 
                ? "Drag a template here to create a new job for this customer" 
                : "Choose a customer for this job"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <div className="font-medium">{selectedCustomer.name}</div>
                    <div className="text-gray-500">{selectedCustomer.email}</div>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setIsCustomerSearchOpen(true)}
                >
                  Change Customer
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsCustomerSearchOpen(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search for a customer
              </Button>
            )}
          </CardContent>
        </Card>

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
                    draggable
                    onDragStart={(e) => handleDragStart(template, e)}
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

        <CommandDialog open={isCustomerSearchOpen} onOpenChange={setIsCustomerSearchOpen}>
          <CommandInput placeholder="Search customers..." />
          <CommandList>
            <CommandEmpty>No customers found.</CommandEmpty>
            <CommandGroup heading="Customers">
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  onSelect={() => {
                    setSelectedCustomer(customer);
                    setIsCustomerSearchOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span>{customer.name}</span>
                    <span className="text-sm text-gray-500">{customer.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </AppLayout>
  );
}
