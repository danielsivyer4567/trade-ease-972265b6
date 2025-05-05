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
  boundaries?: Array<Array<[number, number]>>;
}

// Define libraries to load
const libraries = ["marker"];

// Create a separate map component without the LoadScript wrapper
const MapComponent = ({ jobs = [], center, zoom = 14, markers = [], boundaries = [] }: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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

  const onLoad = (map: google.maps.Map) => {
    // Add markers from jobs if provided
    if (jobs.length > 0) {
      jobs.forEach((job) => {
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
          map,
          content: markerElement,
          title: job.customer
        });

        // Add click listener using the recommended 'gmp-click' event
        marker.addListener('gmp-click', () => {
          setSelectedJob(job);
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
          map,
          content: markerElement,
          title: marker.title
        });
      });
    }

    // Add a marker for the center location if no other markers are provided
    if (jobs.length === 0 && markers.length === 0) {
      const centerMarkerElement = document.createElement('div');
      centerMarkerElement.className = 'marker';
      centerMarkerElement.innerHTML = `
        <div class="text-white bg-blue-500/70 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20 font-semibold">
          Location
        </div>
      `;

      new google.maps.marker.AdvancedMarkerElement({
        position: mapCenter,
        map,
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
          map: map
        });
      });
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
    >
      {selectedJob && (
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
