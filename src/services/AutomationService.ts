import { supabase } from "@/integrations/supabase/client";
import { Automation } from "@/pages/Automations/types";

interface CreateAutomationParams {
  title: string;
  description: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  category: string;
}

export const AutomationService = {
  /**
   * Create a new automation
   */
  create: async (params: CreateAutomationParams): Promise<{ success: boolean; automation?: Automation; error?: string }> => {
    try {
      // For demo purposes, we'll store in localStorage
      // In a real app, this would be a database call
      const automations = JSON.parse(localStorage.getItem('automations') || '[]');
      
      const newAutomation: Automation = {
        id: automations.length + 1,
        ...params,
        createdAt: new Date().toISOString(),
      };
      
      automations.push(newAutomation);
      localStorage.setItem('automations', JSON.stringify(automations));
      
      return { success: true, automation: newAutomation };
    } catch (error) {
      console.error('Failed to create automation:', error);
      return { success: false, error: error.message };
    }
  },
}; 