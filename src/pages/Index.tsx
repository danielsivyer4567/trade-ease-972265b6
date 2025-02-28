
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, UserPlus, Calendar, Brush } from "lucide-react";
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { useState } from "react";
import { JobsOverview } from "@/components/team/JobsOverview";

export default function Index() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);

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

  const locations = [
    { id: 1, name: "Job Site 1", lat: -28.012, lng: 153.402, type: "Plumbing", jobNumber: "PLM-001" },
    { id: 2, name: "Job Site 2", lat: -28.025, lng: 153.410, type: "Electrical", jobNumber: "ELE-001" },
    { id: 3, name: "Job Site 3", lat: -28.020, lng: 153.422, type: "HVAC", jobNumber: "HVAC-001" },
    { id: 4, name: "Headquarters", lat: -28.017, lng: 153.401, type: "Office", jobNumber: "HQ-001" },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Site Map</h2>
            <LoadScript 
              googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
              libraries={["marker"]}
              version="beta"
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                options={mapOptions}
                onLoad={(map) => {
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
                      position: { lat: location.lat, lng: location.lng },
                      map,
                      content: markerElement,
                      title: location.name
                    });

                    marker.addListener('gmp-click', () => {
                      setSelectedLocation({ lat: location.lat, lng: location.lng });
                    });
                  });
                }}
              >
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">
                        {locations.find(l => 
                          l.lat === selectedLocation.lat && 
                          l.lng === selectedLocation.lng
                        )?.name || "Location"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {locations.find(l => 
                          l.lat === selectedLocation.lat && 
                          l.lng === selectedLocation.lng
                        )?.type || "Job Site"}
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => navigate("/jobs")}
                      >
                        View Jobs
                      </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
            <div className="flex justify-end mt-4">
              <Button onClick={() => navigate("/jobs")}>
                View All Jobs
              </Button>
            </div>
          </Card>

          <KeyStatistics />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">Water Heater Installation</p>
                  <p className="text-sm text-gray-500">Completed by Team Red</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Electrical Panel Upgrade</p>
                  <p className="text-sm text-gray-500">In progress - Team Blue</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">HVAC Maintenance</p>
                  <p className="text-sm text-gray-500">Scheduled for tomorrow</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate("/jobs")}>
                    View All
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-500" />
                Upcoming Jobs
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">Bathroom Renovation</p>
                  <p className="text-sm text-gray-500">Tomorrow, 9:00 AM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Kitchen Plumbing</p>
                  <p className="text-sm text-gray-500">Friday, 11:30 AM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Roof Repair</p>
                  <p className="text-sm text-gray-500">Saturday, 10:00 AM</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
                    View Calendar
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Brush className="mr-2 h-5 w-5 text-orange-500" />
              Cleaning Required Jobs
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">HVAC Installation - Smith Residence</p>
                  <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
                </div>
                <Button size="sm" variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
                  Details
                </Button>
              </div>
              <div className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">Bathroom Remodel - Johnson Property</p>
                  <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
                </div>
                <Button size="sm" variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
                  Details
                </Button>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/jobs")}>
                  View All Jobs
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
