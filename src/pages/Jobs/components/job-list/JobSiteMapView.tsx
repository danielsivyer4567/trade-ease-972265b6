
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { MapPin, ChevronDown, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  jobNumber: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced' | 'clean-required';
  customer: string;
  address: string;
};

const JobSiteMapView = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [mapType, setMapType] = useState('roadmap');

  // Map configurations
  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.5rem'
  };
  
  const center = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };
  
  const mapOptions = {
    mapTypeId: mapType as google.maps.MapTypeId,
    tilt: 45,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    mapId: '8f348c1e276da9d5'
  };

  // Sample job locations data
  const locations: Location[] = [
    {
      id: "1",
      name: "Plumbing Repair",
      lat: -28.012,
      lng: 153.402,
      type: "Plumbing",
      jobNumber: "PLM-001",
      status: "in-progress",
      customer: "John Smith",
      address: "123 Beach Road, Gold Coast"
    }, 
    {
      id: "2",
      name: "Electrical Installation",
      lat: -28.025,
      lng: 153.410,
      type: "Electrical",
      jobNumber: "ELE-001",
      status: "ready",
      customer: "Sarah Johnson",
      address: "45 Main St, Southport"
    }, 
    {
      id: "3",
      name: "HVAC Maintenance",
      lat: -28.020,
      lng: 153.422,
      type: "HVAC",
      jobNumber: "HVAC-001",
      status: "to-invoice",
      customer: "Michael Brown",
      address: "78 Palm Avenue, Broadbeach"
    }, 
    {
      id: "4",
      name: "Office Headquarters",
      lat: -28.017,
      lng: 153.401,
      type: "Office",
      jobNumber: "HQ-001",
      status: "ready",
      customer: "Trade Ease HQ",
      address: "200 Corporate Drive, Surfers Paradise"
    }
  ];

  // Status color mapping
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ready': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'to-invoice': return 'bg-purple-500';
      case 'invoiced': return 'bg-green-500';
      case 'clean-required': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center absolute top-4 left-4 right-4 z-10">
        <div className="bg-white shadow-md rounded-md p-2 flex items-center space-x-2">
          <span className="font-medium text-sm">Job Locations</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{locations.length}</span>
        </div>
        
        <div className="flex space-x-2">
          <div className="dropdown relative">
            <Button variant="outline" size="sm" className="bg-white" onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}>
              <Layers className="h-4 w-4 mr-1" />
              {mapType === 'roadmap' ? 'Map' : 'Satellite'}
            </Button>
          </div>
        </div>
      </div>

      <LoadScript googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw" libraries={["marker"]}>
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={center} 
          zoom={13} 
          options={mapOptions}
          onClick={() => setSelectedLocation(null)}
          onLoad={(map) => {
            // Add custom markers
            locations.forEach(location => {
              const markerElement = document.createElement('div');
              markerElement.className = 'marker';
              markerElement.innerHTML = `
                <div class="flex items-center justify-center">
                  <div class="relative">
                    <div class="${getStatusColor(location.status)} w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-white">
                      <span class="text-white font-bold text-xs">${location.id}</span>
                    </div>
                  </div>
                </div>
              `;

              const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: location.lat, lng: location.lng },
                map,
                content: markerElement,
                title: location.name
              });

              marker.addListener('click', () => {
                setSelectedLocation(location);
              });
            });
          }}
        >
          {selectedLocation && (
            <InfoWindow 
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <Card className="border-0 shadow-none p-0 min-w-[200px] max-w-[300px]">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm">
                      {selectedLocation.jobNumber}
                    </h3>
                    <div className={`${getStatusColor(selectedLocation.status)} text-white text-xs px-1.5 py-0.5 rounded`}>
                      {selectedLocation.status.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {selectedLocation.type}
                  </p>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium">{selectedLocation.customer}</p>
                    <p className="text-xs text-gray-500">{selectedLocation.address}</p>
                  </div>
                  
                  {isInfoExpanded && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="text-gray-500">Scheduled:</div>
                        <div>Today, 2:00 PM</div>
                        <div className="text-gray-500">Team:</div>
                        <div>Team Blue</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-2">
                    <button 
                      className="text-xs text-blue-600 flex items-center"
                      onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    >
                      {isInfoExpanded ? 'Less info' : 'More info'}
                      <ChevronDown className={`h-3 w-3 ml-0.5 transform ${isInfoExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      className="text-xs py-0 h-6"
                      onClick={() => navigate(`/jobs/${selectedLocation.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Job summary panel at the bottom */}
      <div className="bg-white border-t p-3 absolute bottom-0 left-0 right-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            {['ready', 'in-progress', 'to-invoice', 'invoiced', 'clean-required'].map((status) => (
              <div key={status} className="flex items-center">
                <div className={`${getStatusColor(status)} w-3 h-3 rounded-full mr-1`}></div>
                <span className="text-xs capitalize">{status.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-500">
            Total Jobs: {locations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSiteMapView;
