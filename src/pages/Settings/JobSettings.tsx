
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Plus, Save, Truck, Trash2 } from 'lucide-react';
import SettingsPageTemplate from './SettingsPageTemplate';
import { AddSupplierCard } from "@/components/integrations/AddSupplierCard";

export default function JobSettings() {
  const [jobStepTemplates, setJobStepTemplates] = useState<JobStep[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>("default");
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState<string>("");
  const [templates, setTemplates] = useState<{[key: string]: JobStep[]}>({
    default: []
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load templates from database
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('job_step_templates')
        .select('*');
      
      if (error) {
        toast({
          title: "Error loading templates",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const templatesMap: {[key: string]: JobStep[]} = { default: [] };
      
      // Transform data from database to our format
      if (data && data.length > 0) {
        data.forEach(template => {
          templatesMap[template.name] = template.steps;
        });
      } else {
        // Set default template if none exists
        templatesMap.default = [
          {
            id: 1,
            title: 'step 1-',
            tasks: [{
              id: '1-0',
              text: '-schedule job date',
              isCompleted: false
            }, {
              id: '1-1',
              text: '-allocate staff',
              isCompleted: false
            }],
            isCompleted: false
          },
          {
            id: 2,
            title: 'step 2-',
            tasks: [{
              id: '2-0',
              text: '-order materials',
              isCompleted: false
            }, {
              id: '2-1',
              text: '-fill out job details',
              isCompleted: false
            }, {
              id: '2-2',
              text: '- management sign off',
              isCompleted: false
            }],
            isCompleted: false
          },
          {
            id: 3,
            title: 'step 3-',
            tasks: [{
              id: '3-0',
              text: '-start job',
              isCompleted: false
            }, {
              id: '3-1',
              text: '-inductions',
              isCompleted: false
            }, {
              id: '3-2',
              text: '-material count check',
              isCompleted: false
            }],
            isCompleted: false
          },
          {
            id: 4,
            title: 'step 4-',
            tasks: [{
              id: '4-0',
              text: '- complete job',
              isCompleted: false
            }, {
              id: '4-1',
              text: '- do quality check',
              isCompleted: false
            }, {
              id: '4-2',
              text: '- site clean up',
              isCompleted: false
            }, {
              id: '4-3',
              text: '- add any variations',
              isCompleted: false
            }],
            isCompleted: false
          },
          {
            id: 5,
            title: 'step5-',
            tasks: [{
              id: '5-0',
              text: '- verify customer is happy',
              isCompleted: false
            }, {
              id: '5-1',
              text: '- customer to sign job is complete as per contract',
              isCompleted: false
            }, {
              id: '5-2',
              text: '-take pics and double check all documents.',
              isCompleted: false
            }, {
              id: '5-3',
              text: '-send invoices with variations',
              isCompleted: false
            }],
            isCompleted: false
          },
          {
            id: 6,
            title: 'step 6',
            tasks: [{
              id: '6-0',
              text: '- mark invoices paid to finalise job',
              isCompleted: false
            }, {
              id: '6-1',
              text: '-automaticly sync to xero',
              isCompleted: false
            }],
            isCompleted: false
          }
        ];
      }

      setTemplates(templatesMap);
      setActiveTemplate("default");
      setJobStepTemplates(templatesMap.default);
    };

    fetchTemplates();
  }, [toast]);

  const updateStepTitle = (stepId: number, newTitle: string) => {
    setJobStepTemplates(prevSteps =>
      prevSteps.map(step => 
        step.id === stepId ? { ...step, title: newTitle } : step
      )
    );
  };

  const updateTaskText = (stepId: number, taskId: string, newText: string) => {
    setJobStepTemplates(prevSteps =>
      prevSteps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              tasks: step.tasks.map(task => 
                task.id === taskId ? { ...task, text: newText } : task
              )
            } 
          : step
      )
    );
  };

  const addNewTask = (stepId: number) => {
    setJobStepTemplates(prevSteps =>
      prevSteps.map(step => {
        if (step.id === stepId) {
          const newTaskId = `${stepId}-${step.tasks.length}`;
          return {
            ...step,
            tasks: [
              ...step.tasks, 
              { id: newTaskId, text: 'New task', isCompleted: false }
            ]
          };
        }
        return step;
      })
    );
  };

  const removeTask = (stepId: number, taskId: string) => {
    setJobStepTemplates(prevSteps =>
      prevSteps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              tasks: step.tasks.filter(task => task.id !== taskId)
            } 
          : step
      )
    );
  };

  const addNewStep = () => {
    const newId = jobStepTemplates.length > 0 
      ? Math.max(...jobStepTemplates.map(s => s.id)) + 1 
      : 1;
      
    setJobStepTemplates(prevSteps => [
      ...prevSteps,
      {
        id: newId,
        title: `Step ${newId}`,
        tasks: [{ id: `${newId}-0`, text: 'New task', isCompleted: false }],
        isCompleted: false
      }
    ]);
  };

  const removeStep = (stepId: number) => {
    setJobStepTemplates(prevSteps => prevSteps.filter(step => step.id !== stepId));
  };

  const saveTemplate = async () => {
    setIsSaving(true);
    
    try {
      // Save the template to the database
      const { error } = await supabase
        .from('job_step_templates')
        .upsert({ 
          name: activeTemplate, 
          steps: jobStepTemplates,
          updated_at: new Date()
        }, { 
          onConflict: 'name' 
        });

      if (error) throw error;

      // Update local state
      setTemplates({
        ...templates,
        [activeTemplate]: [...jobStepTemplates]
      });

      toast({
        title: "Template saved",
        description: `Job step template "${activeTemplate}" has been saved successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error saving template",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createNewTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your new template.",
        variant: "destructive"
      });
      return;
    }

    if (templates[templateName]) {
      toast({
        title: "Template already exists",
        description: "A template with this name already exists.",
        variant: "destructive"
      });
      return;
    }

    // Create a copy of the current template
    const newTemplate = [...jobStepTemplates];
    
    // Update templates with the new template
    setTemplates({
      ...templates,
      [templateName]: newTemplate
    });
    
    // Switch to the new template
    setActiveTemplate(templateName);
    setJobStepTemplates(newTemplate);
    setTemplateName("");

    toast({
      title: "Template created",
      description: `New template "${templateName}" has been created.`
    });
  };

  const switchTemplate = (templateName: string) => {
    setActiveTemplate(templateName);
    setJobStepTemplates(templates[templateName] || []);
  };

  const deleteTemplate = async (name: string) => {
    if (name === 'default') {
      toast({
        title: "Cannot delete default template",
        description: "The default template cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('job_step_templates')
        .delete()
        .eq('name', name);

      if (error) throw error;

      // Update local state
      const newTemplates = { ...templates };
      delete newTemplates[name];
      
      setTemplates(newTemplates);
      
      // Switch to default if we deleted the active template
      if (activeTemplate === name) {
        setActiveTemplate('default');
        setJobStepTemplates(newTemplates.default);
      }

      toast({
        title: "Template deleted",
        description: `Template "${name}" has been deleted.`
      });
    } catch (error: any) {
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <SettingsPageTemplate title="Job Settings" icon={<Briefcase className="h-7 w-7 text-gray-700" />}>
      <div className="space-y-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Job Step Templates</CardTitle>
            <CardDescription>
              Configure step templates that will be used when creating new jobs. These templates define
              the workflow steps and tasks for different types of jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTemplate} onValueChange={switchTemplate} className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  {Object.keys(templates).map(name => (
                    <TabsTrigger key={name} value={name} className="capitalize">
                      {name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-48"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={createNewTemplate}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Template
                  </Button>
                </div>
              </div>

              {Object.keys(templates).map(name => (
                <TabsContent key={name} value={name} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Editing "{name}" Template
                    </h3>
                    <div className="space-x-2">
                      {name !== 'default' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteTemplate(name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete Template
                        </Button>
                      )}
                      <Button 
                        onClick={saveTemplate} 
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? 'Saving...' : 'Save Template'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {jobStepTemplates.map(step => (
                      <Card key={step.id} className="border border-gray-200">
                        <CardHeader className="bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="font-bold bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center">
                                {step.id}
                              </span>
                              <Input
                                value={step.title}
                                onChange={(e) => updateStepTitle(step.id, e.target.value)}
                                className="font-medium"
                              />
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeStep(step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            {step.tasks.map((task, idx) => (
                              <div key={task.id} className="flex items-start gap-2">
                                <span className="text-xs bg-gray-100 px-1.5 py-1 rounded mt-2">
                                  {idx + 1}
                                </span>
                                <Textarea 
                                  value={task.text}
                                  onChange={(e) => updateTaskText(step.id, task.id, e.target.value)}
                                  className="flex-1 min-h-[60px]"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTask(step.id, task.id)}
                                  className="mt-1"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => addNewTask(step.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Task
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button onClick={addNewStep} className="mt-4">
                      <Plus className="h-4 w-4 mr-1" /> Add New Step
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suppliers Management</CardTitle>
            <CardDescription>
              Add and manage suppliers for your jobs to streamline material ordering and vendor relationships.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddSupplierCard />
              {/* Future spot for supplier list */}
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsPageTemplate>
  );
}
