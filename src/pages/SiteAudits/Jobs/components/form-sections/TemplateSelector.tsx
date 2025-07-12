
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ListChecks, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { QUICK_TEMPLATES } from "../../constants/templates";
import { JobTemplate } from "@/types/job";
import { useState, useEffect } from "react";

interface TemplateSelectorProps {
  onShowTemplateSearch: () => void;
  applyTemplate: (template: JobTemplate) => void;
}

export function TemplateSelector({ onShowTemplateSearch, applyTemplate }: TemplateSelectorProps) {
  const [userTemplates, setUserTemplates] = useState<JobTemplate[]>([]);
  
  // Load user templates from localStorage for demo purposes
  // In a real app, this would fetch from an API/database
  useEffect(() => {
    const savedTemplates = localStorage.getItem('userJobTemplates');
    if (savedTemplates) {
      try {
        setUserTemplates(JSON.parse(savedTemplates));
      } catch (err) {
        console.error("Error loading user templates:", err);
        setUserTemplates([]);
      }
    }
  }, []);

  // Ensure QUICK_TEMPLATES is not undefined
  const quickTemplates = QUICK_TEMPLATES || [];
  // Ensure userTemplates is not undefined
  const safeUserTemplates = userTemplates || [];
  
  return (
    <div className="space-y-2 flex flex-col justify-end">
      <Label>Templates</Label>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full text-gray-950 bg-slate-400 hover:bg-slate-300">
              <ListChecks className="h-4 w-4 mr-2" />
              Quick Templates
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white w-56">
            {quickTemplates.map(template => (
              <DropdownMenuItem key={template.id} onClick={() => applyTemplate(template)}>
                {template.title}
              </DropdownMenuItem>
            ))}
            
            {safeUserTemplates.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-sm font-medium text-gray-500">
                  My Templates
                </div>
                {safeUserTemplates.map(template => (
                  <DropdownMenuItem 
                    key={template.id} 
                    onClick={() => applyTemplate(template)}
                    className="flex items-center"
                  >
                    <Star className="h-3 w-3 mr-2 text-yellow-500" />
                    {template.title}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onShowTemplateSearch} 
          className="text-gray-950 bg-slate-400 hover:bg-slate-300"
        >
          Browse All
        </Button>
      </div>
    </div>
  );
}
