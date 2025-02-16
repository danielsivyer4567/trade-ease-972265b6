
import React, { useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import type { Job } from '@/types/job';

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
    mapTypeId: 'roadmap',
    streetViewControl: false,
    mapTypeControl: false,
  };

  const onLoad = (map: google.maps.Map) => {
    jobs.forEach((job) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: job.location[1], lng: job.location[0] },
        map,
        title: job.customer
      });
      marker.addListener('click', () => setSelectedJob(job));
    });

    // Add a marker for the center location
    new google.maps.marker.AdvancedMarkerElement({
      position: center,
      map,
      title: "Gold Coast"
    });
  };

  return (
    <LoadScript 
      googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
      libraries={["maps", "marker"]}
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
