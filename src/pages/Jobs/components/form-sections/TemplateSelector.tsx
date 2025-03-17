
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ListChecks } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { QUICK_TEMPLATES } from "../../constants/templates";
import { JobTemplate } from "@/types/job";

interface TemplateSelectorProps {
  onShowTemplateSearch: () => void;
  applyTemplate: (template: JobTemplate) => void;
}

export function TemplateSelector({ onShowTemplateSearch, applyTemplate }: TemplateSelectorProps) {
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
            {QUICK_TEMPLATES.map(template => (
              <DropdownMenuItem key={template.id} onClick={() => applyTemplate(template)}>
                {template.title}
              </DropdownMenuItem>
            ))}
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
