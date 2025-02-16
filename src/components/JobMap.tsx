
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  date: string;
  location?: [number, number]; // [longitude, latitude]
}

interface JobMapProps {
  jobs: Job[];
}

const JobMap = ({ jobs }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        zoom: 10,
        center: [151.2093, -33.8688], // Default to Sydney, Australia
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers for each job
      jobs.forEach(job => {
        if (job.location) {
          new mapboxgl.Marker()
            .setLngLat(job.location)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                  `<h3 class="font-semibold">${job.customer}</h3>
                   <p>${job.type}</p>
                   <p class="text-sm text-gray-500">${job.date}</p>`
                )
            )
            .addTo(map.current!);
        }
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [jobs, mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <input
          type="text"
          placeholder="Enter your Mapbox public token"
          className="px-4 py-2 border rounded"
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <p className="mt-2 text-sm text-gray-500">
          Get your token at <a href="https://mapbox.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default JobMap;
