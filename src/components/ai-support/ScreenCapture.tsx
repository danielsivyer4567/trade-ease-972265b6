import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  MonitorOff, 
  Camera, 
  Eye, 
  EyeOff, 
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiSupportService, ScreenAnalysisRequest } from '@/services/AISupportService';

interface ScreenCaptureProps {
  onAnalysisComplete?: (analysis: any) => void;
  autoCapture?: boolean;
  captureInterval?: number; // milliseconds
  enableStreaming?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

export const ScreenCapture: React.FC<ScreenCaptureProps> = ({
  onAnalysisComplete,
  autoCapture = false,
  captureInterval = 5000, // 5 seconds
  enableStreaming = false,
  quality = 'medium'
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [captureCount, setCaptureCount] = useState(0);
  const [autoCaptureActive, setAutoCaptureActive] = useState(false);
  const [streamingActive, setStreamingActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Quality settings
  const qualitySettings = {
    low: { width: 1280, height: 720, frameRate: 15 },
    medium: { width: 1920, height: 1080, frameRate: 30 },
    high: { width: 2560, height: 1440, frameRate: 60 }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      setConnectionStatus('connecting');
      
      const constraints = {
        video: {
          ...qualitySettings[quality],
          displaySurface: 'monitor' as const,
          logicalSurface: true,
          cursor: 'always' as const,
          resizeMode: 'crop-and-scale' as const
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      setStream(mediaStream);
      setIsSharing(true);
      setConnectionStatus('connected');

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
        description: `Quality: ${quality}, Streaming: ${enableStreaming ? 'Enabled' : 'Disabled'}`,
      });

      // Start auto-capture if enabled
      if (autoCapture) {
        startAutoCapture();
      }

      // Start streaming if enabled
      if (enableStreaming) {
        startStreaming();
      }

    } catch (error) {
      console.error('Error starting screen share:', error);
      setConnectionStatus('error');
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
    setConnectionStatus('disconnected');
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Stop auto-capture and streaming
    stopAutoCapture();
    stopStreaming();

    toast({
      title: "Screen sharing stopped",
      description: "Screen capture session ended",
    });
  };

  // Capture screenshot from video stream
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    setIsCapturing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;

      // Set canvas size to match video dimensions
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw the video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/png', 0.9);
      setCapturedImage(imageData);
      setCaptureCount(prev => prev + 1);

      return imageData;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // Analyze captured screenshot
  const analyzeScreenshot = async (imageData: string) => {
    if (!imageData) return;

    setIsAnalyzing(true);
    
    try {
      const request: ScreenAnalysisRequest = {
        imageData,
        context: `Screen capture #${captureCount + 1} from TradeEase application`,
        userId: 'current_user', // This should come from auth context
      };

      const analysis = await aiSupportService.analyzeScreen(request);
      setAnalysisResult(analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }

      toast({
        title: "Analysis complete",
        description: `Confidence: ${(analysis.confidence * 100).toFixed(1)}%`,
      });

    } catch (error) {
      console.error('Error analyzing screenshot:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the screenshot",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-capture functionality
  const startAutoCapture = () => {
    if (captureIntervalRef.current) return;
    
    setAutoCaptureActive(true);
    captureIntervalRef.current = setInterval(async () => {
      const imageData = await captureScreenshot();
      if (imageData) {
        await analyzeScreenshot(imageData);
      }
    }, captureInterval);
  };

  const stopAutoCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setAutoCaptureActive(false);
  };

  // Streaming functionality
  const startStreaming = () => {
    if (streamingIntervalRef.current) return;
    
    setStreamingActive(true);
    streamingIntervalRef.current = setInterval(async () => {
      const imageData = await captureScreenshot();
      if (imageData) {
        // Send to backend for real-time processing
        try {
          await aiSupportService.sendOverlayCommands([]);
        } catch (error) {
          console.warn('Streaming data send failed:', error);
        }
      }
    }, 1000); // Stream every second
  };

  const stopStreaming = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setStreamingActive(false);
  };

  // Manual capture and analyze
  const handleManualCapture = async () => {
    const imageData = await captureScreenshot();
    if (imageData) {
      await analyzeScreenshot(imageData);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoCapture();
      stopStreaming();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'connecting': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <EyeOff className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor()} text-white`}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {connectionStatus}
            </div>
          </Badge>
          {captureCount > 0 && (
            <Badge variant="secondary">
              Captures: {captureCount}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isSharing ? (
            <Button onClick={startScreenShare} variant="default">
              <Eye className="h-4 w-4 mr-2" />
              Start Capture
            </Button>
          ) : (
            <>
              <Button onClick={stopScreenShare} variant="destructive">
                <EyeOff className="h-4 w-4 mr-2" />
                Stop Capture
              </Button>
              <Button 
                onClick={handleManualCapture} 
                variant="secondary"
                disabled={isCapturing || isAnalyzing}
              >
                {isCapturing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                Capture & Analyze
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Video Preview */}
      {isSharing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Screen Preview</span>
              <div className="flex gap-2">
                {autoCaptureActive && (
                  <Badge variant="outline" className="bg-blue-100">
                    Auto-Capture Active
                  </Badge>
                )}
                {streamingActive && (
                  <Badge variant="outline" className="bg-purple-100">
                    Streaming Active
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Captured Screenshot */}
      {capturedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Capture</CardTitle>
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

      {/* Analysis Result */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI Analysis
              <Badge variant="outline">
                {(analysisResult.confidence * 100).toFixed(1)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Analysis:</h4>
                <p className="text-sm text-muted-foreground">
                  {analysisResult.analysis}
                </p>
              </div>
              
              {analysisResult.uiElements && analysisResult.uiElements.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">UI Elements Found:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisResult.uiElements.slice(0, 6).map((element: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {element.type}: {element.text || 'N/A'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {analysisResult.suggestedActions && analysisResult.suggestedActions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Suggested Actions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysisResult.suggestedActions.slice(0, 3).map((action: any, index: number) => (
                      <li key={index}>• {action.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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