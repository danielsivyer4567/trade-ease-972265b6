import { supabase } from '@/lib/supabase';

export interface FeatureRequest {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  description: string;
  trade_type?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'in_development' | 'completed';
  admin_notes?: string;
  estimated_effort_hours?: number;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CreateFeatureRequestData {
  title: string;
  description: string;
  trade_type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export class FeatureRequestService {
  /**
   * Check if the current user can request features based on their subscription tier
   */
  static async canRequestFeatures(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('can_request_features');
      
      if (error) {
        console.error('Error checking feature request permission:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking feature request permission:', error);
      return false;
    }
  }

  /**
   * Get the number of feature requests the user can still make
   */
  static async getFeatureRequestLimit(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_feature_request_limit');
      
      if (error) {
        console.error('Error getting feature request limit:', error);
        return 0;
      }
      
      return data || 0;
    } catch (error) {
      console.error('Error getting feature request limit:', error);
      return 0;
    }
  }

  /**
   * Get all feature requests for the current user
   */
  static async getUserFeatureRequests(): Promise<FeatureRequest[]> {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feature requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      return [];
    }
  }

  /**
   * Create a new feature request
   */
  static async createFeatureRequest(requestData: CreateFeatureRequestData): Promise<FeatureRequest | null> {
    try {
      // Check if user can request features
      const canRequest = await this.canRequestFeatures();
      if (!canRequest) {
        throw new Error('Your subscription tier does not allow feature requests');
      }

      // Check if user has remaining requests
      const remainingRequests = await this.getFeatureRequestLimit();
      if (remainingRequests === 0) {
        throw new Error('You have reached your feature request limit');
      }

      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('current_organization_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.current_organization_id) {
        throw new Error('No organization selected');
      }

      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          user_id: user.id,
          organization_id: profile.current_organization_id,
          title: requestData.title,
          description: requestData.description,
          trade_type: requestData.trade_type,
          priority: requestData.priority || 'medium'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating feature request:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error creating feature request:', error);
      throw error;
    }
  }

  /**
   * Update a feature request
   */
  static async updateFeatureRequest(id: string, updates: Partial<FeatureRequest>): Promise<FeatureRequest | null> {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating feature request:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error updating feature request:', error);
      throw error;
    }
  }

  /**
   * Check if user has access to trade calculators
   */
  static async hasTradeCalculatorAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'trade_calculators'
      });

      if (error) {
        console.error('Error checking trade calculator access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking trade calculator access:', error);
      return false;
    }
  }

  /**
   * Check if user has access to external calendar integration
   */
  static async hasExternalCalendarIntegration(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'external_calendar_integration'
      });

      if (error) {
        console.error('Error checking external calendar integration:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking external calendar integration:', error);
      return false;
    }
  }

  /**
   * Check if user has unlimited notification texts
   */
  static async hasUnlimitedNotificationTexts(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'unlimited_notification_texts'
      });

      if (error) {
        console.error('Error checking unlimited notification texts:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking unlimited notification texts:', error);
      return false;
    }
  }

  /**
   * Check if user has unlimited calendars
   */
  static async hasUnlimitedCalendars(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'unlimited_calendars'
      });

      if (error) {
        console.error('Error checking unlimited calendars:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking unlimited calendars:', error);
      return false;
    }
  }

  /**
   * Check if user has accounting integration
   */
  static async hasAccountingIntegration(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'accounting_integration'
      });

      if (error) {
        console.error('Error checking accounting integration:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking accounting integration:', error);
      return false;
    }
  }

  /**
   * Check if user has access to business structure layout map
   */
  static async hasBusinessStructureMapAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'business_structure_map'
      });

      if (error) {
        console.error('Error checking business structure map access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking business structure map access:', error);
      return false;
    }
  }

  /**
   * Check if user has access to NCC Code Search via Voice
   */
  static async hasNCCVoiceSearchAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'ncc_voice_search'
      });

      if (error) {
        console.error('Error checking NCC voice search access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking NCC voice search access:', error);
      return false;
    }
  }

  /**
   * Check if user has access to QBCC Forms Voice Search
   */
  static async hasQBCCVoiceSearchAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'qbcc_voice_search'
      });

      if (error) {
        console.error('Error checking QBCC voice search access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking QBCC voice search access:', error);
      return false;
    }
  }

  /**
   * Check if user has access to Timber Queensland Voice Search
   */
  static async hasTimberQueenslandVoiceSearchAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_feature_access', {
        feature_key: 'timber_queensland_voice_search'
      });

      if (error) {
        console.error('Error checking Timber Queensland voice search access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking Timber Queensland voice search access:', error);
      return false;
    }
  }
} 