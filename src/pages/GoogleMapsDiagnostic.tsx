import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GoogleMapsDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    apiKeyPresent: false,
    apiKeyFormat: false,
    scriptLoaded: false,
    googleMapsAvailable: false,
    consoleErrors: [] as string[],
    networkError: null as string | null,
    apiKeyValue: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check API key presence and format
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    const apiKeyPresent = !!apiKey;
    const apiKeyFormat = apiKey.startsWith('AIzaSy') && apiKey.length === 39;

    setDiagnostics(prev => ({
      ...prev,
      apiKeyPresent,
      apiKeyFormat,
      apiKeyValue: apiKey,
    }));

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setDiagnostics(prev => ({ ...prev, googleMapsAvailable: true, scriptLoaded: true }));
    }

    // Capture console errors
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (...args) => {
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      errors.push(errorMessage);
      originalError.apply(console, args);
    };

    // Try to load Google Maps
    if (apiKey && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initDiagnosticMap`;
      script.async = true;
      script.defer = true;

      // Define callback
      (window as any).initDiagnosticMap = () => {
        setDiagnostics(prev => ({ 
          ...prev, 
          scriptLoaded: true,
          googleMapsAvailable: !!(window.google && window.google.maps)
        }));
      };

      script.onerror = (e) => {
        setDiagnostics(prev => ({ 
          ...prev, 
          networkError: 'Failed to load Google Maps script. Check network connection and API key.',
          scriptLoaded: false
        }));
      };

      document.head.appendChild(script);

      // Cleanup
      return () => {
        console.error = originalError;
        if (errors.length > 0) {
          setDiagnostics(prev => ({ ...prev, consoleErrors: errors }));
        }
        delete (window as any).initDiagnosticMap;
        const scriptTag = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (scriptTag) {
          scriptTag.remove();
        }
      };
    }

    return () => {
      console.error = originalError;
    };
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(diagnostics.apiKeyValue);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard",
    });
  };

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === true) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Google Maps API Diagnostic</h1>

        {/* Quick Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>API Key Present</span>
              <StatusIcon status={diagnostics.apiKeyPresent} />
            </div>
            <div className="flex items-center justify-between">
              <span>API Key Format Valid</span>
              <StatusIcon status={diagnostics.apiKeyFormat} />
            </div>
            <div className="flex items-center justify-between">
              <span>Script Loaded</span>
              <StatusIcon status={diagnostics.scriptLoaded} />
            </div>
            <div className="flex items-center justify-between">
              <span>Google Maps Available</span>
              <StatusIcon status={diagnostics.googleMapsAvailable} />
            </div>
          </CardContent>
        </Card>

        {/* API Key Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Key Information</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnostics.apiKeyPresent ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {diagnostics.apiKeyValue.substring(0, 10)}...{diagnostics.apiKeyValue.substring(35)}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyApiKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {!diagnostics.apiKeyFormat && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      The API key format appears to be invalid. Google Maps API keys should start with "AIzaSy" and be 39 characters long.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  No API key found in environment variables. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Console Errors */}
        {diagnostics.consoleErrors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Console Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {diagnostics.consoleErrors.map((error, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertDescription className="font-mono text-xs">
                      {error}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Network Error */}
        {diagnostics.networkError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{diagnostics.networkError}</AlertDescription>
          </Alert>
        )}

        {/* Troubleshooting Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>
                <strong>Check Google Cloud Console:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Ensure the Maps JavaScript API is enabled</li>
                  <li>Verify billing is set up on your project</li>
                  <li>Check API key restrictions (HTTP referrers)</li>
                </ul>
                <Button
                  size="sm"
                  variant="link"
                  className="ml-6 mt-1"
                  onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                >
                  Open Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </li>
              
              <li>
                <strong>For localhost testing:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Add <code>http://localhost:8080/*</code> to allowed referrers</li>
                  <li>Add <code>http://localhost:*</code> for any port</li>
                  <li>Or temporarily remove all restrictions for testing</li>
                </ul>
              </li>

              <li>
                <strong>Common API Key Errors:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li><strong>RefererNotAllowedMapError:</strong> Add your domain to API key restrictions</li>
                  <li><strong>InvalidKeyMapError:</strong> API key is invalid or deleted</li>
                  <li><strong>ApiNotActivatedMapError:</strong> Enable Maps JavaScript API</li>
                  <li><strong>OverQuotaMapError:</strong> Billing issue or quota exceeded</li>
                </ul>
              </li>

              <li>
                <strong>Test with a new API key:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Create a new API key without restrictions</li>
                  <li>Enable Maps JavaScript API</li>
                  <li>Update .env file and restart dev server</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Test Map */}
        <Card>
          <CardHeader>
            <CardTitle>Test Map</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnostics.googleMapsAvailable ? (
              <div className="bg-gray-100 rounded p-4 text-center text-green-600">
                ✓ Google Maps is loaded and available
              </div>
            ) : (
              <div className="bg-gray-100 rounded p-4 text-center text-red-600">
                ✗ Google Maps is not available - Check console for errors
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default GoogleMapsDiagnostic; 