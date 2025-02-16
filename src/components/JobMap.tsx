
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Job } from '@/types/job';

interface JobMapProps {
  jobs: Job[];
}

const JobMap = ({ jobs }: JobMapProps) => {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  const center = {
    lat: -33.8731,  // Updated to Woolworths Town Hall location
    lng: 151.2069
  };

  const options = {
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
  };

  if (!googleApiKey) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <input
          type="text"
          placeholder="Enter your Google Maps API key"
          className="px-4 py-2 border rounded"
          onChange={(e) => setGoogleApiKey(e.target.value)}
        />
        <p className="mt-2 text-sm text-gray-500">
          Get your API key at <a href="https://console.cloud.google.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={googleApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}  // Increased zoom level for better city view
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
