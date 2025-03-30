
import { useState } from "react";
import { JobStepProgress } from "@/components/dashboard/JobStepProgress";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StepImage {
  url: string;
  note: string;
}

interface StepData {
  id: number;
  notes: string;
  images: StepImage[];
  isOpen: boolean;
}

export const JobProgressTab = () => {
  const { toast } = useToast();
  const [stepData, setStepData] = useState<Record<number, StepData>>({
    1: { id: 1, notes: "", images: [], isOpen: false },
    2: { id: 2, notes: "", images: [], isOpen: false },
    3: { id: 3, notes: "", images: [], isOpen: false },
    4: { id: 4, notes: "", images: [], isOpen: false },
    5: { id: 5, notes: "", images: [], isOpen: false },
    6: { id: 6, notes: "", images: [], isOpen: false },
  });

  const handleNoteChange = (stepId: number, notes: string) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        notes
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, stepId: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: StepImage[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      note: ""
    }));

    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        images: [...prev[stepId].images, ...newImages]
      }
    }));

    toast({
      title: "Images uploaded",
      description: `${newImages.length} image(s) added to step ${stepId}`
    });
  };

  const handleImageNoteChange = (stepId: number, imageIndex: number, note: string) => {
    setStepData(prev => {
      const step = prev[stepId];
      const updatedImages = [...step.images];
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        note
      };
      
      return {
        ...prev,
        [stepId]: {
          ...step,
          images: updatedImages
        }
      };
    });
  };

  const toggleStepOpen = (stepId: number) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        isOpen: !prev[stepId].isOpen
      }
    }));
  };

  const saveStepData = (stepId: number) => {
    // In a real app, you would save this data to your backend
    toast({
      title: "Step data saved",
      description: `Notes and images for step ${stepId} have been saved.`
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Main progress tracker */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <JobStepProgress />
      </div>
      
      {/* Step details with notes and images */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Step Details</h3>
        
        {Object.values(stepData).map((step) => (
          <Collapsible 
            key={step.id}
            open={step.isOpen}
            onOpenChange={() => toggleStepOpen(step.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
              <div className="font-medium">Step {step.id} Details</div>
              {step.isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-4 border-t">
              <div className="space-y-4">
                {/* Notes section */}
                <div>
                  <label htmlFor={`step-${step.id}-notes`} className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for Step {step.id}
                  </label>
                  <Textarea
                    id={`step-${step.id}-notes`}
                    value={step.notes}
                    onChange={(e) => handleNoteChange(step.id, e.target.value)}
                    placeholder="Add notes about this step..."
                    className="w-full"
                  />
                </div>
                
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images for Step {step.id}
                  </label>
                  <FileUpload
                    onFileUpload={(e) => handleImageUpload(e, step.id)}
                    label={`Upload images for Step ${step.id}`}
                  />
                </div>
                
                {/* Images display with notes */}
                {step.images.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-medium">Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="border rounded-lg overflow-hidden">
                          <div className="aspect-video bg-gray-100">
                            <img 
                              src={image.url} 
                              alt={`Step ${step.id} image ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <Textarea
                              value={image.note}
                              onChange={(e) => handleImageNoteChange(step.id, imageIndex, e.target.value)}
                              placeholder="Add notes about this image..."
                              className="w-full text-sm min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Save button */}
                <div className="flex justify-end">
                  <Button onClick={() => saveStepData(step.id)} className="mt-2">
                    Save Step Data
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
