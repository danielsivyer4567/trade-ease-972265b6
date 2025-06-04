import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Workflow, ArrowLeft, LayoutTemplate, Loader2 } from 'lucide-react';
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowTemplate } from '@/types/workflow';
import { toast } from 'sonner';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

const categoryOptions = [
  { value: 'all', label: 'All Templates' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'customer', label: 'Customer Service' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'tech', label: 'Tech & IT' },
  { value: 'business', label: 'Business Services' },
  { value: 'finance_insurance', label: 'Finance & Insurance' },
  { value: 'construction', label: 'Construction' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality & Events' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'creative', label: 'Creative Services' }
];

// Example template data - will be replaced by API call
const exampleTemplates: WorkflowTemplate[] = [
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Standard workflow for onboarding new customers',
    category: 'customer',
    data: {
      nodes: [
        {
          id: 'create-customer',
          type: 'customerNode',
          position: { x: 100, y: 100 },
          data: { label: 'Create Customer' }
        },
        {
          id: 'send-welcome',
          type: 'emailNode',
          position: { x: 300, y: 100 },
          data: { label: 'Send Welcome Email' }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: 'create-customer',
          target: 'send-welcome'
        }
      ]
    }
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Workflow for handling construction project tasks',
    category: 'operations',
    data: {
      nodes: [
        {
          id: 'create-project',
          type: 'projectNode',
          position: { x: 100, y: 100 },
          data: { label: 'Create Project' }
        },
        {
          id: 'assign-team',
          type: 'teamNode',
          position: { x: 300, y: 100 },
          data: { label: 'Assign Team' }
        },
        {
          id: 'schedule-tasks',
          type: 'taskNode',
          position: { x: 500, y: 100 },
          data: { label: 'Schedule Tasks' }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: 'create-project',
          target: 'assign-team'
        },
        {
          id: 'e2',
          source: 'assign-team',
          target: 'schedule-tasks'
        }
      ]
    }
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline',
    description: 'Manage leads through your sales funnel',
    category: 'sales',
    data: {
      nodes: [
        {
          id: 'lead-capture',
          type: 'leadNode',
          position: { x: 100, y: 100 },
          data: { label: 'Lead Capture' }
        },
        {
          id: 'qualification',
          type: 'processNode',
          position: { x: 300, y: 100 },
          data: { label: 'Qualification' }
        },
        {
          id: 'proposal',
          type: 'documentNode',
          position: { x: 500, y: 100 },
          data: { label: 'Send Proposal' }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: 'lead-capture',
          target: 'qualification'
        },
        {
          id: 'e2',
          source: 'qualification',
          target: 'proposal'
        }
      ]
    }
  }
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode: workflowDarkMode } = useWorkflowDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load templates when component mounts
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first
      const result = await WorkflowService.listWorkflowTemplates();
      if (result.success && result.templates && result.templates.length > 0) {
        setTemplates(result.templates);
      } else {
        // Fall back to example templates if API fails or returns empty
        console.log('Using example templates');
        setTemplates(exampleTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fall back to example templates
      setTemplates(exampleTemplates);
      toast.error('Error loading templates, using example data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreateTemplate = () => {
    navigate('/workflow/new?template=true');
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    // Store template data in localStorage to avoid large state objects in navigation
    try {
      localStorage.setItem('workflow_template_data', JSON.stringify({
        templateId: template.id,
        templateName: template.name,
        templateDescription: template.description,
        templateData: template.data,
        timestamp: Date.now() // Add timestamp to ensure freshness
      }));
      
      // Navigate to workflow builder with minimal state
      navigate('/workflow', { 
        state: { 
          useTemplate: true,
          fromLocalStorage: true
        } 
      });
      
      toast.success(`Template "${template.name}" applied to new workflow`);
    } catch (error) {
      console.error('Error storing template data:', error);
      toast.error('Failed to apply template. Please try again.');
    }
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/workflow/edit/${templateId}`);
  };

  const handleCategoryClick = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    toast.success(`Showing ${categoryValue === 'all' ? 'all templates' : `templates for ${categoryOptions.find(c => c.value === categoryValue)?.label}`}`);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <BaseLayout>
      <div className={`p-4 md:p-6 space-y-4 md:space-y-6 ${workflowDarkMode ? 'bg-[#18140c]' : ''}`}>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <WorkflowNavigation workflowDarkMode={workflowDarkMode} />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl font-bold flex items-center ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
                <LayoutTemplate className={`mr-2 h-6 w-6 ${workflowDarkMode ? 'text-[#bfa14a]' : ''}`} />
                Workflow Templates
              </h1>
              <p className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}`}>
                Pre-built workflow templates to help you get started quickly
              </p>
            </div>
            <Button 
              className={`flex items-center gap-2 ${workflowDarkMode ? 'bg-[#bfa14a] text-[#18140c] hover:bg-[#a08838]' : ''}`}
              onClick={handleCreateTemplate}
            >
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </Button>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-gray-500'}`} />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a] text-[#ffe082] placeholder:text-[#ffe082]/50' : ''}`}
            />
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto" style={{ maxWidth: '100%' }}>
            {categoryOptions.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.value)}
                className={`whitespace-nowrap ${workflowDarkMode ? (
                  selectedCategory === category.value 
                    ? 'bg-[#bfa14a] text-[#18140c] hover:bg-[#a08838]' 
                    : 'border-[#bfa14a] text-[#ffe082] hover:bg-[#211c15]'
                ) : ''}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="text-center py-16 flex flex-col items-center">
            <Loader2 className={`h-8 w-8 animate-spin mb-2 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-blue-500'}`} />
            <p className={workflowDarkMode ? 'text-[#ffe082]' : 'text-muted-foreground'}>Loading templates...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className={`hover:shadow-md transition-shadow duration-200 cursor-pointer ${workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a]' : ''}`}
                  onClick={() => handleUseTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-lg ${workflowDarkMode ? 'text-[#bfa14a]' : ''}`}>{template.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082]' : ''}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-70' : ''}`}>
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className={`text-sm font-medium ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-amber-600'}`}>
                          Nodes: {template.data.nodes.length}
                        </p>
                        <p className={`text-sm font-medium ${workflowDarkMode ? 'text-[#ffe082]' : 'text-blue-600'}`}>
                          Connections: {template.data.edges.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className={`flex justify-between pt-4 border-t ${workflowDarkMode ? 'border-[#bfa14a]' : ''}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                      className={workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082] hover:bg-[#211c15]' : ''}
                    >
                      Use Template
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template.id);
                      }}
                      className={workflowDarkMode ? 'text-[#bfa14a] hover:bg-[#211c15]' : ''}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && !isLoading && (
              <div className={`text-center p-10 border border-dashed rounded-md ${workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082]' : ''}`}>
                <p className={workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}>No templates found for this category. Try another category or search term.</p>
              </div>
            )}
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default Templates; 