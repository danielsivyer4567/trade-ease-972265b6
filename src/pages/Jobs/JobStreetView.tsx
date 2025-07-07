import React from 'react';
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

export interface JobStreetViewProps {
  location: [number, number]; // [lng, lat]
}

const JobStreetView: React.FC<JobStreetViewProps> = ({ location }) => {
  const [lng, lat] = location;
  const { apiKey, isLoading, error } = useGoogleMapsApiKey();

  if (isLoading) {
    return (
      <div style={{ width: '100%', height: '255px' }} className="flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading Street View...</div>
      </div>
    );
  }

  if (error || !apiKey) {
    return (
      <div style={{ width: '100%', height: '255px' }} className="flex items-center justify-center bg-gray-100">
        <div className="text-red-500">Street View unavailable: {error || 'No API key'}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '255px' }}>
      <iframe
        title="Street View"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=210&pitch=10&fov=80`}
      />
    </div>
  );
};

export default JobStreetView;
