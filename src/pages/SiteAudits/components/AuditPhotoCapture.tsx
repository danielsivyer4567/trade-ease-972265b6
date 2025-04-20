import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { customerService } from '@/services/CustomerService';
import { supabase } from '@/integrations/supabase/client';

interface AuditPhotoCaptureProps {
  customerId: string | null;
  auditId?: string;
  onPhotoTaken?: (photoUrl: string, caption?: string) => void;
  onClose?: () => void;
}

export function AuditPhotoCapture({ 
  customerId, 
  auditId, 
  onPhotoTaken, 
  onClose 
}: AuditPhotoCaptureProps) {
  const [step, setStep] = useState<'capture' | 'review' | 'uploading'>('capture');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    if (step === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFileToUpload(file);
            setImageSrc(URL.createObjectURL(blob));
            setStep('review');
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      setImageSrc(URL.createObjectURL(file));
      setStep('review');
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !customerId) {
      toast({
        title: "Error",
        description: "Missing file or customer information",
        variant: "destructive",
      });
      return;
    }

    try {
      setStep('uploading');

      // Generate unique file path
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${customerId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audit_photos')
        .upload(filePath, fileToUpload);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('audit_photos')
        .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;

      // Link photo to customer profile
      await customerService.addPhotoToCustomerProfile(
        customerId,
        photoUrl,
        caption,
        auditId
      );

      toast({
        title: "Success",
        description: "Photo uploaded and linked to customer profile",
      });

      if (onPhotoTaken) {
        onPhotoTaken(photoUrl, caption);
      }

      setStep('capture');
      setImageSrc(null);
      setCaption('');
      setFileToUpload(null);

    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      setStep('review');
    }
  };

  const retakePhoto = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setStep('capture');
  };

  const openFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex justify-between items-center">
          <span>Site Audit Photo</span>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!customerId ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Please select a customer first</p>
          </div>
        ) : step === 'capture' ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-md overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between space-x-3">
              <Button
                variant="outline"
                onClick={openFileUpload}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                onClick={capturePhoto}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        ) : step === 'review' ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-md overflow-hidden aspect-video">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Enter a description for this photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-between space-x-3">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save to Customer Profile
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p>Uploading photo...</p>
          </div>
        )}
      </CardContent>
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}
