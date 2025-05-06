import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { geocodingService } from "@/services";
import { supabase } from "@/integrations/supabase/client";

interface JobSiteMapViewProps {
  jobs: Job[];
}

const JobSiteMapView = ({ jobs }: JobSiteMapViewProps) => {
  const [processedJobs, setProcessedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Process jobs to ensure they have geocoded locations
  useEffect(() => {
    const geocodeJobAddresses = async () => {
      setLoading(true);
      
      const jobsToProcess = [...jobs];
      const updatedJobs: Job[] = [];
      const jobUpdatesToSave: { id: string, location: [number, number] }[] = [];

      // Process each job sequentially
      for (const job of jobsToProcess) {
        let jobWithLocation = { ...job };
        
        // Check if the job has an address but no location
        const hasAddress = job.address && job.address !== 'N/A';
        const hasLocation = job.location && job.location[0] && job.location[1];
        
        if (hasAddress && !hasLocation) {
          try {
            console.log(`Geocoding address for job ${job.id}: ${job.address}`);
            const coordinates = await geocodingService.geocodeAddress(job.address);
            
            if (coordinates) {
              jobWithLocation = {
                ...jobWithLocation,
                location: coordinates
              };
              
              // Add to list of jobs to update in database
              if (job.id) {
                jobUpdatesToSave.push({
                  id: job.id,
                  location: coordinates
                });
              }
            }
          } catch (error) {
            console.error(`Error geocoding address for job ${job.id}:`, error);
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
              .update({ location: jobUpdate.location })
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

  // Filter jobs to only include those with valid locations
  const jobsWithLocations = processedJobs.filter(
    job => job.location && job.location[0] && job.location[1]
  );

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500">Geocoding job addresses...</p>
          </div>
        </div>
      )}
      
      {/* Use the JobMap component */}
      <JobMap 
        jobs={jobsWithLocations}
        zoom={jobsWithLocations.length > 1 ? 10 : 13} // Zoom out more if we have multiple jobs
      />
      
      {jobsWithLocations.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No job locations available</h3>
            <p className="text-sm text-gray-500">
              Add addresses to your jobs to see them on the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSiteMapView;
