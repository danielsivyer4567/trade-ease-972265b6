import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Monitor, MonitorOff, Camera, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScreenShareButtonProps {
  onScreenCapture?: (imageData: string) => void;
  enableGeminiAnalysis?: boolean;
  geminiApiKey?: string;
}

export const ScreenShareButton: React.FC<ScreenShareButtonProps> = ({
  onScreenCapture,
  enableGeminiAnalysis = false,
  geminiApiKey
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      setStream(mediaStream);
      setIsSharing(true);

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Handle stream ending
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      toast({
        title: "Screen sharing started",
        description: "Your screen is now being shared",
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Failed to start screen sharing",
        description: "Please allow screen sharing permission",
        variant: "destructive"
      });
    }
  };

  // Stop screen sharing
  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsSharing(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Capture screenshot from video stream
  const captureScreenshot = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      if (onScreenCapture) {
        onScreenCapture(imageData);
      }

      toast({
        title: "Screenshot captured",
        description: "The screenshot has been saved",
      });

      return imageData;
    }
  }, [onScreenCapture, toast]);

  // Analyze screenshot with Gemini AI
  const analyzeWithGemini = async () => {
    if (!capturedImage || !geminiApiKey) {
      toast({
        title: "Cannot analyze",
        description: "Please capture a screenshot first and ensure Gemini API key is configured",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Convert base64 to blob for Gemini API
      const base64Data = capturedImage.split(',')[1];
      
      // Here you would integrate with Gemini API
      // This is a placeholder for the actual implementation
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Analyze this screenshot and describe what you see. Identify any UI elements, text, or important information."
              },
              {
                inline_data: {
                  mime_type: "image/png",
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      const analysis = data.candidates[0]?.content?.parts[0]?.text || 'No analysis available';
      setAnalysisResult(analysis);

      toast({
        title: "Analysis complete",
        description: "Gemini has analyzed your screenshot",
      });
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the screenshot with Gemini AI",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Buttons */}
      <div className="flex gap-2">
        {!isSharing ? (
          <Button onClick={startScreenShare} variant="default">
            <Monitor className="h-4 w-4 mr-2" />
            Start Screen Share
          </Button>
        ) : (
          <>
            <Button onClick={stopScreenShare} variant="destructive">
              <MonitorOff className="h-4 w-4 mr-2" />
              Stop Sharing
            </Button>
            <Button onClick={captureScreenshot} variant="secondary">
              <Camera className="h-4 w-4 mr-2" />
              Capture Screenshot
            </Button>
          </>
        )}
        
        {enableGeminiAnalysis && capturedImage && (
          <Button 
            onClick={analyzeWithGemini} 
            variant="outline"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Analyze with Gemini
          </Button>
        )}
      </div>

      {/* Video Preview */}
      {isSharing && (
        <Card>
          <CardHeader>
            <CardTitle>Screen Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg shadow-lg"
              style={{ maxHeight: '400px' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Captured Screenshot */}
      {capturedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Captured Screenshot</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={capturedImage} 
              alt="Screenshot" 
              className="w-full rounded-lg shadow-lg"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Gemini Analysis Result */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Gemini AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysisResult}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Browser Support Alert */}
      {!navigator.mediaDevices?.getDisplayMedia && (
        <Alert variant="destructive">
          <AlertDescription>
            Screen sharing is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 