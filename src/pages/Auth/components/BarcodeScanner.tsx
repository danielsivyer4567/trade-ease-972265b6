import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, XCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onCodeDetected: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onCodeDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const startScanner = async () => {
    setError(null);
    setIsScanning(true);
    
    try {
      // This would be replaced with actual barcode scanning logic in a production app
      // For now, we'll just simulate a camera feed and barcode detection
      
      // In a real implementation, you would:
      // 1. Request camera access
      // 2. Stream video to the video element
      // 3. Use a library like quagga.js or zxing to detect barcodes
      
      // Simulate finding a QR code after 3 seconds
      setTimeout(() => {
        // Simulate finding a sample organization code
        const mockBarcode = "org_" + Math.random().toString(36).substring(2, 10);
        onCodeDetected(mockBarcode);
        setIsScanning(false);
      }, 3000);
      
    } catch (err) {
      setError("Could not access camera. Please check permissions and try again.");
      setIsScanning(false);
    }
  };
  
  const stopScanner = () => {
    setIsScanning(false);
    
    // In a real implementation, you would stop the camera stream here
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  return (
    <div className="space-y-4">
      {!isScanning ? (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={startScanner}
        >
          <Camera className="h-4 w-4" />
          Scan Organization QR Code
        </Button>
      ) : (
        <div className="relative">
          {/* Scanner overlay */}
          <div className="border-2 border-dashed border-primary rounded-md aspect-video bg-black/5 flex items-center justify-center">
            {/* This would be a real video feed in a production app */}
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover" 
              playsInline 
            />
            
            {/* Scanner visual elements */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary/50 rounded-md">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                </div>
              </div>
              
              <div className="absolute top-2 left-2 right-2 text-center">
                <p className="text-xs font-medium text-white bg-black/50 p-1 rounded">
                  Point your camera at the QR code
                </p>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="absolute bottom-2 right-2 bg-white/80"
                onClick={stopScanner}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">Scanning for organization QR code...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner; 