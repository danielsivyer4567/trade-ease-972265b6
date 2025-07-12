
import { Search, LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobTemplate } from "@/types/job";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TemplateLibraryProps {
  templates: JobTemplate[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAttachToJob: (template: JobTemplate) => void;
}

export function TemplateLibrary({
  templates,
  searchQuery,
  onSearchChange,
  onAttachToJob
}: TemplateLibraryProps) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const filteredTemplates = templates.filter(template => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Apply category filter
    const matchesCategory = !categoryFilter || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filtering
  const uniqueCategories = Array.from(new Set(templates.map(t => t.category))).filter(Boolean);
  
  return (
    <div>
      <Separator className="my-3 h-[2px] bg-gray-400" />
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          {uniqueCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categoryFilter && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer" 
                  onClick={() => setCategoryFilter(null)}
                >
                  All Categories
                </Badge>
              )}
              {uniqueCategories.map(category => (
                <Badge 
                  key={category} 
                  variant={categoryFilter === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter(category === categoryFilter ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-gray-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{template.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onAttachToJob(template)} 
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Use Template
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Duration:</span> {template.estimatedDuration} hours</p>
                <p><span className="font-medium">Price:</span> ${template.price}</p>
                {template.category && (
                  <p><span className="font-medium">Category:</span> {template.category}</p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Materials:</span> {template.materials?.join(", ") || "None listed"}
                </p>
              </div>
            </Card>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              No templates found matching '{searchQuery}'
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
