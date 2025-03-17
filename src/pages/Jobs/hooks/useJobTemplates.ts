
import { useState, useEffect } from "react";
import { JobTemplate } from "@/types/job";
import { QUICK_TEMPLATES } from "../constants/templates";

export function useJobTemplates() {
  const [allTemplates, setAllTemplates] = useState<JobTemplate[]>([]);
  
  // Initialize with both quick templates and user templates
  useEffect(() => {
    // Start with the quick templates
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
  
  return { allTemplates };
}
