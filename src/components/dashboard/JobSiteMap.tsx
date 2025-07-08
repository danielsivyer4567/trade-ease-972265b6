import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Loader2, Map, RefreshCw, Navigation } from "lucide-react";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleMapsApiKey } from "@/hooks/useGoogleMapsApiKey";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { MapCard, MapErrorState, MapLoadingState, MapEmptyState, mapInfoWindowStyle } from "@/components/shared/MapCard";
import { chartColors } from "@/components/shared/ChartCard";
import { toast } from "sonner";

// Enhanced InfoWindow component with modern styling
const JobInfoWindow = ({ job, onClose, onViewDetails }) => {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <InfoWindow
      position={job.position}
      onCloseClick={onClose}
      options={{
        pixelOffset: new window.google.maps.Size(0, -30),
        disableAutoPan: false,
        maxWidth: 280,
        zIndex: 1000
      }}
    >
      <div className="p-4 min-w-[250px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {job.customer || 'Unknown Customer'}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {job.title || 'No title available'}
            </p>
          </div>
          {job.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
              {job.status.replace('_', ' ')}
            </span>
          )}
        </div>
        
        {job.address && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-600">{job.address}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Job #{job.job_number || 'N/A'}
          </span>
          <Button
            size="sm"
            onClick={() => onViewDetails(job)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    </InfoWindow>
  );
};

// Custom marker component with status-based styling
const JobMarker = ({ job, onClick, isSelected }) => {
  const getMarkerColor = (status) => {
    switch (status) {
      case 'completed': return chartColors.accent;
      case 'in_progress': return chartColors.primary;
      case 'pending': return chartColors.warning;
      case 'cancelled': return '#ef4444';
      default: return chartColors.secondary;
    }
  };

  return (
    <Marker
      position={job.position}
      title={job.customer || `Job ${job.job_number || 'Unknown'}`}
      onClick={() => onClick(job)}
      options={{
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getMarkerColor(job.status),
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: isSelected ? 3 : 2,
          scale: isSelected ? 12 : 10
        },
        zIndex: isSelected ? 1000 : 100
      }}
    />
  );
};

// Enhanced map component with better controls
const EnhancedJobMap = ({ jobs, onJobClick }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({ lat: -28.0171, lng: 153.4014 });
  const [zoom, setZoom] = useState(12);

  // Find optimal center and zoom based on job locations
  useEffect(() => {
    if (jobs.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      jobs.forEach(job => {
        if (job.position) {
          bounds.extend(job.position);
        }
      });
      
      if (mapRef && jobs.length > 1) {
        mapRef.fitBounds(bounds);
      } else if (jobs.length === 1 && jobs[0].position) {
        setCenter(jobs[0].position);
        setZoom(15);
      }
    }
  }, [jobs, mapRef]);

  const handleMarkerClick = (job) => {
    setSelectedJob(job);
    if (mapRef) {
      mapRef.panTo(job.position);
      mapRef.setZoom(15);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedJob(null);
  };

  const handleViewDetails = (job) => {
    onJobClick(job);
    setSelectedJob(null);
  };

  const handleResetView = () => {
    if (jobs.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      jobs.forEach(job => {
        if (job.position) {
          bounds.extend(job.position);
        }
      });
      if (mapRef) {
        mapRef.fitBounds(bounds);
      }
    }
    setSelectedJob(null);
    toast.success("Map view reset");
  };

  const mapOptions = {
    disableDefaultUI: false,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  const actions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetView}
        className="bg-white hover:bg-gray-50 border-gray-200"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset View
      </Button>
    </>
  );

  return (
    <MapCard
      title="Job Site Locations"
      description={`${jobs.length} job${jobs.length !== 1 ? 's' : ''} with location data`}
      icon={Map}
      iconColor="text-blue-600"
      backgroundGradient="from-blue-50 to-indigo-50"
      height="h-[500px]"
      actions={actions}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={setMapRef}
        onUnmount={() => setMapRef(null)}
      >
        {jobs.map((job, index) => (
          <JobMarker
            key={`${job.id}-${index}`}
            job={job}
            onClick={handleMarkerClick}
            isSelected={selectedJob?.id === job.id}
          />
        ))}
        
        {selectedJob && (
          <JobInfoWindow
            job={selectedJob}
            onClose={handleInfoWindowClose}
            onViewDetails={handleViewDetails}
          />
        )}
      </GoogleMap>
    </MapCard>
  );
};

