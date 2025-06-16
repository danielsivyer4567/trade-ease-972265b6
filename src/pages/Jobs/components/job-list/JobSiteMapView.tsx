import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import SharedJobMap from "@/components/shared/SharedJobMap";
import { geocodingService } from "@/services";
import { supabase } from "@/integrations/supabase/client";

interface JobSiteMapViewProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
}

const JobSiteMapView = ({ jobs, onJobClick }: JobSiteMapViewProps) => {
  const [processedJobs, setProcessedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Process jobs to ensure they have geocoded locations
  useEffect(() => {
    const geocodeJobAddresses = async () => {
      setLoading(true);
      
      const jobsToProcess = [...jobs];
      const updatedJobs: Job[] = [];
      const jobUpdatesToSave: { id: string, location?: [number, number], locations?: Array<{coordinates: [number, number], address?: string}> }[] = [];

      // Process each job sequentially
      for (const job of jobsToProcess) {
        let jobWithLocation = { ...job };
        
        // Check if the job has an address but no location/locations
        const hasAddress = job.address && job.address !== 'N/A';
        const hasLocation = job.location && job.location[0] && job.location[1];
        const hasLocations = job.locations && job.locations.length > 0;
        
        if (hasAddress && !hasLocation && !hasLocations) {
          try {
            console.log(`Geocoding address for job ${job.id}: ${job.address}`);
            const coordinates = await geocodingService.geocodeAddress(job.address);
            
            if (coordinates) {
              // Add to both location (legacy) and locations (new format)
              jobWithLocation = {
                ...jobWithLocation,
                location: coordinates,
                locations: [
                  {
                    coordinates,
                    address: job.address,
                    label: 'Primary'
                  }
                ]
              };
              
              // Add to list of jobs to update in database
              if (job.id) {
                jobUpdatesToSave.push({
                  id: job.id,
                  location: coordinates,
                  locations: [
                    {
                      coordinates,
                      address: job.address
                    }
                  ]
                });
              }
            }
          } catch (error) {
            console.error(`Error geocoding address for job ${job.id}:`, error);
          }
        } else if (hasLocation && !hasLocations) {
          // Convert legacy location to new locations format
          jobWithLocation = {
            ...jobWithLocation,
            locations: [
              {
                coordinates: job.location,
                address: job.address,
                label: 'Primary'
              }
            ]
          };
          
          if (job.id) {
            jobUpdatesToSave.push({
              id: job.id,
              locations: [
                {
                  coordinates: job.location,
                  address: job.address
                }
              ]
            });
          }
        }
        
        updatedJobs.push(jobWithLocation);
      }
      
      // Save all geocoded locations to database in batch
      if (jobUpdatesToSave.length > 0) {
        try {
          for (const jobUpdate of jobUpdatesToSave) {
            await supabase
              .from('jobs')
              .update({ 
                location: jobUpdate.location,
                locations: jobUpdate.locations
              })
              .eq('id', jobUpdate.id);
          }
          console.log(`Updated ${jobUpdatesToSave.length} jobs with geocoded locations`);
        } catch (dbError) {
          console.error("Error updating jobs with geocoded locations:", dbError);
        }
      }
      
      setProcessedJobs(updatedJobs);
      setLoading(false);
    };
    
    geocodeJobAddresses();
  }, [jobs]);

  const hasLocations = processedJobs.some(job => 
    (job.location && job.location[0] && job.location[1]) || 
    (job.locations && job.locations.length > 0)
  );

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500">Geocoding job addresses...</p>
          </div>
        </div>
      )}
      
      <SharedJobMap 
        jobs={processedJobs}
        height="200px"
        onJobClick={onJobClick}
      />
      
      {!hasLocations && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6">
            <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <h3 className="text-base font-medium text-gray-700 mb-1">No job locations available</h3>
            <p className="text-xs text-gray-500">
              Add addresses to your jobs to see them on the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSiteMapView;
