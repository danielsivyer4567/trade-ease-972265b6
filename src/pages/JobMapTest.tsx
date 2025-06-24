import React, { useState, useEffect } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleMapsApiKey } from "@/hooks/useGoogleMapsApiKey";
import SharedJobMap from "@/components/shared/SharedJobMap";
import type { Job } from "@/types/job";

export default function JobMapTest() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>({});
  
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .limit(10);
          
        if (error) {
          setError(error.message);
        } else {
          setJobs(data || []);
          
          // Analyze job data
          const jobsWithLocations = data?.filter((job: Job) => 
            (job.location && Array.isArray(job.location) && job.location.length === 2) ||
            (job.locations && Array.isArray(job.locations) && job.locations.length > 0)
          ) || [];
          
          setTestResults({
            totalJobs: data?.length || 0,
            jobsWithLocations: jobsWithLocations.length,
            sampleJob: data?.[0] || null,
            sampleLocation: data?.[0]?.location || null,
            apiKeyConfigured: !!apiKey,
            apiKeyError: apiKeyError
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [apiKey, apiKeyError]);

  const runGoogleMapsTest = async () => {
    if (!apiKey) {
      alert('No API key available');
      return;
    }

    try {
      // Test geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${apiKey}`
      );
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        geocodingTest: data.status === 'OK' ? 'success' : 'error',
        geocodingMessage: data.status === 'OK' ? 'Geocoding API working' : `Error: ${data.status}`
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        geocodingTest: 'error',
        geocodingMessage: err instanceof Error ? err.message : 'Unknown error'
      }));
    }
  };

  return (
    <BaseLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Job Map Test & Diagnostics</h1>
          
          {/* API Key Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Google Maps API Key Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {apiKey ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    API Key: {apiKey ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
                
                {apiKey && (
                  <div className="text-sm text-gray-600">
                    Key: {apiKey.substring(0, 10)}...{apiKey.substring(apiKey.length - 4)}
                  </div>
                )}
                
                {apiKeyError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {apiKeyError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button onClick={runGoogleMapsTest} disabled={!apiKey}>
                  Test Google Maps API
                </Button>
                
                {testResults.geocodingTest && (
                  <div className={`p-3 rounded ${
                    testResults.geocodingTest === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <strong>Geocoding Test:</strong> {testResults.geocodingMessage}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Data Analysis */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading job data...</span>
                </div>
              ) : error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Total Jobs:</strong> {testResults.totalJobs}
                    </div>
                    <div>
                      <strong>Jobs with Locations:</strong> {testResults.jobsWithLocations}
                    </div>
                  </div>
                  
                  {testResults.sampleJob && (
                    <div className="bg-gray-50 p-3 rounded">
                      <strong>Sample Job:</strong>
                      <pre className="text-xs mt-2 overflow-auto">
                        {JSON.stringify(testResults.sampleJob, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {testResults.jobsWithLocations === 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <MapPin className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        No jobs have location data. Jobs need either a <code>location</code> array [lat, lng] or <code>locations</code> array to appear on the map.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Display */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Map Display Test</CardTitle>
            </CardHeader>
            <CardContent>
              {!apiKey ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Cannot display map without Google Maps API key
                  </AlertDescription>
                </Alert>
              ) : testResults.jobsWithLocations === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs with location data to display on map</p>
                </div>
              ) : (
                <div className="h-96">
                  <SharedJobMap 
                    jobs={jobs}
                    height="100%"
                    onJobClick={(job) => console.log('Job clicked:', job)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Troubleshooting Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">If map doesn't load:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Check that your Google Maps API key is valid</li>
                    <li>Ensure Maps JavaScript API is enabled in Google Cloud Console</li>
                    <li>Verify API key restrictions allow your domain</li>
                    <li>Check browser console (F12) for error messages</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">If no jobs appear on map:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Ensure jobs have location data in the database</li>
                    <li>Check that location format is [latitude, longitude]</li>
                    <li>Verify job data is being fetched correctly</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">API Key Setup:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in project root</li>
                    <li>Add: <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_api_key</code></li>
                    <li>Restart development server</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 