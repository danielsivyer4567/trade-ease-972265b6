import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Loader2 } from "lucide-react";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import SharedJobMap from "@/components/shared/SharedJobMap";
import { useGoogleMapsApiKey } from "@/hooks/useGoogleMapsApiKey";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const MinimalMap = ({ jobs }) => {
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  if (apiKeyError) return <div className="p-4 text-red-500">API Key Error: {apiKeyError}</div>;
  if (isApiKeyLoading) return <div className="p-4">Loading API key...</div>;
  if (loadError) return <div className="p-4 text-red-500">Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div className="p-4">Loading maps...</div>;

  // Center the map on the first job with a location, or use a default
  const firstJobWithLocation = jobs.find(
    job => Array.isArray(job.location) && job.location.length === 2
  );
  const center = firstJobWithLocation
    ? { lat: Number(firstJobWithLocation.location[1]), lng: Number(firstJobWithLocation.location[0]) }
    : { lat: -28.0171, lng: 153.4014 };

  // Group jobs by location to handle overlapping markers
  const groupJobsByLocation = (jobs) => {
    const grouped = {};
    jobs.forEach(job => {
      if (Array.isArray(job.location) && job.location.length === 2) {
        const key = `${job.location[0]},${job.location[1]}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(job);
      }
    });
    return grouped;
  };

  const groupedJobs = groupJobsByLocation(jobs);

  // Create offset positions for overlapping markers
  const createOffsetPositions = (jobs, basePos) => {
    if (jobs.length === 1) {
      return [{ ...jobs[0], position: basePos }];
    }
    
    const radius = 0.0002; // Small radius for offset
    return jobs.map((job, index) => {
      const angle = (index * 2 * Math.PI) / jobs.length;
      const offsetPos = {
        lat: basePos.lat + (radius * Math.cos(angle)),
        lng: basePos.lng + (radius * Math.sin(angle))
      };
      return { ...job, position: offsetPos };
    });
  };

  // Flatten grouped jobs with offset positions
  const markersToRender = Object.entries(groupedJobs).flatMap(([locationKey, jobsAtLocation]) => {
    const [lng, lat] = locationKey.split(',').map(Number);
    const basePos = { lat, lng };
    return createOffsetPositions(jobsAtLocation, basePos);
  });

  const handleMarkerClick = (job) => {
    // Close any existing InfoWindow
    setActiveInfoWindow(null);
    setSelectedJob(null);
    
    // Open new InfoWindow after a small delay to ensure the previous one closes
    setTimeout(() => {
      setSelectedJob(job);
      setActiveInfoWindow(job.id);
    }, 100);
  };

  const handleInfoWindowClose = () => {
    setSelectedJob(null);
    setActiveInfoWindow(null);
  };

      return (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={14}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
      {markersToRender.map((job, idx) => (
        <Marker
          key={`${job.id}-${idx}`}
          position={job.position}
          title={job.customer || `Job ${job.job_number || idx + 1}`}
          onClick={() => handleMarkerClick(job)}
          options={{
            zIndex: selectedJob?.id === job.id ? 9999 : 1000,
          }}
        />
      ))}
      
      {selectedJob && activeInfoWindow === selectedJob.id && (
        <InfoWindow
          position={selectedJob.position}
          onCloseClick={handleInfoWindowClose}
          options={{
            zIndex: 10000,
          }}
        >
          <div style={{ padding: '8px', maxWidth: '250px' }}>
            <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
              {selectedJob.customer || 'Unknown Customer'}
            </h3>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              {selectedJob.title || 'No title'}
            </p>
            {selectedJob.address && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
                {selectedJob.address}
              </p>
            )}
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#999' }}>
              Job #{selectedJob.job_number || 'N/A'}
            </p>
            {selectedJob.status && (
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#666' }}>
                Status: {selectedJob.status}
              </p>
            )}
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
  
  // Get Google Maps API key status
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

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
      <Card className="p-4 h-full">
        <div className="h-full flex items-center justify-center">
          <Alert className="border-red-200 bg-red-50 max-w-md">
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
        </div>
      </Card>
    );
  }

  // Show loading state
  if (loading || isApiKeyLoading) {
    return (
      <Card className="p-0 h-full">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Loading job locations...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-4 h-full">
        <div className="h-full flex items-center justify-center">
          <Alert className="border-red-200 bg-red-50 max-w-md">
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
        </div>
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
    <Card className="p-0 h-full">
      <div style={{ height: "100%", width: "100%" }}>
        <MinimalMap jobs={jobs} />
      </div>
    </Card>
  );
};

export default JobSiteMap;

