
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GCPVisionFormProps {
  gcpVisionKey: string;
  setGcpVisionKey: (value: string) => void;
}

export const GCPVisionForm = ({ 
  gcpVisionKey, 
  setGcpVisionKey 
}: GCPVisionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handleSaveToSupabase = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to save API keys');
        return;
      }

      const { error } = await supabase.functions.invoke('gcp-vision-key', {
        method: 'POST',
        body: { apiKey: gcpVisionKey },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Google Cloud Vision API key saved successfully');
    } catch (error) {
      console.error('Error saving GCP Vision API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!gcpVisionKey) {
      toast.error('Please enter an API key to test');
      return;
    }

    setIsTestingApi(true);
    try {
      // Use a sample image to test the API key
      const sampleImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
      
      const { data, error } = await supabase.functions.invoke('gcp-vision-analyze', {
        body: { 
          imageBase64: sampleImageBase64,
          apiKey: gcpVisionKey
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('API key is valid');
      } else {
        toast.error('API key validation failed');
      }
    } catch (error) {
      console.error('Error testing GCP Vision API key:', error);
      toast.error('Failed to test API key');
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gcp-vision-key">Google Cloud Vision API Key</Label>
        <Input 
          id="gcp-vision-key" 
          type="password" 
          value={gcpVisionKey} 
          onChange={e => setGcpVisionKey(e.target.value)} 
          placeholder="Enter your Google Cloud Vision API key" 
        />
        <p className="text-xs text-gray-500">
          Your API key can be found in the Google Cloud Console under APIs &amp; Services {'->'} Credentials
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          className="w-1/2"
          onClick={handleTestApiKey}
          disabled={isTestingApi || !gcpVisionKey}
        >
          {isTestingApi ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing API Key
            </>
          ) : 'Test API Key'}
        </Button>
        
        <Button 
          type="button" 
          className="w-1/2"
          onClick={handleSaveToSupabase}
          disabled={isLoading || !gcpVisionKey}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : 'Save API Key'}
        </Button>
      </div>
    </div>
  );
};
