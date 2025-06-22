import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

const GoogleMapsTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { apiKey, isLoading, error } = useGoogleMapsApiKey();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Check API key from environment
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    addResult(`✅ Environment API Key: ${envApiKey ? `${envApiKey.substring(0, 10)}...` : 'Not found'}`);

    // Test 2: Check API key from hook
    addResult(`✅ Hook API Key: ${apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found'}`);

    // Test 3: Test Geocoding API
    if (apiKey || envApiKey) {
      const testKey = apiKey || envApiKey;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${testKey}`
        );
        const data = await response.json();
        
        if (data.status === 'OK') {
          addResult('✅ Geocoding API: Working');
        } else {
          addResult(`❌ Geocoding API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
        }
      } catch (error) {
        addResult(`❌ Geocoding API Error: ${error}`);
      }
    }

    // Test 4: Test loading Google Maps script
    if (apiKey || envApiKey) {
      const testKey = apiKey || envApiKey;
      try {
        addResult('🔄 Loading Google Maps script...');
        
        // Remove existing scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${testKey}&callback=initTestMap&libraries=places,geometry`;
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          (window as any).initTestMap = () => {
            addResult('✅ Google Maps script loaded successfully');
            
            // Test map creation
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
              
              addResult('✅ Test map created successfully');
              document.body.removeChild(mapDiv);
            } catch (mapError) {
              addResult(`❌ Map creation failed: ${mapError}`);
            }
            
            resolve();
          };

          script.onerror = () => {
            addResult('❌ Failed to load Google Maps script');
            reject(new Error('Script loading failed'));
          };
        });

        document.head.appendChild(script);
        await loadPromise;
        
      } catch (error) {
        addResult(`❌ Script loading error: ${error}`);
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    if (!isLoading && !error) {
      runTests();
    }
  }, [isLoading, error, apiKey]);

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Google Maps Diagnostic Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading API key...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          )}

          <Button 
            onClick={runTests} 
            disabled={isRunning || isLoading}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Diagnostic Tests'
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Guide:</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>REQUEST_DENIED:</strong> API key restrictions don't allow this domain</p>
              <p><strong>OVER_QUERY_LIMIT:</strong> Billing not enabled or quota exceeded</p>
              <p><strong>API_NOT_ACTIVATED:</strong> Maps JavaScript API not enabled</p>
              <p><strong>INVALID_REQUEST:</strong> Missing or invalid parameters</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Quick Fixes:</h3>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Go to Google Cloud Console → APIs & Services → Credentials</li>
              <li>2. Click on your API key</li>
              <li>3. Under "Application restrictions", add your domain</li>
              <li>4. Enable these APIs: Maps JavaScript API, Geocoding API</li>
              <li>5. Enable billing if using more than free tier</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsTest; 