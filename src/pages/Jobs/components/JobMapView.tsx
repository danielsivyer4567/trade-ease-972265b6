import React from 'react';
import JobMap from '@/components/JobMap';
import type { Job } from '@/types/job';

interface JobMapViewProps {
  job: Job;
}

export const JobMapView = ({ job }: JobMapViewProps) => {
  // Create location markers array for the job
  const locationMarkers = job.locations?.map(location => ({
    coordinates: location.coordinates,
    job: job,
    label: location.label
  })) || [];
  
  // If no locations array but has legacy location, add that as a fallback
  if (locationMarkers.length === 0 && job.location) {
    locationMarkers.push({
      coordinates: job.location,
      job: job,
      label: "Main Location"
    });
  }
  
  // Determine center coordinates for the map
  const centerCoords = locationMarkers.length > 0 
    ? locationMarkers[0].coordinates 
    : [-28.017112731933594, 153.4014129638672] as [number, number]; // Default to Gold Coast
  
  return (
    <div className="h-full w-full">
      <JobMap 
        center={centerCoords} 
        zoom={15} 
        locationMarkers={locationMarkers} 
        boundaries={job.boundaries || []}
        autoFit={true}
      />
    </div>
  );
};
