import React, { useState } from 'react';
import { GoogleMap, InfoWindow, Polygon } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Briefcase } from 'lucide-react';
import { WithGoogleMaps } from './GoogleMapsProvider';

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

export const JobMap: React.FC<JobMapProps> = ({
  jobs = [],
  center = [-28.017112731933594, 153.4014129638672], // Default to Gold Coast coordinates
  zoom = 13,
  markers = [],
  boundaries = []
}) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };
  
  const mapCenter = {
    lat: center[1],
    lng: center[0]
  };
  
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    scrollwheel: true,
    streetViewControl: true,
    mapTypeId: 'satellite',
    fullscreenControl: true
  };
  
  const onLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    
    // Add job markers to the map
    jobs.forEach(job => {
      const marker = new google.maps.Marker({
        position: { lat: job.location[1], lng: job.location[0] },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#5D4A9C',
          fillOpacity: 0.8,
          strokeWeight: 1,
          strokeColor: '#FFFFFF'
        },
        title: job.customer
      });
      
      // Add click listener to each marker
      marker.addListener('click', () => {
        setSelectedJob(job);
      });
      
      bounds.extend(marker.getPosition()!);
    });
    
    // Add custom markers if provided
    markers.forEach(marker => {
      const newMarker = new google.maps.Marker({
        position: { lat: marker.position[1], lng: marker.position[0] },
        map,
        title: marker.title
      });
      
      bounds.extend(newMarker.getPosition()!);
    });
    
    // If we have markers or jobs, fit the map to their bounds
    if (jobs.length > 0 || markers.length > 0) {
      map.fitBounds(bounds);
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
    <WithGoogleMaps>
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
    </WithGoogleMaps>
  );
};
