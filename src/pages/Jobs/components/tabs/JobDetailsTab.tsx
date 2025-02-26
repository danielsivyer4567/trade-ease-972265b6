
import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { User, Calendar, MapPin, Navigation } from "lucide-react";

interface JobDetailsTabProps {
  job: Job;
}

export const JobDetailsTab = ({ job }: JobDetailsTabProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <TabsContent value="details" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-5 h-5" />
            <span className="font-medium">Customer:</span> {job.customer}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Date:</span> {job.date}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Location:</span>
            <span>{job.address}</span>
            <div className="flex gap-2 ml-2">
              <a 
                href={`https://www.google.com/maps?q=${job.location[1]},${job.location[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on Map
              </a>
              {isMobile && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${job.location[1]},${job.location[0]}&travelmode=driving`}
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[200px] rounded-lg overflow-hidden border border-gray-200">
        <JobMap jobs={[job]} />
      </div>

      {job.description && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <span className="font-medium">Description:</span>
          </div>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>
      )}
    </TabsContent>
  );
};
