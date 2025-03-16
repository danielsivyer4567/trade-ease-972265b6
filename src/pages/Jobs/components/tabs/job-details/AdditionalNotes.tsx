
import { useState } from "react";
import { ClipboardList, Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const AdditionalNotes = () => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("No additional notes provided. Contact office for more information if needed.");

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
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      
      {isEditingNotes ? (
        <div className="space-y-2">
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="min-h-[80px]"
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
  );
};
