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
      // Debug log
      console.log('Fetching Google Maps API key...');
      console.log('Environment variable:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found, using environment variable');
        // If no session, use environment variable
        const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!envApiKey) {
          throw new Error('No API key found in environment variables');
        }
        setApiKey(envApiKey);
        setIsLoading(false);
        return;
      }

      console.log('Session found, fetching from Supabase');
      const { data, error } = await supabase.functions.invoke('google-maps-key', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data?.apiKey) {
        console.log('API key found in Supabase');
        setApiKey(data.apiKey);
      } else {
        console.log('No API key in Supabase, using environment variable');
        const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!envApiKey) {
          throw new Error('No API key found in environment variables');
        }
        setApiKey(envApiKey);
      }
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      setError('Failed to fetch Google Maps API key');
      toast.error('Failed to fetch Google Maps API key');
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (newApiKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to save API keys');
        return;
      }

      const { error } = await supabase.functions.invoke('google-maps-key', {
        method: 'POST',
        body: { apiKey: newApiKey },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('You must be logged in to delete API keys');
        return;
      }

      const { error } = await supabase.functions.invoke('google-maps-key', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
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