const JobSiteMap = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: ['places']
  });

  // Fetch and process jobs data
  useEffect(() => {
    let isMounted = true;
    
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Failed to fetch jobs:", error);
          setError(`Database error: ${error.message}`);
        } else if (isMounted) {
          // Process jobs and add positions
          const processedJobs = data?.map(job => {
            if (job.location && Array.isArray(job.location) && job.location.length === 2) {
              return {
                ...job,
                position: { lat: Number(job.location[1]), lng: Number(job.location[0]) }
              };
            }
            return job;
          }).filter(job => job.position) || [];
          
          setJobs(processedJobs);
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
    
    if (apiKey && !apiKeyError) {
      fetchJobs();
    }
    
    return () => {
      isMounted = false;
    };
  }, [apiKey, apiKeyError]);

  const handleJobClick = useCallback((job: Job) => {
    navigate(`/jobs/${job.id}`);
  }, [navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Handle different states
  if (apiKeyError || !apiKey) {
    return (
      <MapCard
        title="Job Site Locations"
        description="Interactive map showing all job locations"
        icon={AlertCircle}
        iconColor="text-red-600"
        backgroundGradient="from-red-50 to-rose-50"
        height="h-[500px]"
      >
        <MapErrorState
          title="Google Maps API Key Required"
          description="Please configure your Google Maps API key to view job locations on the map."
          icon={AlertCircle}
          onRetry={handleRetry}
        />
      </MapCard>
    );
  }

  if (loading || isApiKeyLoading || !isLoaded) {
    return (
      <MapCard
        title="Job Site Locations"
        description="Loading job locations..."
        icon={Map}
        iconColor="text-blue-600"
        backgroundGradient="from-blue-50 to-indigo-50"
        height="h-[500px]"
      >
        <MapLoadingState message="Loading job locations..." />
      </MapCard>
    );
  }

  if (loadError) {
    return (
      <MapCard
        title="Job Site Locations"
        description="Error loading map"
        icon={AlertCircle}
        iconColor="text-red-600"
        backgroundGradient="from-red-50 to-rose-50"
        height="h-[500px]"
      >
        <MapErrorState
          title="Map Loading Error"
          description={`Failed to load Google Maps: ${loadError.message}`}
          icon={AlertCircle}
          onRetry={handleRetry}
        />
      </MapCard>
    );
  }

  if (error) {
    return (
      <MapCard
        title="Job Site Locations"
        description="Error loading jobs"
        icon={AlertCircle}
        iconColor="text-red-600"
        backgroundGradient="from-red-50 to-rose-50"
        height="h-[500px]"
      >
        <MapErrorState
          title="Data Loading Error"
          description={error}
          icon={AlertCircle}
          onRetry={handleRetry}
        />
      </MapCard>
    );
  }

  if (jobs.length === 0) {
    return (
      <MapCard
        title="Job Site Locations"
        description="No jobs with location data found"
        icon={MapPin}
        iconColor="text-gray-600"
        backgroundGradient="from-gray-50 to-slate-50"
        height="h-[500px]"
      >
        <MapEmptyState
          title="No Job Locations"
          description="There are no jobs with location data to display on the map."
          icon={MapPin}
        />
      </MapCard>
    );
  }

  return <EnhancedJobMap jobs={jobs} onJobClick={handleJobClick} />;
};

export default JobSiteMap;

