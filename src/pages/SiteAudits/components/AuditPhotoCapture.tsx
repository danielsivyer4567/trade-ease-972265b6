
import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AuditPhotoCaptureProps {
  customerId: string;
  onClose: () => void;
  onPhotoCapture: (blob: Blob) => void;
}

export function AuditPhotoCapture({ 
  customerId, 
  onClose,
  onPhotoCapture
}: AuditPhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        // Get access to the camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        // Connect the video element to the stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive"
        });
        console.error("Error accessing camera:", err);
        onClose();
      }
    }
    
    startCamera();
    
    // Clean up
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, onClose, toast]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };
  
  const capturePhoto = () => {
    if (!videoRef.current || !isCameraActive) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onPhotoCapture(blob);
        toast({
          title: "Photo Captured",
          description: "The photo has been added to the audit"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to capture photo",
          variant: "destructive"
        });
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <Card className="fixed inset-0 z-50 m-4 sm:m-auto sm:max-w-lg sm:h-auto sm:inset-auto sm:top-24 bg-background">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg font-medium">Take Photo for Audit</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="relative bg-black rounded-md flex-1 min-h-[400px] overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                Activating camera...
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-4 gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={toggleCamera}
            >
              <RotateCw className="h-4 w-4" />
              <span>Flip</span>
            </Button>
            
            <Button 
              className="flex-1 flex items-center justify-center gap-2" 
              onClick={capturePhoto}
              disabled={!isCameraActive}
            >
              <Camera className="h-5 w-5" />
              <span>Capture Photo</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
