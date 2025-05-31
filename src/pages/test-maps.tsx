import React, { useEffect, useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function TestMapsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const testGoogleMaps = () => {
    setStatus('loading');
    setErrorMessage('');
    setAuthError('');

    // Remove any existing scripts
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => script.remove());

    // Create script element
    const script = document.createElement('script');
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY';
    
    console.log('Testing with API key:', apiKey.substring(0, 10) + '...');
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initTestMap&libraries=places,geometry`;
    
    // Define callback
    (window as any).initTestMap = () => {
      console.log('Google Maps script loaded successfully');
      
      try {
        // Create a test map
        const mapDiv = document.getElementById('test-map');
        if (mapDiv) {
          const map = new (window as any).google.maps.Map(mapDiv, {
            center: { lat: -28.0167, lng: 153.4000 },
            zoom: 12,
            mapTypeId: 'roadmap'
          });
          
          console.log('Map created successfully:', map);
          setStatus('success');
        }
      } catch (error) {
        console.error('Error creating map:', error);
        setErrorMessage(`Failed to create map: ${error}`);
        setStatus('error');
      }
    };

    // Error handler
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setErrorMessage('Failed to load Google Maps script');
      setStatus('error');
    };

    // Append script
    document.head.appendChild(script);

    // Check for auth errors after a delay
    setTimeout(() => {
      const authErrorElement = document.querySelector('.gm-err-message');
      if (authErrorElement) {
        const errorText = authErrorElement.textContent || 'Unknown auth error';
        setAuthError(errorText);
        console.error('Google Maps Auth Error:', errorText);
      }

      // Also check console for specific errors
      const errorContainer = document.querySelector('.gm-err-container');
      if (errorContainer) {
        console.error('Google Maps Error Container found:', errorContainer);
      }
    }, 2000);
  };

  // Auto-test on mount
  useEffect(() => {
    testGoogleMaps();
  }, []);

  return (
    <BaseLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Google Maps Test Page</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Simple Map Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {status === 'loading' && (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span>Loading Google Maps...</span>
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600">Google Maps loaded successfully!</span>
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-600">Failed to load Google Maps</span>
                    </>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800">Authentication Error:</p>
                        <p className="text-sm text-yellow-700 mt-1">{authError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={testGoogleMaps}
                  disabled={status === 'loading'}
                  className="w-full"
                >
                  Retry Test
                </Button>

                <div 
                  id="test-map" 
                  className="w-full h-[400px] bg-gray-200 rounded-lg border-2 border-gray-300"
                  style={{ minHeight: '400px' }}
                >
                  {status === 'idle' && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Map will appear here
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debugging Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <span className="text-gray-600">API Key: </span>
                  <span className="text-gray-900">
                    {(process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY').substring(0, 10)}...
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Window Location: </span>
                  <span className="text-gray-900">{window.location.href}</span>
                </div>
                <div>
                  <span className="text-gray-600">Protocol: </span>
                  <span className="text-gray-900">{window.location.protocol}</span>
                </div>
                <div>
                  <span className="text-gray-600">Host: </span>
                  <span className="text-gray-900">{window.location.host}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Check the browser console (F12) for detailed error messages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 