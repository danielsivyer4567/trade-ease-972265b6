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
  subscriptionTier: 'free_starter' | 'growing_pain_relief' | 'premium_edge' | 'skeleton_key';
  subscriptionFeatures: any;
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
  const [subscriptionTier, setSubscriptionTier] = useState<'free_starter' | 'growing_pain_relief' | 'premium_edge' | 'skeleton_key'>('free_starter');
  const [subscriptionFeatures, setSubscriptionFeatures] = useState<any>({});
  const [maxOrganizations, setMaxOrganizations] = useState(1);

  // Load user's organizations and current organization
  const loadOrganizations = useCallback(async () => {
    if (!user) {
      console.log('OrganizationContext: No user available, skipping load');
      setIsLoading(false);
      return;
    }

    // Check if user has a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('OrganizationContext: No valid session, skipping load');
      setIsLoading(false);
      return;
    }

    console.log('OrganizationContext: Loading organizations for user:', user.id);
    console.log('OrganizationContext: Session access token exists:', !!session.access_token);
    setIsLoading(true);

    try {
      // First, check if user_profiles exists and has the required columns
      let profileData = null;
      let hasSubscriptionColumns = false;
      
      try {
        console.log('OrganizationContext: Attempting to fetch user profile with subscription data...');
        // Try to get subscription data
        const { data: fullProfile, error: fullProfileError } = await supabase
          .from('user_profiles')
          .select('subscription_tier, max_organizations, current_organization_id, subscription_features')
          .eq('user_id', user.id)
          .single();

        console.log('OrganizationContext: Profile fetch result:', { fullProfile, fullProfileError });

        if (!fullProfileError && fullProfile) {
          profileData = fullProfile;
          hasSubscriptionColumns = true;
        } else if (fullProfileError) {
          console.error('OrganizationContext: Error fetching full profile:', fullProfileError);
        }
      } catch (err) {
        console.warn('OrganizationContext: Subscription columns not available in user_profiles:', err);
      }

      // If subscription columns don't exist, try basic profile
      if (!hasSubscriptionColumns) {
        try {
          console.log('OrganizationContext: Attempting to fetch basic user profile...');
          const { data: basicProfile, error: basicProfileError } = await supabase
            .from('user_profiles')
            .select('user_id, email, name')
            .eq('user_id', user.id)
            .single();

          console.log('OrganizationContext: Basic profile fetch result:', { basicProfile, basicProfileError });

          if (!basicProfileError && basicProfile) {
            // Use default values for missing columns
            profileData = {
              subscription_tier: 'free_starter',
              max_organizations: 1,
              current_organization_id: null,
              subscription_features: {}
            };
          } else if (basicProfileError) {
            console.error('OrganizationContext: Error fetching basic profile:', basicProfileError);
          }
        } catch (err) {
          console.warn('OrganizationContext: Could not load user profile:', err);
        }
      }

      // Set subscription data with defaults if needed
      if (profileData) {
        console.log('OrganizationContext: Setting profile data:', profileData);
        setSubscriptionTier(profileData.subscription_tier || 'free_starter');
        setSubscriptionFeatures(profileData.subscription_features || {});
        setMaxOrganizations(profileData.max_organizations || 1);
      } else {
        console.log('OrganizationContext: Using default profile data');
        // Use defaults if no profile data available
        setSubscriptionTier('free_starter');
        setSubscriptionFeatures({});
        setMaxOrganizations(1);
      }

      // Get user's organizations using the database function
      console.log('OrganizationContext: Fetching user organizations...');
      const { data: orgsData, error: orgsError } = await supabase
        .rpc('get_user_organizations');

      console.log('OrganizationContext: Organizations fetch result:', { orgsData, orgsError });

      if (orgsError) {
        console.error('OrganizationContext: Error loading organizations:', orgsError);
        toast({
          title: 'Error loading organizations',
          description: orgsError.message,
          variant: 'destructive'
        });
      } else if (orgsData) {
        setUserOrganizations(orgsData);

        // Load current organization details
        const currentOrgData = orgsData.find((org: any) => org.is_current);
        if (currentOrgData) {
          console.log('OrganizationContext: Loading current organization details...');
          const { data: orgDetails, error: detailsError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', currentOrgData.organization_id)
            .single();

          if (!detailsError && orgDetails) {
            setCurrentOrganization(orgDetails);
          } else if (detailsError) {
            console.error('OrganizationContext: Error loading current organization details:', detailsError);
          }
        }
      }
    } catch (error) {
      console.error('OrganizationContext: Error in loadOrganizations:', error);
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
      if ((subscriptionTier === 'free_starter' || subscriptionTier === 'growing_pain_relief') && currentOrgCount >= 1) {
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

  const canCreateMoreOrganizations = (subscriptionTier === 'free_starter' || subscriptionTier === 'growing_pain_relief')
    ? userOrganizations.filter(org => org.access_type === 'member').length < 1
    : subscriptionTier === 'skeleton_key' ? true
    : userOrganizations.filter(org => org.access_type === 'member').length < maxOrganizations;

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        userOrganizations,
        isLoading,
        subscriptionTier,
        subscriptionFeatures,
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