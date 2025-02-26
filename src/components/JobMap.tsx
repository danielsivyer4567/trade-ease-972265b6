
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Button } from './ui/button';
import { Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobMapProps {
  jobs: Job[];
}

const JobMap = ({ jobs }: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [center, setCenter] = useState({
    lat: -28.017112731933594,
    lng: 153.4014129638672
  });
  const { toast } = useToast();

  const mapContainerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '0.5rem'
  };

  const options = {
    mapTypeId: 'satellite',
    streetViewControl: false,
    mapTypeControl: false,
    mapId: '8f348c1e276da9d5'
  };

  useEffect(() => {
    if (jobs.length > 0 && jobs[0].address) {
      // Geocode the address to get coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: jobs[0].address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          setCenter({
            lat: location.lat(),
            lng: location.lng()
          });
        }
      });
    }
  }, [jobs]);

  const handleNavigate = (job: Job) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [lng, lat] = job.location;
    
    let navigationUrl;
    if (isIOS) {
      navigationUrl = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    } else {
      navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    }

    window.open(navigationUrl, '_blank');
    toast({
      title: "Navigation Started",
      description: "Opening navigation in a new window"
    });
  };

  return (
    <LoadScript 
      googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
      libraries={["places"]}
      version="beta"
    >
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
            <div className="p-2">
              <h3 className="font-semibold mb-1">{selectedJob.customer}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedJob.type}</p>
              <p className="text-sm text-gray-500 mb-2">{selectedJob.date}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleNavigate(selectedJob)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Set to Navigation
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default JobMap;
