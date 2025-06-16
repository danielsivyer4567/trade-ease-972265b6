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
      console.log('Using Google Maps API key from environment variable');
      setApiKey(envApiKey);
      setIsLoading(false);
      return;
    }

    // If no environment variable, try to get from database
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        console.warn('No session found and no environment variable available');
        setError('No Google Maps API key available');
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-maps-key`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to retrieve API key: ${response.statusText}`);
      }

      const data = await response.json();
      if (data?.apiKey) {
        setApiKey(data.apiKey);
      } else {
        setError('No Google Maps API key found');
      }
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      setError('Failed to fetch Google Maps API key');
      toast.error('Failed to fetch Google Maps API key. Please check your configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (newApiKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        setError('You must be logged in to save API keys');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-maps-key`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey: newApiKey }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to save API key: ${response.statusText}`);
      }

      setApiKey(newApiKey);
      toast.success('Google Maps API key saved successfully');
    } catch (error) {
      console.error('Error saving Google Maps API key:', error);
      setError('Failed to save Google Maps API key');
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
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        setError('You must be logged in to delete API keys');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-maps-key`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to delete API key: ${response.statusText}`);
      }

      setApiKey(null);
      toast.success('Google Maps API key deleted successfully');
    } catch (error) {
      console.error('Error deleting Google Maps API key:', error);
      setError('Failed to delete Google Maps API key');
      toast.error('Failed to delete Google Maps API key');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiKey,
    isLoading,
    error,
    saveApiKey,
    deleteApiKey,
    refreshApiKey: fetchApiKey
  };
} 