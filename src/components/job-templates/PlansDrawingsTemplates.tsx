import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Book, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

// Define template types
type TemplateField = {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
};

type JobTemplate = {
  id: string;
  name: string;
  fields: TemplateField[];
  isCustom?: boolean;
};

interface PlansDrawingsTemplatesProps {
  onAddToJob: (templateContent: string) => void;
}

export const PlansDrawingsTemplates = ({ onAddToJob }: PlansDrawingsTemplatesProps) => {
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  // Pre-defined templates
  const templates: JobTemplate[] = [
    {
      id: 'fencing',
      name: 'Fencing',
      fields: [
        { id: 'fence-description', label: 'Fence Description', type: 'textarea', placeholder: 'Describe the fence type and materials' },
        { id: 'meterage', label: 'Meterage', type: 'text', placeholder: 'Length of fencing required' },
        { id: 'colour', label: 'Colour', type: 'text', placeholder: 'Color of the fence' },
        { id: 'sleepers', label: 'Sleepers', type: 'text', placeholder: 'Type and number of sleepers' },
        { id: 'gates', label: 'Gates', type: 'text', placeholder: 'Number and type of gates required' },
        { id: 'removal', label: 'Removal', type: 'text', placeholder: 'Details about old fence removal' },
        { id: 'disposal', label: 'Disposal', type: 'text', placeholder: 'How to dispose of old materials' },
        { id: 'customer-request', label: 'Customer request', type: 'textarea', placeholder: 'Any special requests from the customer' },
        { id: 'access-issues', label: 'Issues with Access', type: 'textarea', placeholder: 'Describe any access issues' },
        { id: 'parking-issues', label: 'Issues with Parking', type: 'textarea', placeholder: 'Describe any parking issues' },
        { id: 'obstacles', label: 'Any potential obstacles that need to be cautious of?', type: 'textarea', placeholder: 'List any potential obstacles or hazards' }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical Work',
      fields: [
        { id: 'electrical-scope', label: 'Scope of Work', type: 'textarea', placeholder: 'Describe the electrical work needed' },
        { id: 'circuit-requirements', label: 'Circuit Requirements', type: 'text', placeholder: 'Number and type of circuits' },
        { id: 'fixture-count', label: 'Fixtures', type: 'text', placeholder: 'Number and type of fixtures' },
        { id: 'special-requirements', label: 'Special Requirements', type: 'textarea', placeholder: 'Any special electrical requirements' }
      ]
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      fields: [
        { id: 'plumbing-description', label: 'Plumbing Description', type: 'textarea', placeholder: 'Describe the plumbing work needed' },
        { id: 'fixtures', label: 'Fixtures', type: 'text', placeholder: 'List fixtures to be installed/repaired' },
        { id: 'pipe-materials', label: 'Pipe Materials', type: 'text', placeholder: 'Type of pipes to be used' },
        { id: 'water-pressure', label: 'Water Pressure Issues', type: 'text', placeholder: 'Any water pressure concerns' }
      ]
    }
  ];

  // Apply a template
  const applyTemplate = (template: JobTemplate) => {
    setSelectedTemplate(template);
    // Initialize empty values for all fields
    const initialValues: Record<string, string> = {};
    template.fields.forEach(field => {
      initialValues[field.id] = '';
    });
    setTemplateValues(initialValues);
  };

  // Handle template field change
  const handleTemplateFieldChange = (fieldId: string, value: string) => {
    setTemplateValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Add template to job
  const addTemplateToJob = () => {
    if (!selectedTemplate) return;
    
    const templateContent = selectedTemplate.fields.map(field => 
      `${field.label}: ${templateValues[field.id] || 'N/A'}`
    ).join('\n\n');
    
    onAddToJob(templateContent);
    
    setShowTemplateDialog(false);
    setSelectedTemplate(null);
    toast.success(`${selectedTemplate.name} template details added`);
  };

  return (
    <>
      <Card className="bg-blue-50 border border-blue-100 mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <Book className="h-8 w-8 mb-2 text-blue-700" />
            <h3 className="text-base font-bold text-blue-800 mb-1">Job Templates</h3>
            <p className="text-sm text-blue-600 mb-4">Add structured details with pre-defined templates</p>
            
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const fencingTemplate = templates.find(t => t.id === 'fencing');
                  if (fencingTemplate) {
                    applyTemplate(fencingTemplate);
                    setShowTemplateDialog(true);
                  }
                }}
              >
                Fencing
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const electricalTemplate = templates.find(t => t.id === 'electrical');
                  if (electricalTemplate) {
                    applyTemplate(electricalTemplate);
                    setShowTemplateDialog(true);
                  }
                }}
              >
                Electrical
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  const plumbingTemplate = templates.find(t => t.id === 'plumbing');
                  if (plumbingTemplate) {
                    applyTemplate(plumbingTemplate);
                    setShowTemplateDialog(true);
                  }
                }}
              >
                Plumbing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name} Template</DialogTitle>
            <DialogDescription>
              Fill in the details for this job
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {selectedTemplate?.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={templateValues[field.id] || ''}
                    onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={templateValues[field.id] || ''}
                    onChange={(e) => handleTemplateFieldChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addTemplateToJob}>
              Add to Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 