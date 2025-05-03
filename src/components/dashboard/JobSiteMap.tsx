import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MapPin, AlertCircle } from "lucide-react";
import { WithGoogleMaps } from "../GoogleMapsProvider";

// Define types for locations and map properties
type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  jobNumber: string;
};

const JobSiteMap = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Gold Coast coordinates
  const center = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
    position: 'relative' as 'relative',
    border: '4px solid black'
  };
  const mapOptions = {
    mapTypeId: 'satellite',
    tilt: 45,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    mapId: '8f348c1e276da9d5'
  };
  const locations: Location[] = [{
    id: 1,
    name: "Job Site 1",
    lat: -28.012,
    lng: 153.402,
    type: "Plumbing",
    jobNumber: "PLM-001"
  }, {
    id: 2,
    name: "Job Site 2",
    lat: -28.025,
    lng: 153.410,
    type: "Electrical",
    jobNumber: "ELE-001"
  }, {
    id: 3,
    name: "Job Site 3",
    lat: -28.020,
    lng: 153.422,
    type: "HVAC",
    jobNumber: "HVAC-001"
  }, {
    id: 4,
    name: "Headquarters",
    lat: -28.017,
    lng: 153.401,
    type: "Office",
    jobNumber: "HQ-001"
  }];

  const handleMapError = (error: Error) => {
    console.error("Error with Google Maps:", error);
    setMapError(error.message);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="relative">
        {mapError ? (
          <div className="p-8 bg-gray-100 text-center h-96 flex flex-col items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-medium">Map Failed to Load</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">{mapError}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        ) : (
          <WithGoogleMaps>
            <GoogleMap 
              mapContainerStyle={mapContainerStyle} 
              center={center} 
              zoom={13} 
              options={mapOptions} 
              onLoad={map => {
                try {
                  // Set initial tilt for Earth-like view
                  map.setTilt(45);

                  // Place markers for each location
                  locations.forEach(location => {
                    const markerElement = document.createElement('div');
                    markerElement.className = 'marker';
                    markerElement.innerHTML = `
                      <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
                        <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
                        <span>${location.jobNumber || 'N/A'}</span>
                      </div>
                    `;
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                      position: {
                        lat: location.lat,
                        lng: location.lng
                      },
                      map,
                      content: markerElement,
                      title: location.name
                    });
                    marker.addListener('gmp-click', () => {
                      setSelectedLocation({
                        lat: location.lat,
                        lng: location.lng
                      });
                    });
                  });
                } catch (error) {
                  handleMapError(error as Error);
                }
              }}
            >
              {selectedLocation && (
                <InfoWindow
                  position={selectedLocation}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold mb-1">
                      {locations.find(l => l.lat === selectedLocation.lat)?.name || "Location"}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {locations.find(l => l.lat === selectedLocation.lat)?.type || "Unknown type"}
                    </p>
                    <Button 
                      className="mt-2 w-full" 
                      variant="secondary" 
                      size="sm"
                      onClick={() => navigate('/jobs')}
                    >
                      View Details
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </WithGoogleMaps>
        )}
      </div>
    </Card>
  );
};

export default JobSiteMap;
