
import { useState } from "react";
import { FileText, Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionProps {
  description: string | undefined;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
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

  return (
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
  );
};
