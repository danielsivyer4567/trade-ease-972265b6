import { supabase } from "@/integrations/supabase/client";
import { Automation } from "@/pages/Automations/types";
import { logger } from "@/utils/logger";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: automation, error } = await supabase
        .from('automations')
        .insert({
          ...params,
          created_at: new Date().toISOString(),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Automation created successfully:', automation);
      return { success: true, automation };
    } catch (error) {
      logger.error('Failed to create automation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Get all automations
   */
  list: async (): Promise<{ success: boolean; automations?: Automation[]; error?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: automations, error } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, automations };
    } catch (error) {
      logger.error('Failed to list automations:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Get automation by ID
   */
  get: async (id: number): Promise<{ success: boolean; automation?: Automation; error?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: automation, error } = await supabase
        .from('automations')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      return { success: true, automation };
    } catch (error) {
      logger.error('Failed to get automation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Update automation
   */
  update: async (id: number, updates: Partial<CreateAutomationParams>): Promise<{ success: boolean; automation?: Automation; error?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: automation, error } = await supabase
        .from('automations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      logger.info('Automation updated successfully:', { id, updates });
      return { success: true, automation };
    } catch (error) {
      logger.error('Failed to update automation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Delete automation
   */
  delete: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      logger.info('Automation deleted successfully:', id);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete automation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Toggle automation active status
   */
  toggleActive: async (id: number, isActive: boolean): Promise<{ success: boolean; error?: string }> => {
    return AutomationService.update(id, { isActive });
  }
}; 