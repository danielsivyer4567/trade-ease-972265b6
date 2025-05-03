import React, { useState, useEffect } from 'react';
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowTemplate } from '@/types/workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

// Predefined workflow templates
const defaultTemplates: WorkflowTemplate[] = [
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
    id: 'job-completion',
    name: 'Job Completion',
    description: 'Workflow for handling job completion tasks',
    category: 'job',
    data: {
      nodes: [
        {
          id: 'update-status',
          type: 'jobNode',
          position: { x: 100, y: 100 },
          data: { label: 'Update Job Status' }
        },
        {
          id: 'send-feedback',
          type: 'emailNode',
          position: { x: 300, y: 100 },
          data: { label: 'Send Feedback Request' }
        },
        {
          id: 'post-social',
          type: 'socialNode',
          position: { x: 500, y: 100 },
          data: { label: 'Post to Social Media' }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: 'update-status',
          target: 'send-feedback'
        },
        {
          id: 'e2',
          source: 'send-feedback',
          target: 'post-social'
        }
      ]
    }
  }
];

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export function WorkflowTemplates({ onSelectTemplate }: WorkflowTemplatesProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(defaultTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFromTemplate = async (template: WorkflowTemplate) => {
    setIsLoading(true);
    try {
      const { success, workflow, error } = await WorkflowService.createWorkflow({
        name: `${template.name} - Copy`,
        description: template.description,
        data: template.data,
        category: template.category,
        isTemplate: false
      });

      if (!success) throw error;

      toast.success('Workflow created from template');
      onSelectTemplate(template);
    } catch (error) {
      console.error('Failed to create workflow from template:', error);
      setError(error instanceof Error ? error : new Error('Failed to create workflow'));
      toast.error('Failed to create workflow from template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">{template.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{template.category}</Badge>
                <Badge variant="outline">{template.data.nodes.length} nodes</Badge>
              </div>
              <Button
                className="w-full"
                onClick={() => handleCreateFromTemplate(template)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create from Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
} 