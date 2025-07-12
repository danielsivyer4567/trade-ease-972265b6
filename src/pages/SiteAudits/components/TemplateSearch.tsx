
import React from "react";
import { Button } from "@/components/ui/button";
import { TemplateLibrary } from "./TemplateLibrary";
import { JobTemplate } from "@/types/job";

interface TemplateSearchProps {
  templates: JobTemplate[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTemplateSelected: (template: JobTemplate) => void;
  onClose: () => void;
}

export function TemplateSearch({
  templates,
  searchQuery,
  onSearchChange,
  onTemplateSelected,
  onClose
}: TemplateSearchProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Select a Template</h2>
        <Button variant="outline" onClick={onClose}>
          Back to Form
        </Button>
      </div>
      <TemplateLibrary 
        templates={templates} 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange} 
        onAttachToJob={onTemplateSelected} 
      />
    </div>
  );
}
