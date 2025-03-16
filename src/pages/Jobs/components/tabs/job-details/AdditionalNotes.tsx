
import { useState } from "react";
import { ClipboardList, Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const AdditionalNotes = () => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Get a shorter preview of the notes for the button
  const shortNotes = additionalNotes 
    ? (additionalNotes.length > 20 ? additionalNotes.substring(0, 20) + "..." : additionalNotes)
    : "No notes";

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <ClipboardList className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Additional Notes</span>
        </div>
        <span className="text-xs text-gray-500">{shortNotes}</span>
      </Button>
      
      {isExpanded && (
        <div className="border-t">
          {isEditingNotes ? (
            <div className="p-3 pt-2 space-y-2">
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px] text-sm"
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
            <div className="p-3 pt-2 flex justify-between items-start">
              <p className="text-sm">{additionalNotes}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingNotes(true);
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
