
import { ImagePreview } from "./ImagePreview";

interface ImagesGridProps {
  images: string[];
  title: string;
}

export function ImagesGrid({ images, title }: ImagesGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((image, index) => (
          <ImagePreview 
            key={index}
            src={image}
            alt={`${title} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
