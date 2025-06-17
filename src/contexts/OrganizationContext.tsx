import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  business_type?: string;
  abn?: string;
  acn?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  settings?: any;
  metadata?: any;
}

interface UserOrganization {
  organization_id: string;
  organization_name: string;
  role: string;
  access_type: 'member' | 'agency';
  is_current: boolean;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  userOrganizations: UserOrganization[];
  isLoading: boolean;
  subscriptionTier: 'free' | 'premium' | 'agency';
  canCreateMoreOrganizations: boolean;
  switchOrganization: (organizationId: string) => Promise<boolean>;
  refreshOrganizations: () => Promise<void>;
  createOrganization: (organizationData: Partial<Organization>) => Promise<Organization | null>;
  updateOrganization: (organizationId: string, updates: Partial<Organization>) => Promise<boolean>;
  inviteToOrganization: (email: string, role: string, isAgencyInvite?: boolean) => Promise<boolean>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'agency'>('free');
  const [maxOrganizations, setMaxOrganizations] = useState(1);

  // Load user's organizations and current organization
  const loadOrganizations = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Get user's subscription tier and settings
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_tier, max_organizations, current_organization_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading user profile:', profileError);
      } else if (profileData) {
        setSubscriptionTier(profileData.subscription_tier || 'free');
        setMaxOrganizations(profileData.max_organizations || 1);
      }

      // Get user's organizations using the database function
      const { data: orgsData, error: orgsError } = await supabase
        .rpc('get_user_organizations');

      if (orgsError) {
        console.error('Error loading organizations:', orgsError);
        toast({
          title: 'Error loading organizations',
          description: orgsError.message,
          variant: 'destructive'
        });
      } else if (orgsData) {
        setUserOrganizations(orgsData);

        // Load current organization details
        const currentOrgData = orgsData.find(org => org.is_current);
        if (currentOrgData) {
          const { data: orgDetails, error: detailsError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', currentOrgData.organization_id)
            .single();

          if (!detailsError && orgDetails) {
            setCurrentOrganization(orgDetails);
          }
        }
      }
    } catch (error) {
      console.error('Error in loadOrganizations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Switch to a different organization
  const switchOrganization = async (organizationId: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('switch_organization_context', { target_org_id: organizationId });

      if (error) {
        toast({
          title: 'Error switching organization',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      if (data) {
        // Reload organizations to reflect the change
        await loadOrganizations();
        
        toast({
          title: 'Organization switched',
          description: 'Successfully switched to the selected organization',
        });
        
        // Reload the page to ensure all data is refreshed with new context
        window.location.reload();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error switching organization:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new organization
  const createOrganization = async (organizationData: Partial<Organization>): Promise<Organization | null> => {
    if (!user) return null;

    try {
      // Check if user can create more organizations
      const currentOrgCount = userOrganizations.filter(org => org.access_type === 'member').length;
      if (subscriptionTier === 'free' && currentOrgCount >= 1) {
        toast({
          title: 'Upgrade required',
          description: 'Free accounts can only have one organization. Please upgrade to Premium or Agency.',
          variant: 'destructive'
        });
        return null;
      }

      if (currentOrgCount >= maxOrganizations) {
        toast({
          title: 'Organization limit reached',
          description: `You have reached your limit of ${maxOrganizations} organizations.`,
          variant: 'destructive'
        });
        return null;
      }

      // Create the organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{
          ...organizationData,
          created_by: user.id
        }])
        .select()
        .single();

      if (orgError) {
        toast({
          title: 'Error creating organization',
          description: orgError.message,
          variant: 'destructive'
        });
        return null;
      }

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        }]);

      if (memberError) {
        console.error('Error adding user as owner:', memberError);
      }

      // Switch to the new organization
      await switchOrganization(orgData.id);

      toast({
        title: 'Organization created',
        description: `${orgData.name} has been successfully created.`,
      });

      return orgData;
    } catch (error) {
      console.error('Error creating organization:', error);
      return null;
    }
  };

  // Update organization details
  const updateOrganization = async (organizationId: string, updates: Partial<Organization>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organizationId);

      if (error) {
        toast({
          title: 'Error updating organization',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      // Reload organizations to reflect changes
      await loadOrganizations();

      toast({
        title: 'Organization updated',
        description: 'Organization details have been updated successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error updating organization:', error);
      return false;
    }
  };

  // Invite user to organization
  const inviteToOrganization = async (email: string, role: string, isAgencyInvite: boolean = false): Promise<boolean> => {
    if (!user || !currentOrganization) return false;

    try {
      const { data, error } = await supabase
        .from('organization_invitations')
        .insert([{
          organization_id: currentOrganization.id,
          email,
          role,
          invitation_type: isAgencyInvite ? 'agency' : 'member',
          invited_by: user.id
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error sending invitation',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      // In a real implementation, send email with invitation link
      const inviteLink = `${window.location.origin}/auth?invite=${data.token}`;
      
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}`,
      });

      console.log('Invitation link:', inviteLink);
      return true;
    } catch (error) {
      console.error('Error inviting to organization:', error);
      return false;
    }
  };

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

  const canCreateMoreOrganizations = subscriptionTier === 'free' 
    ? userOrganizations.filter(org => org.access_type === 'member').length < 1
    : userOrganizations.filter(org => org.access_type === 'member').length < maxOrganizations;

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        userOrganizations,
        isLoading,
        subscriptionTier,
        canCreateMoreOrganizations,
        switchOrganization,
        refreshOrganizations,
        createOrganization,
        updateOrganization,
        inviteToOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}; 