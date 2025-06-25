import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Polygon, useLoadScript } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Briefcase } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG, getMapId } from '@/config/google-maps';
import { toast } from 'sonner';

// Get the map ID from config
const mapId = getMapId();

interface JobMapProps {
  jobs?: Job[];
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
  }>;
  locationMarkers?: Array<{
    coordinates: [number, number];
    job: Job;
    label?: string;
  }>;
  boundaries?: Array<Array<[number, number]>>;
  autoFit?: boolean; // New prop to control whether map should auto-fit to markers
}

// Define libraries to load
const libraries = ["marker"];

// Create a separate map component without the LoadScript wrapper
const MapComponent = ({ 
  jobs = [], 
  center, 
  zoom = 14, 
  markers = [], 
  locationMarkers = [],
  boundaries = [],
  autoFit = true 
}: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{coordinates: [number, number], label?: string} | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0'
  };

  // Default coordinates for Gold Coast, Queensland if no center provided
  const defaultCenter = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };

  const mapCenter = center 
    ? { lat: center[1], lng: center[0] } 
    : defaultCenter;

  const options = {
    streetViewControl: true, // Enable Street View control
    mapTypeControl: true, // Enable map type control
    mapId: mapId, // Add mapId for Advanced Markers
    // Only set mapTypeId if mapId is not present to avoid warnings
    ...(mapId ? {} : { mapTypeId: 'satellite' }),
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
  };

  // Function to auto-fit map to all markers
  const fitMapToMarkers = (map: google.maps.Map) => {
    if (!map || (!jobs.length && !markers.length && !locationMarkers.length)) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    // Add job locations to bounds (legacy)
    jobs.forEach(job => {
      if (job.location && job.location[0] && job.location[1]) {
        bounds.extend({ lat: job.location[1], lng: job.location[0] });
      }
    });
    
    // Add location markers to bounds
    locationMarkers.forEach(marker => {
      bounds.extend({ lat: marker.coordinates[1], lng: marker.coordinates[0] });
    });
    
    // Add individual markers to bounds
    markers.forEach(marker => {
      bounds.extend({ lat: marker.position[0], lng: marker.position[1] });
    });
    
    // Skip if no valid bounds
    if (bounds.isEmpty()) return;
    
    // Fit the map to the bounds
    map.fitBounds(bounds);
    
    // Add some padding if there's only one marker
    if ((jobs.length + markers.length + locationMarkers.length) <= 1) {
      // Don't zoom in too much for single markers
      const currentZoom = map.getZoom();
      if (currentZoom && currentZoom > 15) {
        map.setZoom(15);
      }
    }
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Set satellite view programmatically when mapId is present
    if (mapId) {
      mapInstance.setMapTypeId('satellite');
    }
    
    // Helper function to activate Street View for a location
    const activateStreetView = (
      map: google.maps.Map, 
      location: google.maps.LatLngLiteral, 
      address?: string
    ) => {
      try {
        // Get the Street View service
        const streetViewService = new google.maps.StreetViewService();
        
        // If address is provided and geocoding is needed, we could add that here
        // For now we'll use the coordinates directly
        
        // Check for Street View availability and activate if available
        streetViewService.getPanorama(
          { location, radius: 50 },
          (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
              // Street View is available, activate it
              const panorama = map.getStreetView();
              panorama.setPosition(location);
              panorama.setPov({
                heading: 0,
                pitch: 0
              });
              panorama.setVisible(true);
              console.log("Street View activated for location:", location);
            } else {
              console.log("Street View not available at this location");
              toast.info("Street View not available at this location");
            }
          }
        );
      } catch (error) {
        console.error("Error initializing Street View:", error);
      }
    };
    
    // Don't activate Street View automatically - let users choose when to use it
    
    // Add markers from jobs if provided (legacy support)
    if (jobs.length > 0) {
      jobs.forEach((job) => {
        // Skip if job has no location
<<<<<<< HEAD
        if (!job.location || !Array.isArray(job.location) || job.location.length < 2 || !job.location[0] || !job.location[1]) return;
=======
        if (!job.location || !job.location[0] || !job.location[1]) return;
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; background: transparent; padding: 0; margin: 0;">
            <img src='/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png' alt='Trade Ease Logo' width='16' height='16' style='object-fit: contain; display: block; margin-bottom: 2px;' />
            <span style="color: #fff; font-weight: bold; font-size: 10px; line-height: 1; text-align: center;">${job.jobNumber || 'N/A'}</span>
          </div>
        `;

        try {
          // Create the advanced marker
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: job.location[1], lng: job.location[0] },
            map: mapInstance,
            content: markerElement,
            title: job.customer,
            zIndex: 1000 // Ensure markers appear above other elements
          });

          // Add click listener using the recommended 'gmp-click' event
          marker.addListener('gmp-click', () => {
            setSelectedJob(job);
            setSelectedLocation(null);
            
            // Activate Street View for the clicked job location
<<<<<<< HEAD
            if (job.location && job.location.length >= 2) {
              activateStreetView(mapInstance, { lat: job.location[1], lng: job.location[0] }, job.address);
            }
=======
            activateStreetView(mapInstance, { lat: job.location[1], lng: job.location[0] }, job.address);
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
          });
        } catch (error) {
          console.error("Error creating advanced marker, falling back to standard marker:", error);
          
          // Fallback to standard marker if Advanced Markers are not available
          const standardMarker = new google.maps.Marker({
<<<<<<< HEAD
            position: { lat: job.location![1], lng: job.location![0] },
=======
            position: { lat: job.location[1], lng: job.location[0] },
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
            map: mapInstance,
            title: job.customer,
            zIndex: 1000
          });
          
          // Add click listener for standard marker
          standardMarker.addListener('click', () => {
            setSelectedJob(job);
            setSelectedLocation(null);
            
            // Activate Street View for the clicked job location
<<<<<<< HEAD
            if (job.location && job.location.length >= 2) {
              activateStreetView(mapInstance, { lat: job.location[1], lng: job.location[0] }, job.address);
            }
=======
            activateStreetView(mapInstance, { lat: job.location[1], lng: job.location[0] }, job.address);
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
          });
        }
      });
    }

    // Add markers from locationMarkers prop (new primary way)
    if (locationMarkers.length > 0) {
      locationMarkers.forEach(locMarker => {
        const { coordinates, job, label } = locMarker;
        
        // Skip if invalid coordinates
        if (!coordinates || !coordinates[0] || !coordinates[1]) return;
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; background: transparent; padding: 0; margin: 0;">
            <img src='/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png' alt='Trade Ease Logo' width='16' height='16' style='object-fit: contain; display: block; margin-bottom: 2px;' />
            <span style="color: #fff; font-weight: bold; font-size: 10px; line-height: 1; text-align: center;">${job.jobNumber || 'N/A'}</span>
          </div>
        `;

        try {
          // Create the advanced marker
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: coordinates[1], lng: coordinates[0] },
            map: mapInstance,
            content: markerElement,
            title: job.customer,
            zIndex: 1000 // Ensure markers appear above other elements
          });

          // Add click listener
          marker.addListener('gmp-click', () => {
            setSelectedJob(job);
            setSelectedLocation({ coordinates, label });
            
            // Activate Street View for the clicked location
            activateStreetView(mapInstance, { lat: coordinates[1], lng: coordinates[0] }, job.address);
          });
        } catch (error) {
          console.error("Error creating advanced marker, falling back to standard marker:", error);
          
          // Fallback to standard marker if Advanced Markers are not available
          const standardMarker = new google.maps.Marker({
            position: { lat: coordinates[1], lng: coordinates[0] },
            map: mapInstance,
            title: job.customer,
            zIndex: 1000
          });
          
          // Add click listener for standard marker
          standardMarker.addListener('click', () => {
            setSelectedJob(job);
            setSelectedLocation({ coordinates, label });
            
            // Activate Street View for the clicked location
            activateStreetView(mapInstance, { lat: coordinates[1], lng: coordinates[0] }, job.address);
          });
        }
      });
    }

    // Add markers from the markers prop if provided
    if (markers.length > 0) {
      markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; background: transparent; padding: 0; margin: 0;">
            <img src='/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png' alt='Trade Ease Logo' width='16' height='16' style='object-fit: contain; display: block; margin-bottom: 2px;' />
            <span style="color: #fff; font-weight: bold; font-size: 10px; line-height: 1; text-align: center;">${marker.title || 'N/A'}</span>
          </div>
        `;

        try {
          new google.maps.marker.AdvancedMarkerElement({
            position: { lat: marker.position[0], lng: marker.position[1] },
            map: mapInstance,
            content: markerElement,
            title: marker.title,
            zIndex: 1000 // Ensure markers appear above other elements
          });
        } catch (error) {
          console.error("Error creating advanced marker, falling back to standard marker:", error);
          
          // Fallback to standard marker if Advanced Markers are not available
          new google.maps.Marker({
            position: { lat: marker.position[0], lng: marker.position[1] },
            map: mapInstance,
            title: marker.title,
            zIndex: 1000
          });
        }
      });
    }

    // Add a marker for the center location if no other markers are provided
    if (jobs.length === 0 && markers.length === 0 && locationMarkers.length === 0) {
      const centerMarkerElement = document.createElement('div');
      centerMarkerElement.className = 'marker';
      const centerMarkerJobNumber = jobs.length > 0 ? jobs[0].jobNumber : markers.length > 0 ? markers[0].title : locationMarkers.length > 0 ? locationMarkers[0].job.jobNumber : 'N/A';
      centerMarkerElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; background: transparent; padding: 0; margin: 0;">
          <img src='/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png' alt='Trade Ease Logo' width='16' height='16' style='object-fit: contain; display: block; margin-bottom: 2px;' />
          <span style="color: #fff; font-weight: bold; font-size: 10px; line-height: 1; text-align: center;">${centerMarkerJobNumber || 'N/A'}</span>
        </div>
      `;

      try {
        new google.maps.marker.AdvancedMarkerElement({
          position: mapCenter,
          map: mapInstance,
          content: centerMarkerElement,
          title: "Location",
          zIndex: 1000
        });
      } catch (error) {
        console.error("Error creating advanced marker, falling back to standard marker:", error);
        
        // Fallback to standard marker if Advanced Markers are not available
        new google.maps.Marker({
          position: mapCenter,
          map: mapInstance,
          title: "Location",
          zIndex: 1000
        });
      }
    }
    
    // Draw property boundaries if provided
    if (boundaries.length > 0) {
      boundaries.forEach((boundary, index) => {
        // Convert the boundary points to Google Maps LatLng objects
        const polygonPath = boundary.map(point => ({
          lat: point[1],
          lng: point[0]
        }));
        
        // Create and add the polygon to the map
        new google.maps.Polygon({
          paths: polygonPath,
          strokeColor: '#5D4A9C',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#9b87f5',
          fillOpacity: 0.35,
          map: mapInstance
        });
      });
    }
    
    // Auto fit the map to markers if enabled
    if (autoFit) {
      fitMapToMarkers(mapInstance);
    }
  };
  
  // Effect to handle changes in jobs or markers
  useEffect(() => {
    if (map && autoFit) {
      fitMapToMarkers(map);
    }
  }, [jobs, markers, locationMarkers, map, autoFit]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
    >
      {selectedJob && selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.coordinates[1], lng: selectedLocation.coordinates[0] }}
          onCloseClick={() => {
            setSelectedJob(null);
            setSelectedLocation(null);
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" className="object-contain" />
              <h3 className="font-semibold">{selectedJob.customer}</h3>
            </div>
            <p>{selectedJob.title} - {selectedJob.type}</p>
            {selectedLocation.label && (
              <p className="text-sm text-blue-600">{selectedLocation.label}</p>
            )}
            <p className="text-sm text-gray-500">{selectedJob.date}</p>
          </div>
        </InfoWindow>
      )}
      {selectedJob && !selectedLocation && selectedJob.location && (
        <InfoWindow
          position={{ lat: selectedJob.location[1], lng: selectedJob.location[0] }}
          onCloseClick={() => setSelectedJob(null)}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" className="object-contain" />
              <h3 className="font-semibold">{selectedJob.customer}</h3>
            </div>
            <p>{selectedJob.type}</p>
            <p className="text-sm text-gray-500">{selectedJob.date}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

// Main JobMap component using useLoadScript hook
const JobMap = (props: JobMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: libraries as any,
<<<<<<< HEAD
    version: "weekly", // Changed from "beta" to "weekly" for stability
    mapIds: [mapId], // Add mapId for Advanced Markers
    preventGoogleFontsLoading: true // Prevent loading Google Fonts for better performance
=======
    version: "beta",
    mapIds: [mapId] // Add mapId for Advanced Markers
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
  });

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading maps...</div>;
  }

  return <MapComponent {...props} />;
};

export default JobMap;
