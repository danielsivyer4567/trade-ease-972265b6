
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { useState } from "react";

interface JobLocationProps {
  job: Job;
}

export const JobLocation = ({ job }: JobLocationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Format coordinates for display
  const lat = job.location[1].toFixed(4);
  const lng = job.location[0].toFixed(4);

  // Format address for display
  const formattedAddress = [
    job.address,
    job.city,
    job.state,
    job.zipCode
  ].filter(Boolean).join(', ');

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Job Location Details</span>
        </div>
        <span className="text-xs text-gray-500 truncate max-w-[200px]">
          {formattedAddress || `${lat}, ${lng}`}
        </span>
      </Button>
      
      {isExpanded && (
        <div className="space-y-3 border-t p-3 pt-2">
          <div className="space-y-2">
            {formattedAddress && (
              <p className="text-sm break-words">
                <span className="font-semibold">Address:</span> {formattedAddress}
              </p>
            )}
            <p className="text-sm">
              <span className="font-semibold">Coordinates:</span> {job.location[1]}, {job.location[0]}
            </p>

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
          </div>

          {/* We don't need a map here anymore since we have one at the top of the page */}
          <p className="text-xs text-gray-500">See the full map at the top of this page</p>
        </div>
      )}
    </div>
  );
};
