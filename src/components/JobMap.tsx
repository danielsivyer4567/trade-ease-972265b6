import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Polygon,
  useLoadScript,
} from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { GOOGLE_MAPS_CONFIG, getMapId } from '@/config/google-maps';
import { toast } from 'sonner';

const mapId = getMapId();
const libraries = ['marker'];

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
  autoFit?: boolean;
}

const JobMapInternal = ({
  jobs = [],
  center,
  zoom = 14,
  markers = [],
  locationMarkers = [],
  boundaries = [],
  autoFit = true,
}: JobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number];
    label?: string;
  } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0',
  };

  const defaultCenter = {
    lat: -28.017112731933594,
    lng: 153.4014129638672,
  };

  const mapCenter = center
    ? { lat: center[1], lng: center[0] }
    : defaultCenter;

  const options = {
    streetViewControl: true,
    mapTypeControl: true,
    mapId: mapId,
    ...(mapId ? {} : { mapTypeId: 'satellite' }),
    zoomControl: true,
  };

  const fitMapToMarkers = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();

    jobs.forEach((job) => {
      if (job.location?.length === 2) {
        bounds.extend({ lat: job.location[1], lng: job.location[0] });
      }
    });

    locationMarkers.forEach((m) =>
      bounds.extend({ lat: m.coordinates[1], lng: m.coordinates[0] })
    );

    markers.forEach((m) =>
      bounds.extend({ lat: m.position[0], lng: m.position[1] })
    );

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
      if ((jobs.length + markers.length + locationMarkers.length) <= 1) {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        }
      }
    }
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);

    jobs.forEach((job) => {
      if (!job.location || job.location.length < 2) return;

      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background: rgba(30,30,30,0.6); color:white; padding:4px 8px; border-radius:12px; backdrop-filter:blur(6px); font-weight:600;">
            ${job.job_number || 'N/A'}
          </div>
          <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" width="24" height="24" style="margin-top:4px;" />
        </div>
      `;

      try {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: {
            lat: job.location[1],
            lng: job.location[0],
          },
          map: mapInstance,
          content: markerElement,
          title: job.customer,
        });

        marker.addListener('gmp-click', () => {
          setSelectedJob(job);
          setSelectedLocation(null);
        });
      } catch (error) {
        console.warn('Advanced marker failed, fallback marker created');
        const marker = new google.maps.Marker({
          position: {
            lat: job.location[1],
            lng: job.location[0],
          },
          map: mapInstance,
          title: job.customer,
        });

        marker.addListener('click', () => {
          setSelectedJob(job);
          setSelectedLocation(null);
        });
      }
    });

    if (autoFit) {
      fitMapToMarkers(mapInstance);
    }
  };

  useEffect(() => {
    if (map && autoFit) {
      fitMapToMarkers(map);
    }
  }, [jobs, locationMarkers, markers, map, autoFit]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
    >
      {selectedJob && selectedJob.location && (
        <InfoWindow
          position={{
            lat: selectedJob.location[1],
            lng: selectedJob.location[0],
          }}
          onCloseClick={() => setSelectedJob(null)}
        >
          <div>
            <strong>{selectedJob.customer}</strong>
            <div>{selectedJob.title}</div>
            <div>{selectedJob.job_number}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const JobMap = (props: JobMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCEZfDx6VHz83XX2tnhGRZl3VGSb9WlY1s',
    libraries: libraries as any,
    version: 'beta',
    mapIds: [mapId],
  });

  if (loadError) return <div className="p-4 text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="p-4">Loading maps...</div>;

  return (
    <div className="map-wrapper w-full h-[400px] rounded-md overflow-hidden">
      <JobMapInternal {...props} />
    </div>
  );
};

export default JobMap;
