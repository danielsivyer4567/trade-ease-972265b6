
import { useState } from "react";
import { FileText, Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionProps {
  description: string | undefined;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description || "");

  const handleSaveDescription = () => {
    // In a real app, this would update the job description via an API call
    console.log("Saving description:", descriptionText);
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setDescriptionText(description || "");
    setIsEditingDescription(false);
  };

  // Get a shorter preview of the description for the button
  const shortDescription = descriptionText 
    ? (descriptionText.length > 20 ? descriptionText.substring(0, 20) + "..." : descriptionText)
    : "No description";

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Job Description</span>
        </div>
        <span className="text-xs text-gray-500">{shortDescription}</span>
      </Button>
      
      {isExpanded && (
        <div className="border-t">
          {isEditingDescription ? (
            <div className="p-3 pt-2 space-y-2">
              <Textarea
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                className="min-h-[80px] text-sm"
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
            <div className="p-3 pt-2 flex justify-between items-start">
              <p className="text-sm">{descriptionText || "No description provided."}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingDescription(true);
                }}
                className="h-8 px-2 ml-2 flex-shrink-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
