import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Loader2 } from "lucide-react";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import SharedJobMap from "@/components/shared/SharedJobMap";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const MinimalMap = ({ jobs, isLoaded, loadError }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  // Center the map on the first job with a location, or use a default
  const firstJobWithLocation = jobs.find(
    job => Array.isArray(job.location) && job.location.length === 2
  );
  const center = firstJobWithLocation
    ? { lat: Number(firstJobWithLocation.location[1]), lng: Number(firstJobWithLocation.location[0]) }
    : { lat: -28.0171, lng: 153.4014 };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={14}
    >
      {jobs.map((job, idx) =>
        Array.isArray(job.location) && job.location.length === 2 ? (
          <Marker
            key={job.id || idx}
            position={{
              lat: Number(job.location[1]),
              lng: Number(job.location[0])
            }}
            title={job.title || job.job_number || `Job ${idx + 1}`}
            onClick={() => setSelectedJob(job)}
          />
        ) : null
      )}
      <Marker position={{ lat: -27.8822506, lng: 153.2835595 }} title="Test Marker" />
      {selectedJob && Array.isArray(selectedJob.location) && selectedJob.location.length === 2 && (
        <InfoWindow
          position={{ lat: selectedJob.location[1], lng: selectedJob.location[0] }}
          onCloseClick={() => setSelectedJob(null)}
        >
          <div className="p-2 max-w-xs">
            <div className="space-y-2">
              <div className="border-b pb-2">
                <h3 className="font-bold text-lg text-blue-600">{selectedJob.title || 'Job'}</h3>
                <p className="text-sm text-gray-600">Job #{selectedJob.job_number}</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-800">{selectedJob.customer}</p>
                {selectedJob.address && (
                  <p className="text-sm text-gray-600">{selectedJob.address}</p>
                )}
                {selectedJob.city && selectedJob.state && (
                  <p className="text-sm text-gray-600">{selectedJob.city}, {selectedJob.state} {selectedJob.zipCode}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedJob.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                  selectedJob.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  selectedJob.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedJob.status === 'invoiced' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedJob.status?.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{selectedJob.type}</span>
              </div>
              
              {selectedJob.date && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {selectedJob.date}
                </div>
              )}
              
              {selectedJob.description && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Description:</span> {selectedJob.description}
                </div>
              )}
              
              {selectedJob.assignedTeam && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Team:</span> {selectedJob.assignedTeam}
                </div>
              )}
              
              {selectedJob.job_steps && selectedJob.job_steps.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Steps:</span>
                  <div className="mt-1 space-y-1">
                    {selectedJob.job_steps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className={step.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                    {selectedJob.job_steps.length > 3 && (
                      <p className="text-xs text-gray-500">+{selectedJob.job_steps.length - 3} more steps</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const JobSiteMap = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showFullMap, setShowFullMap] = useState(false);
  
  // Hardcoded Google Maps API key
  const apiKey = "AIzaSyCEZfDx6VHz83XX2tnhGRZl3VGSb9WlY1s";
  const isApiKeyLoading = false;
  const apiKeyError = null;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCEZfDx6VHz83XX2tnhGRZl3VGSb9WlY1s",
  });

  // Fetch jobs data
  useEffect(() => {
    let isMounted = true;
    
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*');
          
        if (error) {
          console.error("Failed to fetch jobs:", error);
          setError(`Database error: ${error.message}`);
        } else if (isMounted) {
          setJobs(data || []);
          
          // Debug information
          const jobsWithLocations = data?.filter((job: Job) => 
            (job.location && Array.isArray(job.location) && job.location.length === 2) ||
            (job.locations && Array.isArray(job.locations) && job.locations.length > 0)
          ) || [];
          
          setDebugInfo({
            totalJobs: data?.length || 0,
            jobsWithLocations: jobsWithLocations.length,
            sampleJob: data?.[0] || null,
            apiKeyConfigured: !!apiKey,
            apiKeyError: apiKeyError
          });
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchJobs();
    
    return () => {
      isMounted = false;
    };
  }, [apiKey, apiKeyError]);

  const handleJobClick = useCallback((job: Job) => {
    navigate(`/jobs/${job.id}`);
  }, [navigate]);

  // Count jobs with locations
  const jobsWithLocations = React.useMemo(() => {
    return jobs.filter(job => 
      (job.location && Array.isArray(job.location) && job.location.length === 2) || 
      (job.locations && Array.isArray(job.locations) && job.locations.length > 0)
    ).length;
  }, [jobs]);

  // Show API key error
  if (apiKeyError || !apiKey) {
    return (
      <Card className="p-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="mb-2">
              <strong>Google Maps API Key Issue:</strong> {apiKeyError || "API key not configured"}
            </div>
            <div className="text-sm">
              <p>To fix this:</p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Create a <code className="bg-red-100 px-1 rounded">.env</code> file in your project root</li>
                <li>Add: <code className="bg-red-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Show loading state
  if (loading || isApiKeyLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Loading job locations...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="mb-2">
              <strong>Error loading jobs:</strong> {error}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Show no jobs state
  if (jobs.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-500">No jobs are available to display on the map.</p>
        </div>
      </Card>
    );
  }

  // Show no locations state
  if (jobsWithLocations === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Locations</h3>
          <p className="text-gray-500 mb-4">
            Found {jobs.length} jobs, but none have location data configured.
          </p>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Debug Info:</strong></p>
            <p>Total jobs: {debugInfo.totalJobs}</p>
            <p>Jobs with locations: {jobsWithLocations}</p>
            {debugInfo.sampleJob && (
              <p>Sample job location: {JSON.stringify(debugInfo.sampleJob.location)}</p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Job Locations</h2>
        <div className="text-sm text-gray-500">
          {jobsWithLocations} of {jobs.length} jobs with locations
        </div>
      </div>
      
      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-3 bg-blue-50 rounded text-xs">
          <p><strong>Debug:</strong> API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'}</p>
          <p>Jobs with locations: {jobsWithLocations}</p>
        </div>
      )}
      
      <div style={{ height: "400px", width: "100%" }}>
        <MinimalMap jobs={jobs} isLoaded={isLoaded} loadError={loadError} />
      </div>

      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </Card>
  );
};

export default JobSiteMap;

