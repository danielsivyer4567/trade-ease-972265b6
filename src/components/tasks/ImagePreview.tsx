
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  const isMobile = useIsMobile();
  
  return (
    <Dialog>
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
      <DialogContent className={`max-w-4xl ${isMobile ? 'w-[90vw] p-2' : 'h-[80vh]'} flex items-center justify-center p-0`}>
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            console.error('Error loading image in dialog:', src);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
