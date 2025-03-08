import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';

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

  // Gold Coast coordinates
  const center = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
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
  return <Card className="p-6 py-0 my-0 mx-[4px] bg-slate-300">
      <h2 className="text-xl font-semibold mb-4 text-center">Job Site Map</h2>
      <LoadScript googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw" libraries={["marker"]} version="beta">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} options={mapOptions} onLoad={map => {
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
      }}>
          {selectedLocation && <InfoWindow position={selectedLocation} onCloseClick={() => setSelectedLocation(null)}>
              <div className="p-2">
                <h3 className="font-semibold">
                  {locations.find(l => l.lat === selectedLocation.lat && l.lng === selectedLocation.lng)?.name || "Location"}
                </h3>
                <p className="text-sm text-gray-600">
                  {locations.find(l => l.lat === selectedLocation.lat && l.lng === selectedLocation.lng)?.type || "Job Site"}
                </p>
                <Button size="sm" className="mt-2 w-full" onClick={() => {
              const selectedJobInfo = locations.find(l => l.lat === selectedLocation?.lat && l.lng === selectedLocation?.lng);
              if (selectedJobInfo) {
                // Navigate to the specific job's details page using its ID
                navigate(`/jobs/${selectedJobInfo.id}`);
              } else {
                // Fallback to the jobs list if no specific job is found
                navigate("/jobs");
              }
            }}>
                  View Job Details
                </Button>
              </div>
            </InfoWindow>}
        </GoogleMap>
      </LoadScript>
      <div className="flex justify-end mt-4">
        <Button onClick={() => navigate("/jobs")}>
          View All Jobs
        </Button>
      </div>
    </Card>;
};
export default JobSiteMap;