import { supabase } from '../lib/supabase';
import { UserRole } from '../types/roles';

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const roleService = {
  // Get all organizations the user has access to
  async getUserOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Get user's role in a specific organization
  async getUserRole(organizationId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .rpc('get_user_role', { org_id: organizationId });
    
    if (error) throw error;
    return data;
  },

  // Check if user has a specific role in an organization
  async hasRole(organizationId: string, requiredRole: UserRole): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('has_role', { 
        org_id: organizationId,
        required_role: requiredRole
      });
    
    if (error) throw error;
    return data;
  },

  // Assign a role to a user in an organization
  async assignUserRole(
    targetUserId: string,
    organizationId: string,
    newRole: UserRole
  ): Promise<void> {
    const { error } = await supabase
      .rpc('assign_user_role', {
        target_user_id: targetUserId,
        org_id: organizationId,
        new_role: newRole
      });
    
    if (error) throw error;
  },

  // Get all users and their roles in an organization
  async getOrganizationUsers(organizationId: string): Promise<UserRoleRecord[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Create a new organization (only for directors)
  async createOrganization(name: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update organization details (only for directors)
  async updateOrganization(
    organizationId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', organizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 