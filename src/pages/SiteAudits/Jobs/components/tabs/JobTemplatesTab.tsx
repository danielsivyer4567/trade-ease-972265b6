
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TemplateLibrary } from "../TemplateLibrary";
import { JobTemplate } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { QUICK_TEMPLATES } from "../../constants/templates";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function JobTemplatesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTemplates, setAllTemplates] = useState<JobTemplate[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load templates (both system and user-created)
    const templates = [...QUICK_TEMPLATES];
    
    // Add user templates if they exist
    try {
      const savedTemplates = localStorage.getItem('userJobTemplates');
      if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates);
        templates.push(...parsedTemplates);
      }
    } catch (err) {
      console.error("Error loading templates:", err);
    }
    
    setAllTemplates(templates);
  }, []);

  const handleTemplateSelection = (template: JobTemplate) => {
    // In a real app, this would create a job from template
    // For now, just show a toast notification
    toast({
      title: "Template selected",
      description: `Selected template: ${template.title}`
    });
    
    // We could navigate to the new job form with template values
    // navigate("/jobs/new", { state: { template } });
  };
  
  const handleCreateNewTemplate = () => {
    navigate("/jobs/new-template");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SectionHeader title="Job Templates" className="ml-0 mt-2 mb-2" />
        <Button onClick={handleCreateNewTemplate} className="bg-slate-400 hover:bg-slate-300">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      <Separator className="h-[2px] bg-gray-400" />
      
      <TemplateLibrary 
        templates={allTemplates} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onAttachToJob={handleTemplateSelection} 
      />
    </>
  );
}
