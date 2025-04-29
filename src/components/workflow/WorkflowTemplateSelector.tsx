import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles, AlertCircle, RefreshCcw, Calendar, User, ArrowRight } from "lucide-react";
import { WorkflowTemplate } from '@/types/workflow';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

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

function TemplateCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}

function TemplateCard({ template, onClick }: { template: WorkflowTemplate; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:border-primary transition-all hover:shadow-md overflow-hidden group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {template.name}
          </CardTitle>
          {template.recommended && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-yellow-800 dark:text-yellow-400">Recommended</span>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(template.created_at || Date.now()), 'MMM d, yyyy')}</span>
          </div>
          <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function WorkflowTemplateSelector({ onSelect }: WorkflowTemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .not('name', 'eq', 'EMPTY');

      if (error) {
        throw new Error(error.message);
      }

      const formattedTemplates = data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: getCategoryFromName(template.name),
        data: template.data,
        recommended: false,
        user_id: template.user_id,
        created_at: template.created_at
      }));

      setTemplates(formattedTemplates);
    } catch (err) {
      setError({
        message: 'Failed to load templates',
        details: err instanceof Error ? err.message : 'An unexpected error occurred'
      });
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
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
          <CardDescription>
            Choose a template to get started or create a blank workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  disabled={loading || !!error}
                />
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                  disabled={loading || !!error}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <ScrollArea className="h-[600px]">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TemplateCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{error.message}</AlertTitle>
                    {error.details && (
                      <AlertDescription className="mt-2">
                        <div className="text-sm font-mono bg-destructive/10 p-2 rounded">
                          {error.details}
                        </div>
                      </AlertDescription>
                    )}
                  </Alert>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={fetchTemplates}
                      className="flex items-center space-x-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      <span>Try Again</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => onSelect(null)}
                    >
                      Start from Scratch
                    </Button>
                  </div>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <div className="text-center">
                    <p className="text-lg font-medium">No templates found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {search ? 'Try adjusting your search or filters' : 'No templates available for this category'}
                    </p>
                  </div>
                  {search && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSearch('')}
                        size="sm"
                      >
                        Clear search
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategory('all')}
                        size="sm"
                      >
                        Show all categories
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => onSelect(template)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 