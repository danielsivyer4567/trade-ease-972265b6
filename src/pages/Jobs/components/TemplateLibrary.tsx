import { Search, LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobTemplate } from "@/types/job";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
  return;
}