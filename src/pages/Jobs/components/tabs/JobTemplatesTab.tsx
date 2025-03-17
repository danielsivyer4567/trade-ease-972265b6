
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TemplateLibrary } from "../TemplateLibrary";
import { JobTemplate } from "@/types/job";
import { useToast } from "@/hooks/use-toast";

export function JobTemplatesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const templates: JobTemplate[] = [
    {
      id: "1",
      title: "Basic Plumbing Fix",
      description: "Standard plumbing repair service",
      type: "Plumbing",
      estimatedDuration: 2,
      price: 150,
      materials: ["Pipes", "Fixtures", "Sealant"],
      category: "Residential"
    },
    {
      id: "2",
      title: "Electrical Wiring",
      description: "Basic electrical wiring service",
      type: "Electrical",
      estimatedDuration: 3,
      price: 200,
      materials: ["Wires", "Switches", "Junction boxes"],
      category: "Commercial"
    },
    {
      id: "3",
      title: "Bathroom Renovation",
      description: "Complete bathroom renovation",
      type: "Renovation",
      estimatedDuration: 40,
      price: 5000,
      materials: ["Tiles", "Fixtures", "Pipes", "Paint"],
      category: "Residential"
    }
  ];

  const handleTemplateSelection = (template: JobTemplate) => {
    toast({
      title: "Template selected",
      description: `Selected template: ${template.title}`
    });
  };

  return (
    <>
      <Separator className="h-[2px] bg-gray-400 my-[8px]" />
      <SectionHeader title="Job Templates" className="ml-0 mt-2 mb-2" />
      <TemplateLibrary 
        templates={templates} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onAttachToJob={handleTemplateSelection} 
      />
    </>
  );
}
