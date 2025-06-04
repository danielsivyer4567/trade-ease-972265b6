import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

interface JobStreetViewProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  height?: string;
}

const JobStreetView: React.FC<JobStreetViewProps> = ({
  address,
  city,
  state,
  zipCode,
  height = '350px'
}) => {
  const [hasAddress, setHasAddress] = useState(false);
  const [streetViewUrl, setStreetViewUrl] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY",
  });

  useEffect(() => {
    // Check if we have enough address information to show street view
    const hasValidAddress = Boolean(address && (city || state));
    setHasAddress(hasValidAddress);

    if (hasValidAddress) {
      // Format the address for the URL
      const formattedAddress = encodeURIComponent(
        `${address}, ${city || ''} ${state || ''} ${zipCode || ''}`
      );
      
      // Create Street View URL
      setStreetViewUrl(`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY&location=${formattedAddress}&heading=210&pitch=10&fov=90`);
    }
  }, [address, city, state, zipCode]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full bg-gray-100">Loading maps...</div>;
  }

  if (!hasAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-500">
        <p>No address information available</p>
      </div>
    );
  }

  return (
    <iframe
      width="100%"
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={streetViewUrl}
    ></iframe>
  );
};

export default JobStreetView; 