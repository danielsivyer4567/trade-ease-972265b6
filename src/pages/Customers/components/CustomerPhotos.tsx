
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera } from "lucide-react";
import { ImagePreview } from "@/components/tasks/ImagePreview";
import { AuditPhotoCapture } from "@/pages/SiteAudits/components/AuditPhotoCapture";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  url: string;
  phase: 'before' | 'during' | 'after';
  timestamp: string;
  caption?: string;
}

interface CustomerPhotosProps {
  customerId: string;
}

export function CustomerPhotos({ customerId }: CustomerPhotosProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');
  const [photos, setPhotos] = useState<Photo[]>([
    // Placeholder data - in a real app this would come from your database
    {
      id: '1',
      url: '/placeholder.svg',
      phase: 'before',
      timestamp: new Date().toISOString(),
      caption: 'Site inspection before job'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      phase: 'during',
      timestamp: new Date().toISOString(),
      caption: 'Work in progress'
    },
    {
      id: '3',
      url: '/placeholder.svg',
      phase: 'after',
      timestamp: new Date().toISOString(),
      caption: 'Completed job'
    },
  ]);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: e.target.result,
          phase: activeTab,
          timestamp: new Date().toISOString(),
          caption: `New ${activeTab} job photo`
        };
        
        setPhotos([...photos, newPhoto]);
        toast({
          title: "Photo added",
          description: `Photo has been added to the ${activeTab} job phase gallery`
        });
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleCapturePhoto = (blob: Blob) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: e.target.result,
          phase: activeTab,
          timestamp: new Date().toISOString(),
          caption: `New ${activeTab} job photo`
        };
        
        setPhotos([...photos, newPhoto]);
        setShowCamera(false);
      }
    };
    
    reader.readAsDataURL(blob);
  };
  
  const filteredPhotos = photos.filter(photo => photo.phase === activeTab);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Site Audit Photos</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-1"
          >
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Capture Photo</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Photo</span>
          </Button>
          <input 
            type="file" 
            id="photo-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'before' | 'during' | 'after')}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="before">Before Job</TabsTrigger>
          <TabsTrigger value="during">During Job</TabsTrigger>
          <TabsTrigger value="after">After Job</TabsTrigger>
        </TabsList>
        
        {['before', 'during', 'after'].map((phase) => (
          <TabsContent key={phase} value={phase} className="space-y-4">
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <ImagePreview src={photo.url} alt={photo.caption || 'Customer photo'} />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                        <p className="font-medium">{photo.caption}</p>
                        <p>{formatTimestamp(photo.timestamp)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No {phase} job photos yet</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {showCamera && (
        <AuditPhotoCapture 
          customerId={customerId} 
          onClose={() => setShowCamera(false)} 
          onPhotoCapture={handleCapturePhoto} 
        />
      )}
    </div>
  );
}
