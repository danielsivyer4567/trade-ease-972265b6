
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Job } from "@/types/job";

interface JobSiteMapViewProps {
  jobs: Job[];
}

const JobSiteMapView = ({ jobs }: JobSiteMapViewProps) => {
  // Sample map rendering - in a production app, this would use Google Maps or a similar API
  return (
    <div className="w-full h-[500px] relative bg-gray-100 rounded overflow-hidden">
      {/* Placeholder for the map - would be replaced with actual map implementation */}
      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="mb-2">Interactive Map View</div>
          <div className="text-sm">Displaying {jobs.length} job locations</div>
        </div>
      </div>
      
      {/* Sample job markers */}
      {jobs.map((job, index) => {
        // Generate pseudo-random positions for demo purposes
        const left = 10 + (index * 15) % 80;
        const top = 20 + (index * 20) % 60;
        
        return (
          <div 
            key={job.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2" 
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div className="relative group">
              <MapPin 
                size={32} 
                className={`
                  ${job.status === 'ready' ? 'text-green-500' : ''}
                  ${job.status === 'in-progress' ? 'text-blue-500' : ''}
                  ${job.status === 'to-invoice' ? 'text-yellow-500' : ''}
                  ${job.status === 'invoiced' ? 'text-purple-500' : ''}
                  ${job.status === 'clean-required' ? 'text-red-500' : ''}
                `} 
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded shadow-lg 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-600">{job.customer}</p>
                <p className="text-xs">{job.jobNumber}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobSiteMapView;
