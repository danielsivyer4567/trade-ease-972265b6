import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG, validateGoogleMapsApiKey } from '@/config/google-maps';

interface DebugResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
}

export function GoogleMapsDebug() {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Check if API key exists and validate
    const isApiKeyValid = validateGoogleMapsApiKey();
    addResult({
      test: 'API Key Configuration',
      status: isApiKeyValid ? 'success' : 'error',
      message: isApiKeyValid 
        ? `API key loaded: ${GOOGLE_MAPS_CONFIG.apiKey.substring(0, 10)}...` 
        : 'No valid API key found in environment variables'
    });

    // Test 2: Check environment variables
    const checks = [
      {
        name: 'Environment Variable',
        status: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'success' : 'warning',
        message: import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
          ? `API Key found: ${import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10)}...`
          : 'No API key found in environment variables'
      },
    ];

    // Test 3: Try to load Google Maps script
    try {
      addResult({
        test: 'Google Maps Script',
        status: 'loading',
        message: 'Testing script loading...'
      });

      // Remove any existing Google Maps scripts first
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => script.remove());

      // If no valid API key, don't attempt to load the script
      if (!isApiKeyValid) {
        updateResult('Google Maps Script', 'error', 'Cannot load script without valid API key');
        setIsRunning(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&callback=initMap&libraries=places,geometry`;
      
      // Create a global callback
      (window as any).initMap = () => {
        updateResult('Google Maps Script', 'success', 'Script loaded successfully');
        
        // Test 4: Check if google.maps object exists
        if ((window as any).google && (window as any).google.maps) {
          addResult({
            test: 'Google Maps Object',
            status: 'success',
            message: 'google.maps object is available'
          });
          
          // Test 5: Try to create a simple map
          try {
            const mapDiv = document.createElement('div');
            mapDiv.style.width = '100px';
            mapDiv.style.height = '100px';
            mapDiv.style.display = 'none';
            document.body.appendChild(mapDiv);
            
            const testMap = new (window as any).google.maps.Map(mapDiv, {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8
            });
            
            if (testMap) {
              addResult({
                test: 'Map Creation',
                status: 'success',
                message: 'Successfully created a test map instance'
              });
            }
            
            document.body.removeChild(mapDiv);
          } catch (mapError) {
            addResult({
              test: 'Map Creation',
              status: 'error',
              message: `Failed to create map: ${mapError}`
            });
          }
        } else {
          addResult({
            test: 'Google Maps Object',
            status: 'error',
            message: 'google.maps object not found'
          });
        }
      };

      script.onerror = (error) => {
        console.error("Script loading error:", error);
        updateResult('Google Maps Script', 'error', `Failed to load script. Check browser console.`);
        
        // Try to detect specific error from auth errors in console
        setTimeout(() => {
          // Check if there are any Google Maps auth errors in the page
          const authErrors = document.querySelector('.gm-err-message');
          if (authErrors) {
            const errorText = authErrors.textContent || '';
            addResult({
              test: 'Google Maps Auth',
              status: 'error',
              message: `Authentication error: ${errorText}`
            });
          }
        }, 1000);
      };

      document.head.appendChild(script);

      // Test 6: Try geocoding API
      setTimeout(async () => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${GOOGLE_MAPS_CONFIG.apiKey}`
          );
          const data = await response.json();
          
          if (data.status === 'OK') {
            addResult({
              test: 'Geocoding API',
              status: 'success',
              message: 'Geocoding API is working'
            });
          } else {
            addResult({
              test: 'Geocoding API',
              status: 'error',
              message: `Geocoding API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`
            });
            
            // Provide specific guidance based on error
            if (data.status === 'REQUEST_DENIED') {
              addResult({
                test: 'API Key Configuration',
                status: 'error',
                message: 'API key is denied. Check: 1) API key restrictions, 2) Geocoding API is enabled'
              });
            } else if (data.status === 'OVER_QUERY_LIMIT') {
              addResult({
                test: 'Billing Status',
                status: 'error',
                message: 'Query limit exceeded. Enable billing in Google Cloud Console'
              });
            }
          }
        } catch (error) {
          addResult({
            test: 'Geocoding API',
            status: 'error',
            message: `Failed to test Geocoding API: ${error}`
          });
        }
        
        // Test 7: Check Places API
        try {
          const placesResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Sydney&inputtype=textquery&fields=formatted_address&key=${GOOGLE_MAPS_CONFIG.apiKey}`
          );
          const placesData = await placesResponse.json();
          
          if (placesData.status === 'OK') {
            addResult({
              test: 'Places API',
              status: 'success',
              message: 'Places API is working'
            });
          } else {
            addResult({
              test: 'Places API',
              status: placesData.status === 'REQUEST_DENIED' ? 'warning' : 'error',
              message: `Places API: ${placesData.status}${placesData.error_message ? ' - ' + placesData.error_message : ''}`
            });
          }
        } catch (error) {
          addResult({
            test: 'Places API',
            status: 'warning',
            message: `Could not test Places API: ${error}`
          });
        }
      }, 2000);

    } catch (error) {
      addResult({
        test: 'Script Loading',
        status: 'error',
        message: `Error during diagnostics: ${error}`
      });
    }

    setTimeout(() => setIsRunning(false), 4000);
  };

  const addResult = (result: DebugResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (test: string, status: DebugResult['status'], message: string) => {
    setResults(prev => prev.map(r => 
      r.test === test ? { ...r, status, message } : r
    ));
  };

  const getStatusIcon = (status: DebugResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Google Maps API Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <p className="font-medium">{result.test}</p>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Common Issues:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>REQUEST_DENIED</strong>: API key has IP/referrer restrictions that don't match your domain</li>
            <li>• <strong>OVER_QUERY_LIMIT</strong>: Billing not enabled or quota exceeded</li>
            <li>• <strong>API_NOT_ACTIVATED</strong>: Maps JavaScript API not enabled in Google Cloud Console</li>
            <li>• <strong>INVALID_KEY</strong>: API key is incorrect or expired</li>
            <li>• <strong>RefererNotAllowedMapError</strong>: Add localhost:5173/* and your production domain to allowed referrers</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Quick Fix Steps:</h3>
          <ol className="text-sm text-green-800 space-y-2">
            <li>1. Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Console → Credentials</a></li>
            <li>2. Click on your API key</li>
            <li>3. Under "Application restrictions", select "HTTP referrers"</li>
            <li>4. Add these referrers:
              <ul className="ml-4 mt-1">
                <li>• <code className="bg-gray-200 px-1">localhost:5173/*</code></li>
                <li>• <code className="bg-gray-200 px-1">localhost:5174/*</code></li>
                <li>• <code className="bg-gray-200 px-1">http://localhost:*</code></li>
                <li>• <code className="bg-gray-200 px-1">Your production domain/*</code></li>
              </ul>
            </li>
            <li>5. Under "API restrictions", ensure these APIs are enabled:
              <ul className="ml-4 mt-1">
                <li>• Maps JavaScript API</li>
                <li>• Geocoding API</li>
                <li>• Places API (optional)</li>
              </ul>
            </li>
            <li>6. Save and wait 5 minutes for changes to propagate</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 