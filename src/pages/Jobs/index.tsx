import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Wrench, Zap, Wind, Loader2, Upload, FileUp, LinkIcon, Clock, CheckCircle, DollarSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { JobTemplate } from "@/types/job";

interface Job {
  id: string;
  title: string;
  date: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced';
  customer: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Water Heater Installation',
    date: '2024-03-15',
    status: 'ready',
    customer: 'John Smith'
  },
  {
    id: '2',
    title: 'HVAC Maintenance',
    date: '2024-03-14',
    status: 'in-progress',
    customer: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'Electrical Panel Upgrade',
    date: '2024-03-13',
    status: 'to-invoice',
    customer: 'Mike Brown'
  },
  {
    id: '4',
    title: 'Plumbing Repair',
    date: '2024-03-12',
    status: 'invoiced',
    customer: 'Emily Davis'
  }
];

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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

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

  const parseCSVTemplate = (csvContent: string): JobTemplate => {
    const rows = csvContent.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const headers = rows[0].map(header => header.toLowerCase());
    const data = rows[1]; // Assuming first row after headers contains the template data

    const getColumnValue = (columnName: string) => {
      const index = headers.findIndex(h => h.includes(columnName));
      return index !== -1 ? data[index] : '';
    };

    return {
      id: crypto.randomUUID(),
      title: getColumnValue('title') || "Untitled Template",
      estimatedDuration: getColumnValue('duration') || "Not specified",
      materials: getColumnValue('materials')?.split(';') || [],
      price: getColumnValue('price') || "Not specified",
      category: (getColumnValue('category') || "Plumbing") as "Plumbing" | "Electrical" | "HVAC",
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string);
          if (!template.id) {
            template.id = crypto.randomUUID();
          }
          setGeneratedTemplates([template, ...generatedTemplates]);
          toast({
            title: "Success",
            description: "Template uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || 
               file.type === 'application/msword' || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast({
        title: "Info",
        description: "PDF and Word documents need to be processed. Please ensure they follow the template format.",
      });
      
      const mockTemplate: JobTemplate = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        estimatedDuration: "Please edit",
        materials: [],
        price: "Please edit",
        category: "Plumbing",
      };
      
      setGeneratedTemplates([mockTemplate, ...generatedTemplates]);
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = parseCSVTemplate(e.target?.result as string);
          setGeneratedTemplates([template, ...generatedTemplates]);
          toast({
            title: "Success",
            description: "CSV template uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid CSV format. Please check the file structure.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = parseTextTemplate(e.target?.result as string);
          setGeneratedTemplates([template, ...generatedTemplates]);
          toast({
            title: "Success",
            description: "Template uploaded successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid template format",
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

  const attachToJob = (template: JobTemplate) => {
    toast({
      title: "Template Attached",
      description: `Template "${template.title}" has been attached to a new job. Redirecting to job creation...`,
    });
    
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    navigate('/jobs/new');
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
    toast({
      title: "Status Updated",
      description: `Job status has been updated successfully`,
    });
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'ready':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-yellow-500" />;
      case 'to-invoice':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'invoiced':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
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
              <div className="text-xs text-gray-500 mt-2">
                <p className="font-medium mb-1">Document format:</p>
                <p>Title: [Job Title]</p>
                <p>Duration: [Estimated Duration]</p>
                <p>Materials: [item1; item2; item3]</p>
                <p>Price: [Price Range]</p>
                <p>Category: [Plumbing/Electrical/HVAC]</p>
                <p className="mt-2 text-gray-400">
                  For CSV files, use headers: Title, Duration, Materials, Price, Category
                </p>
                <p className="text-gray-400">
                  For PDF and Word documents, please follow the format above
                </p>
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

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Jobs</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(job.status)}
                          <span className="ml-2 text-sm text-gray-500">
                            {job.status.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                        >
                          <option value="ready">Ready to Go</option>
                          <option value="in-progress">In Progress</option>
                          <option value="to-invoice">To Invoice</option>
                          <option value="invoiced">Invoiced</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedTemplates.map((template, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{template.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => attachToJob(template)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Attach to Job
                </Button>
              </div>
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
