import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useGoogleMapsApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    setIsLoading(true);
    setError(null);
    
    // First, try to get the API key from environment variables
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (envApiKey) {
      console.log('✅ Google Maps: Using API key from environment variable');
      
      // Trim any whitespace and log details for debugging
      const trimmedApiKey = envApiKey.trim();
      console.log('🔑 Raw API Key length:', envApiKey.length);
      console.log('🔑 Trimmed API Key length:', trimmedApiKey.length);
      console.log('🔑 API Key preview:', `${trimmedApiKey.substring(0, 10)}...${trimmedApiKey.substring(trimmedApiKey.length - 4)}`);
      console.log('🔑 Starts with AIzaSy:', trimmedApiKey.startsWith('AIzaSy'));
      
      // More flexible validation - Google API keys are typically 39 characters and start with AIzaSy
      if (trimmedApiKey.startsWith('AIzaSy') && trimmedApiKey.length >= 35 && trimmedApiKey.length <= 45) {
        setApiKey(trimmedApiKey);
        setIsLoading(false);
        console.log('✅ Google Maps: API key format is valid');
        return;
      } else {
        console.error('❌ Google Maps: Invalid API key format in environment variables');
        console.error('   Expected: Starts with "AIzaSy" and length between 35-45 characters');
        console.error('   Actual: Starts with', `"${trimmedApiKey.substring(0, 6)}"`, 'and length', trimmedApiKey.length);
        setError(`Invalid Google Maps API key format. Expected format: AIzaSy... (length: 35-45), got length: ${trimmedApiKey.length}`);
        setIsLoading(false);
        return;
      }
    }

    console.log('⚠️ Google Maps: No environment variable found, trying database...');

    // If no environment variable, try to get from database using Supabase client
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Google Maps: Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        console.warn('⚠️ Google Maps: No session found and no environment variable available');
        setError('No Google Maps API key available - Please add VITE_GOOGLE_MAPS_API_KEY to your .env file or log in to save one');
        setIsLoading(false);
        return;
      }

      console.log('🔄 Google Maps: Fetching API key from database...');
      const { data, error: functionError } = await supabase.functions.invoke('google-maps-key', {
        method: 'GET'
      });

      if (functionError) {
        console.error('❌ Google Maps: Function error:', functionError);
        throw new Error(`Failed to retrieve API key: ${functionError.message}`);
      }

      if (data?.apiKey) {
        console.log('✅ Google Maps: API key retrieved from database');
        setApiKey(data.apiKey);
      } else {
        console.error('❌ Google Maps: No API key found in database');
        setError('No Google Maps API key found in database');
      }
    } catch (error) {
      console.error('❌ Google Maps: Error fetching API key:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to fetch Google Maps API key: ${errorMessage}`);
      
      // Don't show toast for session-related errors since user might not be logged in yet
      if (!errorMessage.includes('session')) {
        toast.error('Failed to fetch Google Maps API key. Please check your configuration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (newApiKey: string) => {
    setIsLoading(true);
    setError(null);
    
    // Validate API key format before saving
    const trimmedNewApiKey = newApiKey.trim();
    if (!trimmedNewApiKey.startsWith('AIzaSy') || trimmedNewApiKey.length < 35 || trimmedNewApiKey.length > 45) {
      setError(`Invalid Google Maps API key format. Expected: AIzaSy... (length: 35-45), got length: ${trimmedNewApiKey.length}`);
      setIsLoading(false);
      toast.error('Invalid Google Maps API key format. Keys should start with "AIzaSy" and be 35-45 characters long');
      return;
    }
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Google Maps: Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        setError('You must be logged in to save API keys');
        toast.error('Please log in to save API keys');
        return;
      }

      console.log('🔄 Google Maps: Saving API key to database...');
      const { data, error: functionError } = await supabase.functions.invoke('google-maps-key', {
        method: 'POST',
        body: { apiKey: trimmedNewApiKey }
      });

      if (functionError) {
        console.error('❌ Google Maps: Function error:', functionError);
        throw new Error(`Failed to save API key: ${functionError.message}`);
      }

      setApiKey(trimmedNewApiKey);
      console.log('✅ Google Maps: API key saved successfully');
      toast.success('Google Maps API key saved successfully');
    } catch (error) {
      console.error('❌ Google Maps: Error saving API key:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to save Google Maps API key: ${errorMessage}`);
      toast.error('Failed to save Google Maps API key');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Google Maps: Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        setError('You must be logged in to delete API keys');
        toast.error('Please log in to delete API keys');
        return;
      }

      console.log('🔄 Google Maps: Deleting API key from database...');
      const { data, error: functionError } = await supabase.functions.invoke('google-maps-key', {
        method: 'DELETE'
      });

      if (functionError) {
        console.error('❌ Google Maps: Function error:', functionError);
        throw new Error(`Failed to delete API key: ${functionError.message}`);
      }

      setApiKey(null);
      console.log('✅ Google Maps: API key deleted successfully');
      toast.success('Google Maps API key deleted successfully');
    } catch (error) {
      console.error('❌ Google Maps: Error deleting API key:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to delete Google Maps API key: ${errorMessage}`);
      toast.error('Failed to delete Google Maps API key');
    } finally {
      setIsLoading(false);
    }
  };

  // Test the current API key
  const testApiKey = async (keyToTest?: string): Promise<{ success: boolean; error?: string }> => {
    const testKey = keyToTest || apiKey;
    if (!testKey) {
      return { success: false, error: 'No API key to test' };
    }

    console.log('🧪 Google Maps: Testing API key...');
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${testKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        console.log('✅ Google Maps: API key test successful');
        return { success: true };
      } else {
        console.error('❌ Google Maps: API key test failed:', data.status, data.error_message);
        return { 
          success: false, 
          error: `${data.status}${data.error_message ? ': ' + data.error_message : ''}` 
        };
      }
    } catch (error) {
      console.error('❌ Google Maps: API key test network error:', error);
      return { 
        success: false, 
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  return {
    apiKey,
    isLoading,
    error,
    saveApiKey,
    deleteApiKey,
    refetch: fetchApiKey,
    testApiKey
  };
} 