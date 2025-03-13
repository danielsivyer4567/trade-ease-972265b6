
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";

interface JobLocationProps {
  job: Job;
}

export const JobLocation = ({ job }: JobLocationProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium flex items-center mb-3">
          <MapPin className="mr-2 h-5 w-5 text-gray-500" />
          Job Location
        </h3>
        <div className="space-y-2">
          <p className="text-sm mb-2">
            <span className="font-semibold">Coordinates:</span> {job.location[1]}, {job.location[0]}
          </p>

          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${job.location[1]},${job.location[0]}`, '_blank');
              }}
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          )}
        </div>
      </div>

      {/* Map Component */}
      {job.location && Array.isArray(job.location) && job.location.length === 2 && (
        <div className="h-64 bg-white shadow rounded-lg overflow-hidden">
          <JobMap 
            center={[job.location[0], job.location[1]]} 
            zoom={14} 
            markers={[{ position: [job.location[1], job.location[0]], title: job.title }]}
          />
        </div>
      )}
    </div>
  );
};
