import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { WorkflowTemplate } from '@/types/workflow';
import { supabase } from '@/lib/supabaseClient';

interface WorkflowTemplateSelectorProps {
  onSelect: (template: WorkflowTemplate | null) => void;
}

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'residential', name: 'Residential' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'document', name: 'Document Processing' },
  { id: 'safety', name: 'Safety Management' },
  { id: 'payment', name: 'Payment Processing' },
  { id: 'project', name: 'Project Management' },
  { id: 'messaging', name: 'Messaging' }
];

export function WorkflowTemplateSelector({ onSelect }: WorkflowTemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .not('name', 'eq', 'EMPTY');

      if (error) throw error;

      const formattedTemplates = data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: getCategoryFromName(template.name),
        data: template.data,
        created_at: template.created_at
      }));

      setTemplates(formattedTemplates);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const getCategoryFromName = (name: string): string => {
    if (name.toLowerCase().includes('residential')) return 'residential';
    if (name.toLowerCase().includes('commercial')) return 'commercial';
    if (name.toLowerCase().includes('document')) return 'document';
    if (name.toLowerCase().includes('safety')) return 'safety';
    if (name.toLowerCase().includes('payment')) return 'payment';
    if (name.toLowerCase().includes('project')) return 'project';
    if (name.toLowerCase().includes('message')) return 'messaging';
    return 'all';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Create New Workflow</h1>
          <p className="text-muted-foreground">Choose a template to get started or create a blank workflow</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  category.id === 'all' ? 'bg-[#2C3440] text-white hover:bg-[#2C3440]/90' : ''
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white dark:bg-background border rounded-lg p-6 cursor-pointer hover:border-primary transition-all"
                onClick={() => onSelect(template)}
              >
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(template.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 