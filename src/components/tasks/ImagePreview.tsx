
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function ImagePreview({ 
  src, 
  alt, 
  onNavigate, 
  hasPrevious = false, 
  hasNext = false 
}: ImagePreviewProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleNavigate = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(direction);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error loading image:', src);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent className={`max-w-4xl ${isMobile ? 'w-[95vw] p-2' : 'w-[90%] h-[80vh]'} flex items-center justify-center p-0 z-50 relative`}>
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            console.error('Error loading image in dialog:', src);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Navigation buttons */}
        {onNavigate && (
          <>
            {hasPrevious && (
              <Button 
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-0 bg-black/50 hover:bg-black/70"
                variant="outline"
                size="icon"
                onClick={(e) => handleNavigate('prev', e)}
              >
                <ArrowLeft className="h-6 w-6 text-white" />
                <span className="sr-only">Previous image</span>
              </Button>
            )}
            {hasNext && (
              <Button 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-0 bg-black/50 hover:bg-black/70"
                variant="outline"
                size="icon"
                onClick={(e) => handleNavigate('next', e)}
              >
                <ArrowRight className="h-6 w-6 text-white" />
                <span className="sr-only">Next image</span>
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
