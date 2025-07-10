import React, { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Polygon,
  useLoadScript,
} from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { GOOGLE_MAPS_CONFIG, getMapId } from '@/config/google-maps';
import { toast } from 'sonner';
import { WeatherOverlay } from './ui/WeatherOverlay';
import { Cloud } from 'lucide-react';

const mapId = getMapId();
const libraries: ('marker')[] = ['marker'];

interface JobMapProps {
  jobs?: Job[];
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
  }>;
  locationMarkers?: Array<{
    coordinates: [number, number];
    job: Job;
    label?: string;
  }>;
  boundaries?: Array<Array<[number, number]>>;
  autoFit?: boolean;
  showWeatherControls?: boolean;
}

const JobMapInternal = ({
  jobs = [],
  center,
  zoom = 14,
  markers = [],
  locationMarkers = [],
  boundaries = [],
  autoFit = true,
  showWeatherControls = true,
}: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number];
    label?: string;
  } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0',
  };

  const defaultCenter = {
    lat: -28.017112731933594,
    lng: 153.4014129638672,
  };

  const mapCenter = center
    ? { lat: center[1], lng: center[0] }
    : defaultCenter;

  const options = {
    streetViewControl: true,
    mapTypeControl: true,
    mapId: mapId,
    ...(mapId ? {} : { mapTypeId: 'satellite' }),
    zoomControl: true,
  };

  const fitMapToMarkers = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();

    jobs.forEach((job) => {
      if (job.location?.length === 2) {
        bounds.extend({ lat: job.location[1], lng: job.location[0] });
      }
    });

    locationMarkers.forEach((m) =>
      bounds.extend({ lat: m.coordinates[1], lng: m.coordinates[0] })
    );

    markers.forEach((m) =>
      bounds.extend({ lat: m.position[0], lng: m.position[1] })
    );

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
      if ((jobs.length + markers.length + locationMarkers.length) <= 1) {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        }
      }
    }
  }, [jobs, locationMarkers, markers]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);

    // Group jobs by location to handle overlapping markers
    const groupedJobs: { [key: string]: Job[] } = {};
    jobs.forEach(job => {
      if (!job.location || job.location.length < 2) return;
      
      const key = `${job.location[0]},${job.location[1]}`;
      if (!groupedJobs[key]) {
        groupedJobs[key] = [];
      }
      groupedJobs[key].push(job);
    });

    // Create markers with offset positions for overlapping locations
    Object.entries(groupedJobs).forEach(([locationKey, jobsAtLocation]) => {
      const [lng, lat] = locationKey.split(',').map(Number);
      
      jobsAtLocation.forEach((job, index) => {
        // Calculate offset for overlapping markers
        const offset = jobsAtLocation.length > 1 ? 0.0002 : 0; // Small offset
        const angle = (index * 2 * Math.PI) / jobsAtLocation.length;
        const offsetLat = lat + (offset * Math.cos(angle));
        const offsetLng = lng + (offset * Math.sin(angle));

        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; z-index: ${1000 + index};">
            <div style="background: rgba(30,30,30,0.8); color:white; padding:4px 8px; border-radius:12px; backdrop-filter:blur(6px); font-weight:600; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${job.job_number || 'N/A'}
            </div>
            <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" width="24" height="24" style="margin-top:4px;" />
          </div>
        `;

        try {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: {
              lat: offsetLat,
              lng: offsetLng,
            },
            map: mapInstance,
            content: markerElement,
            title: job.customer,
          });

          marker.addListener('gmp-click', () => {
            // Close any existing InfoWindow
            setSelectedJob(null);
            setSelectedLocation(null);
            
            // Open new InfoWindow after a brief delay
            setTimeout(() => {
              setSelectedJob(job);
            }, 100);
          });
        } catch (error) {
          console.warn('Advanced marker failed, fallback marker created');
          const marker = new google.maps.Marker({
            position: {
              lat: offsetLat,
              lng: offsetLng,
            },
            map: mapInstance,
            title: job.customer,
          });

          marker.addListener('click', () => {
            // Close any existing InfoWindow
            setSelectedJob(null);
            setSelectedLocation(null);
            
            // Open new InfoWindow after a brief delay
            setTimeout(() => {
              setSelectedJob(job);
            }, 100);
          });
        }
      });
    });

    if (autoFit) {
      fitMapToMarkers(mapInstance);
    }
  };

  useEffect(() => {
    if (map && autoFit) {
      fitMapToMarkers(map);
    }
  }, [jobs, locationMarkers, markers, map, autoFit, fitMapToMarkers]);

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={options}
        onLoad={onLoad}
      >
        {selectedJob && selectedJob.location && (
          <InfoWindow
            position={{
              lat: selectedJob.location[1],
              lng: selectedJob.location[0],
            }}
            onCloseClick={() => setSelectedJob(null)}
            options={{
              zIndex: 10000,
              maxWidth: 300,
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

      {/* Weather Controls */}
      {showWeatherControls && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowWeatherPanel(!showWeatherPanel)}
            className="mb-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Cloud className="w-4 h-4" />
            {showWeatherPanel ? 'Hide Weather' : 'Show Weather'}
          </button>
          
          {showWeatherPanel && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <WeatherOverlay map={map} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const JobMap = (props: JobMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: libraries,
    version: 'beta',
    mapIds: [mapId],
  });

  if (loadError) return <div className="p-4 text-red-500">Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div className="p-4">Loading maps...</div>;

  return (
    <div className="map-wrapper w-full h-full rounded-md overflow-hidden">
      <JobMapInternal {...props} />
    </div>
  );
};

export default JobMap;
