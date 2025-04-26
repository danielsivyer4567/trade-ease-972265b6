import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, InfoWindow, LoadScriptProps } from '@react-google-maps/api';
import { MapPin, AlertCircle } from "lucide-react";

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

  const handleLoadError = (error: Error) => {
    console.error("Failed to load Google Maps:", error);
    setMapError("Failed to load Google Maps. Please check your internet connection.");
  };

  return (
    <Card className="p-6 py-4 bg-slate-100 flex flex-col">
      {mapError ? (
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-md text-red-500">
          <AlertCircle className="mr-2" />
          <p>{mapError}</p>
        </div>
      ) : (
        <div className="relative border-4 border-black rounded-md overflow-hidden">
          {/* Job Site Map text overlay */}
          <div className="absolute top-4 left-4 z-10 bg-black/30 px-3 py-1.5 rounded-md backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white drop-shadow-md">Job Site Map</h2>
          </div>
          
          {/* Map Controls - moved more to the left */}
          <div className="absolute top-4 right-20 z-10 flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-white text-xs md:text-sm shadow-md" 
              onClick={() => navigate("/property-boundaries")}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Property Boundaries
            </Button>
            <Button 
              variant="default" 
              className="bg-primary/90 hover:bg-primary text-xs md:text-sm shadow-md" 
              onClick={() => navigate("/jobs")}
            >
              View All Jobs
            </Button>
          </div>
          
          <LoadScript 
            googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw" 
            libraries={["marker"]} 
            version="beta"
            onError={handleLoadError}
          >
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
                  console.error("Error setting up map:", error);
                  setMapError("Error initializing map components.");
                }
              }}
            >
              {selectedLocation && (
                <InfoWindow position={selectedLocation} onCloseClick={() => setSelectedLocation(null)}>
                  <div className="p-2">
                    <h3 className="font-semibold">
                      {locations.find(l => l.lat === selectedLocation.lat && l.lng === selectedLocation.lng)?.name || "Location"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locations.find(l => l.lat === selectedLocation.lat && l.lng === selectedLocation.lng)?.type || "Job Site"}
                    </p>
                    <Button 
                      size="sm" 
                      variant="default"
                      className="mt-2 w-full bg-primary hover:bg-primary/90" 
                      onClick={() => {
                        const selectedJobInfo = locations.find(l => l.lat === selectedLocation?.lat && l.lng === selectedLocation?.lng);
                        if (selectedJobInfo) {
                          // Navigate to the specific job's details page using its ID
                          navigate(`/jobs/${selectedJobInfo.id}`);
                        } else {
                          // Fallback to the jobs list if no specific job is found
                          navigate("/jobs");
                        }
                      }}
                    >
                      View Job Details
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </Card>
  );
};

export default JobSiteMap;
