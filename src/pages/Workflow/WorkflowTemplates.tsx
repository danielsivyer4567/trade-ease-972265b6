
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Workflow as WorkflowIcon, Building, Construction, CreditCard, HardHat, Truck, UserPlus, ClipboardList, Calendar, Zap, WrenchIcon, HomeIcon, ShieldCheck, Receipt, BarChart, Ruler, Clock, PlusCircle, Bookmark, Star } from "lucide-react";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';

const TEMPLATE_CATEGORIES = [
  { id: 'residential', name: 'Residential', icon: <HomeIcon className="h-4 w-4" /> },
  { id: 'commercial', name: 'Commercial', icon: <Building className="h-4 w-4" /> },
  { id: 'construction', name: 'Construction', icon: <Construction className="h-4 w-4" /> },
  { id: 'safety', name: 'Safety', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'financial', name: 'Financial', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'quality', name: 'Quality', icon: <Star className="h-4 w-4" /> },
  { id: 'efficiency', name: 'Efficiency', icon: <Ruler className="h-4 w-4" /> },
  { id: 'team', name: 'Team', icon: <UserPlus className="h-4 w-4" /> },
  { id: 'logistics', name: 'Logistics', icon: <Truck className="h-4 w-4" /> },
  { id: 'equipment', name: 'Equipment', icon: <HardHat className="h-4 w-4" /> },
  { id: 'maintenance', name: 'Maintenance', icon: <WrenchIcon className="h-4 w-4" /> },
  { id: 'scheduling', name: 'Scheduling', icon: <Calendar className="h-4 w-4" /> },
  { id: 'reporting', name: 'Reporting', icon: <BarChart className="h-4 w-4" /> },
  { id: 'invoicing', name: 'Invoicing', icon: <Receipt className="h-4 w-4" /> },
  { id: 'automation', name: 'Automation', icon: <Zap className="h-4 w-4" /> },
  { id: 'custom', name: 'Custom', icon: <PlusCircle className="h-4 w-4" /> },
];

const WORKFLOW_TEMPLATES = [
  {
    id: '1',
    name: 'Residential Cleaning Checklist',
    description: 'A comprehensive checklist for residential cleaning services.',
    category: 'Residential',
    data: { nodes: [], edges: [] }
  },
  {
    id: '2',
    name: 'Commercial Construction Safety Inspection',
    description: 'A safety inspection workflow for commercial construction sites.',
    category: 'Commercial',
    data: { nodes: [], edges: [] }
  },
  {
    id: '3',
    name: 'Financial Audit Process',
    description: 'A step-by-step process for conducting financial audits.',
    category: 'Financial',
    data: { nodes: [], edges: [] }
  },
  {
    id: '4',
    name: 'Quality Assurance Testing Workflow',
    description: 'A workflow for quality assurance testing of software applications.',
    category: 'Quality',
    data: { nodes: [], edges: [] }
  },
  {
    id: '5',
    name: 'Team Onboarding Process',
    description: 'A workflow for onboarding new team members.',
    category: 'Team',
    data: { nodes: [], edges: [] }
  },
  {
    id: '6',
    name: 'Equipment Maintenance Schedule',
    description: 'A schedule for maintaining equipment and machinery.',
    category: 'Equipment',
    data: { nodes: [], edges: [] }
  },
  {
    id: '7',
    name: 'Customer Onboarding Process',
    description: 'A detailed workflow for onboarding new customers, ensuring a smooth and positive start to their journey.',
    category: 'Team',
    data: { nodes: [], edges: [] }
  },
  {
    id: '8',
    name: 'Monthly Financial Reporting',
    description: 'A structured workflow for generating monthly financial reports, ensuring accuracy and compliance.',
    category: 'Financial',
    data: { nodes: [], edges: [] }
  },
  {
    id: '9',
    name: 'Weekly Team Task Coordination',
    description: 'A workflow designed to coordinate team tasks on a weekly basis, promoting collaboration and efficiency.',
    category: 'Team',
    data: { nodes: [], edges: [] }
  },
  {
    id: '10',
    name: 'Daily Equipment Check Procedure',
    description: 'A procedure for daily equipment checks, ensuring all machinery is in optimal working condition and safe for use.',
    category: 'Equipment',
    data: { nodes: [], edges: [] }
  },
  {
    id: '11',
    name: 'New Construction Project Timeline',
    description: 'A comprehensive timeline for new construction projects, outlining key milestones and deadlines.',
    category: 'Construction',
    data: { nodes: [], edges: [] }
  },
  {
    id: '12',
    name: 'Routine Safety Inspection Checklist',
    description: 'A checklist for routine safety inspections, ensuring compliance with safety standards and regulations.',
    category: 'Safety',
    data: { nodes: [], edges: [] }
  },
  {
    id: '13',
    name: 'Residential Property Management Workflow',
    description: 'A workflow for managing residential properties, covering tenant relations, maintenance, and financial aspects.',
    category: 'Residential',
    data: { nodes: [], edges: [] }
  },
  {
    id: '14',
    name: 'Commercial Cleaning Service Protocol',
    description: 'A detailed protocol for commercial cleaning services, ensuring a high standard of cleanliness and hygiene.',
    category: 'Commercial',
    data: { nodes: [], edges: [] }
  },
  {
    id: '15',
    name: 'Logistics Route Optimization',
    description: 'A workflow for optimizing logistics routes, reducing transportation costs and improving delivery times.',
    category: 'Logistics',
    data: { nodes: [], edges: [] }
  },
  {
    id: '16',
    name: 'Automation System Monitoring',
    description: 'A system for monitoring automation processes, ensuring smooth operation and identifying potential issues.',
    category: 'Automation',
    data: { nodes: [], edges: [] }
  },
  {
    id: '17',
    name: 'Custom Workflow Example',
    description: 'An example of a custom workflow, demonstrating the flexibility and adaptability of the workflow system.',
    category: 'Custom',
    data: { nodes: [], edges: [] }
  },
];

