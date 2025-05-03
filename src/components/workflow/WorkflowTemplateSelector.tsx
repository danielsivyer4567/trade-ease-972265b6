import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowTemplate } from '@/types/workflow';

// Constants for dark mode
const DARK_GOLD = '#bfa14a';
const DARK_BG = '#18140c';
const DARK_TEXT = '#ffe082';

interface WorkflowTemplateSelectorProps {
  onSelect: (template: WorkflowTemplate | null) => void;
  templates: WorkflowTemplate[];
  workflowDarkMode?: boolean;
}

export function WorkflowTemplateSelector({ onSelect, templates, workflowDarkMode = false }: WorkflowTemplateSelectorProps) {
  // Debug logging to track dark mode state
  useEffect(() => {
    console.log("WorkflowTemplateSelector rendered with darkMode:", workflowDarkMode);
  }, [workflowDarkMode]);

  // Pre-process templates to ensure they have workflowDarkMode flag
  const templatesWithDarkMode = templates.map(template => {
    // Deep clone the template to avoid mutations
    const processedTemplate = { ...template };
    
    // Ensure nodes have workflowDarkMode property
    if (processedTemplate.data?.nodes?.length > 0) {
      processedTemplate.data = { 
        ...processedTemplate.data,
        nodes: processedTemplate.data.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            workflowDarkMode
          }
        }))
      };
    }
    
    return processedTemplate;
  });

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    // Manually add workflowDarkMode to template data before passing it up
    const templateWithDarkMode = {
      ...template,
      workflowDarkMode,
      data: {
        ...template.data,
        nodes: template.data.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            workflowDarkMode
          }
        }))
      }
    };
    
    console.log("Selecting template with darkMode:", workflowDarkMode);
    onSelect(templateWithDarkMode);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6" 
         style={workflowDarkMode ? { 
           background: DARK_BG,
           minHeight: '100%',
           width: '100%'
         } : {}}>
      {templatesWithDarkMode.map((template) => (
        <Card 
          key={template.id} 
          className="overflow-hidden hover:shadow-md transition-shadow border-l-4" 
          style={workflowDarkMode ? { 
            background: DARK_BG,
            color: DARK_TEXT,
            borderColor: DARK_GOLD,
            borderLeftColor: DARK_GOLD
          } : {
            borderLeftColor: 'hsl(var(--primary))'
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle 
                className="text-lg"
                style={workflowDarkMode ? { color: DARK_GOLD } : {}}
              >
                {template.name}
              </CardTitle>
              <Badge 
                style={workflowDarkMode ? { 
                  backgroundColor: DARK_GOLD, 
                  color: DARK_BG 
                } : {}}
              >
                {template.category}
              </Badge>
            </div>
            <CardDescription 
              style={workflowDarkMode ? { color: DARK_TEXT } : {}}
            >
              {template.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="text-sm"
              style={workflowDarkMode ? { color: DARK_TEXT } : { color: '#6b7280' }}
            >
              <div>Nodes: {template.data.nodes.length}</div>
              <div>Connections: {template.data.edges.length}</div>
            </div>
            <Button 
              onClick={() => handleTemplateSelect(template)} 
              className="w-full mt-4"
              style={workflowDarkMode ? { 
                backgroundColor: DARK_GOLD, 
                color: '#000000' 
              } : {}}
            >
              Use This Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 