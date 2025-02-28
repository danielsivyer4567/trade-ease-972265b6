
import React, { useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Briefcase } from 'lucide-react';

interface JobMapProps {
  jobs: Job[];
}

const JobMap = ({ jobs }: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  // Updated coordinates for Gold Coast, Queensland
  const center = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };

  const options = {
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
    mapId: '8f348c1e276da9d5' // Added Map ID for Advanced Markers
  };

  const onLoad = (map: google.maps.Map) => {
    jobs.forEach((job) => {
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.innerHTML = `
        <div class="bg-white p-2 rounded-lg shadow-lg">
          <div class="flex items-center gap-2 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
              <path d="M20 8h-4.7M20 12h-8M20 16h-4.7M2 8h2m0 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8h2m-2 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4h8"/>
            </svg>
            <span>${job.jobNumber || 'N/A'}</span>
          </div>
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

    // Add a marker for the center location
    const centerMarkerElement = document.createElement('div');
    centerMarkerElement.className = 'marker';
    centerMarkerElement.innerHTML = `
      <div class="bg-blue-500 text-white p-2 rounded-lg shadow-lg">
        <div class="font-semibold">Gold Coast</div>
      </div>
    `;

    new google.maps.marker.AdvancedMarkerElement({
      position: center,
      map,
      content: centerMarkerElement,
      title: "Gold Coast"
    });
  };

  return (
    <LoadScript 
      googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
      libraries={["marker"]}
      version="beta"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
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
    </LoadScript>
  );
};

export default JobMap;
