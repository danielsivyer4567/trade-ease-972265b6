
import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { User, Calendar, MapPin, Navigation, FileText, ClipboardList, Edit, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface JobDetailsTabProps {
  job: Job;
}

export const JobDetailsTab = ({
  job
}: JobDetailsTabProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(job.description || "");
  const [additionalNotes, setAdditionalNotes] = useState("No additional notes provided. Contact office for more information if needed.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleSaveDescription = () => {
    // In a real app, this would update the job description via an API call
    console.log("Saving description:", descriptionText);
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setDescriptionText(job.description || "");
    setIsEditingDescription(false);
  };

  const handleSaveNotes = () => {
    // In a real app, this would update the additional notes via an API call
    console.log("Saving additional notes:", additionalNotes);
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setAdditionalNotes("No additional notes provided. Contact office for more information if needed.");
    setIsEditingNotes(false);
  };

  return (
    <TabsContent value="details" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <User className="mr-2 h-5 w-5 text-gray-500" />
              Customer Details
            </h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Name:</span> {job.customer}</p>
              <p className="text-sm"><span className="font-semibold">Job Number:</span> {job.jobNumber}</p>
              <p className="text-sm"><span className="font-semibold">Job Type:</span> {job.type}</p>
              <p className="text-sm"><span className="font-semibold">Assigned Team:</span> {job.assignedTeam}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-gray-500" />
                Job Description
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingDescription(true)}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            
            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDescription}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveDescription}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{descriptionText || "No description provided."}</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-gray-500" />
                Additional Notes
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(true)}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelNotes}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveNotes}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{additionalNotes}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Calendar className="mr-2 h-5 w-5 text-gray-500" />
              Scheduled Date
            </h3>
            <p className="text-sm">{new Date(job.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

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
      </div>
    </TabsContent>
  );
};
