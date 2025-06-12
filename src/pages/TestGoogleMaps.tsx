import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';
import { JobStreetView } from '@/components/JobStreetView';

export default function TestGoogleMaps() {
  const { apiKey, isLoading, error, saveApiKey } = useGoogleMapsApiKey();
  const [testAddress, setTestAddress] = useState('1600 Amphitheatre Parkway, Mountain View, CA 94043');
  const [newApiKey, setNewApiKey] = useState('');

  const handleSaveApiKey = async () => {
    if (newApiKey) {
      await saveApiKey(newApiKey);
      setNewApiKey('');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Google Maps API Test Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Key Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Loading State:</p>
              <p className="font-mono">{isLoading ? 'Loading...' : 'Loaded'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Error:</p>
              <p className="font-mono text-red-600">{error || 'None'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">API Key:</p>
              <p className="font-mono">{apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'}</p>
            </div>
            
            {!apiKey && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Google Maps API Key"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <Button onClick={handleSaveApiKey} disabled={!newApiKey}>
                  Save API Key
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Street View Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter address"
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            
            <div className="border rounded overflow-hidden">
              <JobStreetView 
                address={testAddress}
                height="400px"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 