export default function WorkflowTemplates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredTemplates, setFilteredTemplates] = useState(WORKFLOW_TEMPLATES);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  // Filter templates based on search and category
  useEffect(() => {
    let templates = [...WORKFLOW_TEMPLATES];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      templates = templates.filter(template => 
        template.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchLower) || 
        template.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTemplates(templates);
  }, [search, activeCategory]);

  const handleBack = () => {
    navigate('/workflow/list');
  };

  const handleUseTemplate = (template: any) => {
    // Instead of navigating to a non-existent edit route, 
    // navigate to the workflow page with template data in state
    navigate('/workflow', { 
      state: { 
        templateData: template.data,
        templateName: template.name,
        templateDescription: template.description,
        templateCategory: template.category
      } 
    });
  };

  const handleSaveAsNewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setSaveDialogOpen(true);
  };

  const handleSaveTemplate = async (name: string, description: string, category: string) => {
    if (!selectedTemplate) return;
    
    setIsSaving(true);
    
    try {
      // Create a new template based on the selected one
      const newTemplate = {
        id: crypto.randomUUID(),
        name,
        description,
        category,
        data: selectedTemplate.data,
        is_template: true
      };
      
      const { success, id } = await WorkflowService.saveWorkflow(newTemplate as Workflow);
      
      if (success) {
        toast.success('Template saved successfully');
        setSaveDialogOpen(false);
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('An error occurred while saving the template');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = (templateId: string) => {
    setFavoriteTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  return (
    <AppLayout>
      <div className="container p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <WorkflowIcon className="h-6 w-6" />
              Workflow Templates
            </h1>
          </div>
          
          <div className="flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="gallery" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                variant={activeCategory === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory('all')}
              >
                All Categories
              </Button>
              
              {TEMPLATE_CATEGORIES.map(category => (
                <Button 
                  key={category.id} 
                  variant={activeCategory === category.id ? "default" : "outline"} 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {filteredTemplates.map(template => (
                <GlassCard key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleFavorite(template.id)}
                      >
                        <Star 
                          className={`h-5 w-5 ${favoriteTemplates.includes(template.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </div>
                    <Badge className="bg-slate-700 text-white">{template.category}</Badge>
                    <CardDescription className="line-clamp-2 mt-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-2">
                      <Button 
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1"
                        variant="default"
                      >
                        Use Template
                      </Button>
                      <Button 
                        onClick={() => handleSaveAsNewTemplate(template)}
                        variant="outline"
                      >
                        Save As
                      </Button>
                    </div>
                  </CardContent>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates
                .filter(template => favoriteTemplates.includes(template.id))
                .map(template => (
                  <GlassCard key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleFavorite(template.id)}
                        >
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                      <Badge className="bg-slate-700 text-white">{template.category}</Badge>
                      <CardDescription className="line-clamp-2 mt-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between gap-2">
                        <Button 
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                          variant="default"
                        >
                          Use Template
                        </Button>
                        <Button 
                          onClick={() => handleSaveAsNewTemplate(template)}
                          variant="outline"
                        >
                          Save As
                        </Button>
                      </div>
                    </CardContent>
                  </GlassCard>
                ))}
              
              {favoriteTemplates.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorite templates yet</h3>
                  <p className="text-gray-500 max-w-md">
                    Click the star icon on any template to add it to your favorites for quick access.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No recently used templates</h3>
              <p className="text-gray-500 max-w-md">
                Templates you use will appear here for quick access in the future.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <WorkflowSaveDialog 
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          onSave={handleSaveTemplate}
          isSaving={isSaving}
          initialName={selectedTemplate?.name ? `Copy of ${selectedTemplate.name}` : ''}
          initialDescription={selectedTemplate?.description || ''}
          initialCategory={selectedTemplate?.category || ''}
          title="Save As Template"
        />
      </div>
    </AppLayout>
  );
}
