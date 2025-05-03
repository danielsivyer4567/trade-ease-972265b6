import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowTemplate } from '@/types/workflow';

interface WorkflowTemplateSelectorProps {
  onSelect: (template: WorkflowTemplate | null) => void;
  templates: WorkflowTemplate[];
}

export function WorkflowTemplateSelector({ onSelect, templates }: WorkflowTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-primary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge>{template.category}</Badge>
            </div>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              <div>Nodes: {template.data.nodes.length}</div>
              <div>Connections: {template.data.edges.length}</div>
            </div>
            <Button 
              onClick={() => onSelect(template)} 
              className="w-full mt-4"
            >
              Use This Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 