
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Key, Loader2, Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function GCPVisionApiKeyManager() {
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

      const { data, error } = await supabase.functions.invoke('gcp-vision-key', {
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
      console.error('Error fetching GCP Vision API key:', error);
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

      const { error } = await supabase.functions.invoke('gcp-vision-key', {
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
      toast.success('Google Cloud Vision API key saved successfully');
    } catch (error) {
      console.error('Error saving GCP Vision API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (!confirm('Are you sure you want to delete your Google Cloud Vision API key?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to delete API keys');
        return;
      }

      const { error } = await supabase.functions.invoke('gcp-vision-key', {
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
      toast.success('Google Cloud Vision API key deleted successfully');
    } catch (error) {
      console.error('Error deleting GCP Vision API key:', error);
      toast.error('Failed to delete API key');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTestApiKey = async () => {
    const keyToTest = apiKey;
    if (!keyToTest) {
      toast.error('Please enter an API key to test');
      return;
    }

    setApiKeyStatus('testing');
    setIsTestingApi(true);
    try {
      // Use a sample image to test the API key
      const sampleImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
      
      const { data, error } = await supabase.functions.invoke('gcp-vision-analyze', {
        body: { 
          imageBase64: sampleImageBase64,
          apiKey: keyToTest
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setApiKeyStatus('valid');
        toast.success('API key is valid');
      } else {
        setApiKeyStatus('invalid');
        toast.error('API key validation failed');
      }
    } catch (error) {
      console.error('Error testing GCP Vision API key:', error);
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
          Google Cloud Vision API Integration
        </CardTitle>
        <CardDescription>
          Configure your Google Cloud Vision API key to enable document text extraction and image analysis features
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
                Your Google Cloud Vision API key is configured and ready to use.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Current API Key</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    type="text"
                    value={obscuredApiKey}
                    readOnly
                    className="rounded-r-none bg-muted"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={handleDeleteApiKey}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-api-key">Update API Key</Label>
                <Input
                  id="new-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter new API key"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {apiKeyStatus === 'invalid' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Invalid API Key</AlertTitle>
                <AlertDescription>
                  The API key you provided is invalid. Please check and try again.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Google Cloud Vision API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Cloud Vision API key"
              />
              <p className="text-xs text-muted-foreground">
                Your API key can be found in the Google Cloud Console under APIs &amp; Services {'->'} Credentials
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleTestApiKey}
          disabled={isTestingApi || !apiKey}
        >
          {isTestingApi ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing
            </>
          ) : (
            'Test API Key'
          )}
        </Button>
        <Button
          onClick={handleSaveApiKey}
          disabled={isSaving || !apiKey}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Save API Key'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
