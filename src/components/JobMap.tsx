
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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

  const center = {
    lat: -33.8700,
    lng: 151.2099
  };

  const options = {
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={options}
      >
        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={{ lat: job.location[1], lng: job.location[0] }}
            onClick={() => setSelectedJob(job)}
          />
        ))}

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
