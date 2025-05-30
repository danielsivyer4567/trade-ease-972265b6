import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG } from '@/config/google-maps';

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

    // Test 1: Check if API key exists
    addResult({
      test: 'API Key Configuration',
      status: GOOGLE_MAPS_CONFIG.apiKey ? 'success' : 'error',
      message: GOOGLE_MAPS_CONFIG.apiKey 
        ? `API key loaded: ${GOOGLE_MAPS_CONFIG.apiKey.substring(0, 10)}...` 
        : 'No API key found in environment variables'
    });

    // Test 2: Check environment variables
    addResult({
      test: 'Environment Variables',
      status: process.env.VITE_GOOGLE_MAPS_API_KEY ? 'success' : 'warning',
      message: process.env.VITE_GOOGLE_MAPS_API_KEY 
        ? 'Environment variable VITE_GOOGLE_MAPS_API_KEY is set' 
        : 'Using fallback API key from config'
    });

    // Test 3: Try to load Google Maps script
    try {
      addResult({
        test: 'Google Maps Script',
        status: 'loading',
        message: 'Testing script loading...'
      });

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&callback=initMap`;
      
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
        } else {
          addResult({
            test: 'Google Maps Object',
            status: 'error',
            message: 'google.maps object not found'
          });
        }
      };

      script.onerror = (error) => {
        updateResult('Google Maps Script', 'error', `Failed to load script: ${error}`);
      };

      document.head.appendChild(script);

      // Test 5: Try geocoding API
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
              message: `Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`
            });
          }
        } catch (error) {
          addResult({
            test: 'Geocoding API',
            status: 'error',
            message: `Failed to test Geocoding API: ${error}`
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

    setTimeout(() => setIsRunning(false), 3000);
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
            <li>• <strong>REQUEST_DENIED</strong>: API key has IP/referrer restrictions</li>
            <li>• <strong>OVER_QUERY_LIMIT</strong>: Billing not enabled or quota exceeded</li>
            <li>• <strong>API_NOT_ACTIVATED</strong>: Maps JavaScript API not enabled</li>
            <li>• <strong>INVALID_KEY</strong>: API key is incorrect or expired</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 