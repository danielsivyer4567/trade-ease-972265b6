import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";

interface JobSiteMapViewProps {
  jobs: Job[];
}

const JobSiteMapView = ({ jobs }: JobSiteMapViewProps) => {
  return (
    <div className="w-full h-full relative">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Job Site Map
      </h2>
      
      {/* Use the JobMap component with full height */}
      <JobMap 
        jobs={jobs}
        zoom={12}
        height="580px"
      />
    </div>
  );
};

export default JobSiteMapView;
