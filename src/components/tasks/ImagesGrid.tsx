
import { useState } from "react";
import { ImagePreview } from "./ImagePreview";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImagesGridProps {
  images: string[];
  title?: string;
}

export function ImagesGrid({ images, title }: ImagesGridProps) {
  const [completedImages, setCompletedImages] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  const handleMarkCompleted = (imageUrl: string) => {
    setCompletedImages(prev => ({
      ...prev,
      [imageUrl]: !prev[imageUrl]
    }));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {title && <h3 className="font-medium">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <ImagePreview 
              src={image} 
              alt={title ? `${title} ${index + 1}` : `Image ${index + 1}`} 
            />
            <div className="absolute bottom-2 right-2 z-10">
              <Button 
                variant={completedImages[image] ? "default" : "outline"} 
                size="icon" 
                className="opacity-90 hover:opacity-100 bg-white"
                onClick={() => handleMarkCompleted(image)}
              >
                <Check className={completedImages[image] ? "text-white" : "text-gray-500"} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
