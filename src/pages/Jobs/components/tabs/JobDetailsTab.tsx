
import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { User, Calendar, MapPin, Navigation, FileText, ClipboardList } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface JobDetailsTabProps {
  job: Job;
}

export const JobDetailsTab = ({ job }: JobDetailsTabProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(job.description || "");

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

      <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-700">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-lg">Job Description</h3>
          </div>
        </div>
        
        {job.description ? (
          <div className="space-y-4">
            <div className="text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded border">
              {job.description}
            </div>
            
            <div className="border-t pt-3 mt-4">
              <h4 className="font-medium flex items-center gap-2 mb-2 text-gray-700">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                Additional Notes & Requirements
              </h4>
              <p className="text-gray-600 text-sm italic">
                No additional notes provided. Contact office for more information if needed.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic text-center py-4">
            No description available for this job.
          </div>
        )}
      </div>
    </TabsContent>
  );
};
