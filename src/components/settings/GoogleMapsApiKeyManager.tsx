import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Key, Loader2, Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function GoogleMapsApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [obscuredApiKey, setObscuredApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'loading' | 'configured' | 'not-configured' | 'testing' | 'valid' | 'invalid'>('loading');

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setApiKeyStatus('not-configured');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-maps-key', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      if (data.apiKey) {
        setApiKey(data.apiKey);
        // Create an obscured version of the API key (showing only first and last 4 chars)
        const keyLength = data.apiKey.length;
        if (keyLength > 8) {
          const obscured = data.apiKey.substring(0, 4) + '•'.repeat(keyLength - 8) + data.apiKey.substring(keyLength - 4);
          setObscuredApiKey(obscured);
        } else {
          setObscuredApiKey('•'.repeat(keyLength));
        }
        setApiKeyStatus('configured');
      } else {
        setApiKeyStatus('not-configured');
      }
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
      toast.error('Failed to fetch API key');
      setApiKeyStatus('not-configured');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to save API keys');
        return;
      }

      const { error } = await supabase.functions.invoke('google-maps-key', {
        method: 'POST',
        body: { apiKey },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      // Create an obscured version of the API key (showing only first and last 4 chars)
      const keyLength = apiKey.length;
      if (keyLength > 8) {
        const obscured = apiKey.substring(0, 4) + '•'.repeat(keyLength - 8) + apiKey.substring(keyLength - 4);
        setObscuredApiKey(obscured);
      } else {
        setObscuredApiKey('•'.repeat(keyLength));
      }
      
      setApiKeyStatus('configured');
      toast.success('Google Maps API key saved successfully');
    } catch (error) {
      console.error('Error saving Google Maps API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (!confirm('Are you sure you want to delete your Google Maps API key?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to delete API keys');
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

      setApiKey('');
      setObscuredApiKey('');
      setApiKeyStatus('not-configured');
      toast.success('Google Maps API key deleted successfully');
    } catch (error) {
      console.error('Error deleting Google Maps API key:', error);
      toast.error('Failed to delete API key');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey) {
      toast.error('Please enter an API key to test');
      return;
    }

    setApiKeyStatus('testing');
    setIsTestingApi(true);
    try {
      // Test the API key by making a simple geocoding request
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setApiKeyStatus('valid');
        toast.success('API key is valid');
      } else {
        setApiKeyStatus('invalid');
        toast.error(`API key validation failed: ${data.status}`);
      }
    } catch (error) {
      console.error('Error testing Google Maps API key:', error);
      setApiKeyStatus('invalid');
      toast.error('Failed to test API key');
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google Maps API Integration
        </CardTitle>
        <CardDescription>
          Configure your Google Maps API key to enable mapping features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeyStatus === 'loading' ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : apiKeyStatus === 'configured' ? (
          <>
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>API Key Configured</AlertTitle>
              <AlertDescription>
                Your Google Maps API key is configured and ready to use.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Current API Key</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value={obscuredApiKey}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (apiKey) {
                      navigator.clipboard.writeText(apiKey);
                      toast.success('API key copied to clipboard');
                    }
                  }}
                >
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>API Key Not Configured</AlertTitle>
            <AlertDescription>
              Please enter your Google Maps API key below.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="api-key">Google Maps API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Maps API key"
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
            disabled={isTestingApi || !apiKey}
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
            onClick={handleSaveApiKey}
            disabled={isSaving || !apiKey}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : 'Save API Key'}
          </Button>
        </div>

        {apiKeyStatus === 'configured' && (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDeleteApiKey}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : 'Delete API Key'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 