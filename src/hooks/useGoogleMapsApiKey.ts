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
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        console.log('No session found, using environment variable');
        const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!envApiKey) {
          throw new Error('No API key found in environment variables');
        }
        setApiKey(envApiKey);
        setIsLoading(false);
        return;
      }

      console.log('Session found, token:', session.access_token.substring(0, 10) + '...');

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
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      if (data?.apiKey) {
        setApiKey(data.apiKey);
      } else {
        // No API key in database, try environment variable
        console.log('No API key found in database, checking environment variable');
        const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (envApiKey) {
          console.log('Using API key from environment variable');
          setApiKey(envApiKey);
        } else {
          console.warn('No Google Maps API key found in database or environment');
          // Don't throw an error here, just set apiKey to null
          setApiKey(null);
        }
      }
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      
      // If we get an error, try to fall back to environment variable
      const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (envApiKey) {
        console.log('Error fetching from database, using environment variable');
        setApiKey(envApiKey);
        setError(null); // Clear the error since we have a fallback
      } else {
        setError('Failed to fetch Google Maps API key');
        // Only show toast for actual errors, not missing keys
        if (!error.message.includes('No API key found')) {
          toast.error('Failed to fetch Google Maps API key');
        }
      }
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
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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