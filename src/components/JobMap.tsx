import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Polygon, useLoadScript } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Briefcase } from 'lucide-react';

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
  autoFit?: boolean; // New prop to control whether map should auto-fit to markers
}

// Define libraries to load
const libraries = ["marker"];

// Create a separate map component without the LoadScript wrapper
const MapComponent = ({ 
  jobs = [], 
  center, 
  zoom = 14, 
  markers = [], 
  locationMarkers = [],
  boundaries = [],
  autoFit = true 
}: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{coordinates: [number, number], label?: string} | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  // Default coordinates for Gold Coast, Queensland if no center provided
  const defaultCenter = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };

  const mapCenter = center 
    ? { lat: center[1], lng: center[0] } 
    : defaultCenter;

  const options = {
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
    mapId: '8f348c1e276da9d5' // Added Map ID for Advanced Markers
  };

  // Function to auto-fit map to all markers
  const fitMapToMarkers = (map: google.maps.Map) => {
    if (!map || (!jobs.length && !markers.length && !locationMarkers.length)) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    // Add job locations to bounds (legacy)
    jobs.forEach(job => {
      if (job.location && job.location[0] && job.location[1]) {
        bounds.extend({ lat: job.location[1], lng: job.location[0] });
      }
    });
    
    // Add location markers to bounds
    locationMarkers.forEach(marker => {
      bounds.extend({ lat: marker.coordinates[1], lng: marker.coordinates[0] });
    });
    
    // Add individual markers to bounds
    markers.forEach(marker => {
      bounds.extend({ lat: marker.position[0], lng: marker.position[1] });
    });
    
    // Skip if no valid bounds
    if (bounds.isEmpty()) return;
    
    // Fit the map to the bounds
    map.fitBounds(bounds);
    
    // Add some padding if there's only one marker
    if ((jobs.length + markers.length + locationMarkers.length) <= 1) {
      // Don't zoom in too much for single markers
      const currentZoom = map.getZoom();
      if (currentZoom && currentZoom > 15) {
        map.setZoom(15);
      }
    }
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Add markers from jobs if provided (legacy support)
    if (jobs.length > 0) {
      jobs.forEach((job) => {
        // Skip if job has no location
        if (!job.location || !job.location[0] || !job.location[1]) return;
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
            <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
            <span>${job.jobNumber || 'N/A'}</span>
          </div>
        `;

        // Create the advanced marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: job.location[1], lng: job.location[0] },
          map: mapInstance,
          content: markerElement,
          title: job.customer
        });

        // Add click listener using the recommended 'gmp-click' event
        marker.addListener('gmp-click', () => {
          setSelectedJob(job);
          setSelectedLocation(null);
        });
      });
    }

    // Add markers from locationMarkers prop (new primary way)
    if (locationMarkers.length > 0) {
      locationMarkers.forEach(locMarker => {
        const { coordinates, job, label } = locMarker;
        
        // Skip if invalid coordinates
        if (!coordinates || !coordinates[0] || !coordinates[1]) return;
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
            <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
            <span>${job.jobNumber || 'N/A'}${label ? ` - ${label}` : ''}</span>
          </div>
        `;

        // Create the advanced marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: coordinates[1], lng: coordinates[0] },
          map: mapInstance,
          content: markerElement,
          title: job.customer
        });

        // Add click listener
        marker.addListener('gmp-click', () => {
          setSelectedJob(job);
          setSelectedLocation({ coordinates, label });
        });
      });
    }

    // Add markers from the markers prop if provided
    if (markers.length > 0) {
      markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
            <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
            <span>${marker.title || 'N/A'}</span>
          </div>
        `;

        new google.maps.marker.AdvancedMarkerElement({
          position: { lat: marker.position[0], lng: marker.position[1] },
          map: mapInstance,
          content: markerElement,
          title: marker.title
        });
      });
    }

    // Add a marker for the center location if no other markers are provided
    if (jobs.length === 0 && markers.length === 0 && locationMarkers.length === 0) {
      const centerMarkerElement = document.createElement('div');
      centerMarkerElement.className = 'marker';
      centerMarkerElement.innerHTML = `
        <div class="text-white bg-blue-500/70 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20 font-semibold">
          Location
        </div>
      `;

      new google.maps.marker.AdvancedMarkerElement({
        position: mapCenter,
        map: mapInstance,
        content: centerMarkerElement,
        title: "Location"
      });
    }
    
    // Draw property boundaries if provided
    if (boundaries.length > 0) {
      boundaries.forEach((boundary, index) => {
        // Convert the boundary points to Google Maps LatLng objects
        const polygonPath = boundary.map(point => ({
          lat: point[1],
          lng: point[0]
        }));
        
        // Create and add the polygon to the map
        new google.maps.Polygon({
          paths: polygonPath,
          strokeColor: '#5D4A9C',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#9b87f5',
          fillOpacity: 0.35,
          map: mapInstance
        });
      });
    }
    
    // Auto fit the map to markers if enabled
    if (autoFit) {
      fitMapToMarkers(mapInstance);
    }
  };
  
  // Effect to handle changes in jobs or markers
  useEffect(() => {
    if (map && autoFit) {
      fitMapToMarkers(map);
    }
  }, [jobs, markers, locationMarkers, map, autoFit]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
    >
      {selectedJob && selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.coordinates[1], lng: selectedLocation.coordinates[0] }}
          onCloseClick={() => {
            setSelectedJob(null);
            setSelectedLocation(null);
          }}
        >
          <div>
            <h3 className="font-semibold">{selectedJob.customer}</h3>
            <p>{selectedJob.title} - {selectedJob.type}</p>
            {selectedLocation.label && (
              <p className="text-sm text-blue-600">{selectedLocation.label}</p>
            )}
            <p className="text-sm text-gray-500">{selectedJob.date}</p>
          </div>
        </InfoWindow>
      )}
      {selectedJob && !selectedLocation && selectedJob.location && (
        <InfoWindow
          position={{ lat: selectedJob.location[1], lng: selectedJob.location[0] }}
          onCloseClick={() => setSelectedJob(null)}
        >
          <div>
            <h3 className="font-semibold">{selectedJob.customer}</h3>
            <p>{selectedJob.type}</p>
            <p className="text-sm text-gray-500">{selectedJob.date}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

// Main JobMap component using useLoadScript hook
const JobMap = (props: JobMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw",
    libraries: libraries as any,
    version: "beta"
  });

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading maps...</div>;
  }

  return <MapComponent {...props} />;
};

export default JobMap;
