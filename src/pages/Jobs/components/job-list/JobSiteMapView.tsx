
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
      {/* Use the JobMap component from the system */}
      <JobMap 
        jobs={jobs}
        zoom={12}
      />
    </div>
  );
};

export default JobSiteMapView;
