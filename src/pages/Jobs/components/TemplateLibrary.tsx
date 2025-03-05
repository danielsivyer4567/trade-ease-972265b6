import { Search, LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobTemplate } from "@/types/job";
import { Separator } from "@/components/ui/separator";

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
  const filteredTemplates = templates.filter(template => {
    if (!searchQuery) return true;
    return template.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  return <div>
      <Separator className="my-3 h-[2px] bg-gray-400" />
      <h2 className="text-2xl font-semibold mb-4">Template Library</h2>
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4 px-[5px] py-0">
        <div className="max-w-md mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input type="text" placeholder="Search templates..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => <Card key={index} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-gray-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{template.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => onAttachToJob(template)} className="text-blue-500 hover:text-blue-700">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Attach to Job
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Duration:</span> {template.estimatedDuration}</p>
                <p><span className="font-medium">Price:</span> {template.price}</p>
                <p><span className="font-medium">Category:</span> {template.category}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Materials:</span> {template.materials.join(", ")}
                </p>
              </div>
            </Card>)}
          {filteredTemplates.length === 0 && <div className="col-span-full text-center text-gray-500 py-0">
              No templates found matching '{searchQuery}'
            </div>}
        </div>
      </div>
    </div>;
}
