import React from 'react';

export interface JobStreetViewProps {
  location: [number, number]; // [lng, lat]
}

const JobStreetView: React.FC<JobStreetViewProps> = ({ location }) => {
  const [lng, lat] = location;

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
        src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyBcIDk3_FcrH6wEaYpGaLMRuW5GjV2ogkM&location=${lat},${lng}&heading=210&pitch=10&fov=80`}
      />
    </div>
  );
};

export default JobStreetView;
