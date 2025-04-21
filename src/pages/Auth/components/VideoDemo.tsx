import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

const VideoDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleExpand = () => {
    setIsFullscreen(!isFullscreen);
    // In a real implementation, you might use the Fullscreen API
    // document.documentElement.requestFullscreen();
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative bg-black rounded-md overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
        style={{ maxWidth: isFullscreen ? '100%' : '100%' }}
      >
        {/* Black video background */}
        <div className="w-full h-full bg-black">
          {/* Top right expand button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-white hover:bg-black/30 rounded-full z-10"
            onClick={handleExpand}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>

          {/* Center play button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-0 hover:bg-black/40 w-16 h-16 relative"
                onClick={handlePlay}
              >
                {/* Custom play button with filled inner triangle */}
                <div className="relative">
                  {/* Red outer ring */}
                  <div className="w-14 h-14 rounded-full border-2 border-red-500"></div>
                  
                  {/* Red filled triangle */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/2" 
                    style={{
                      width: '0',
                      height: '0',
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: '16px solid #ef4444',
                    }}
                  ></div>
                </div>
              </Button>
            </div>
          )}

          {/* Video content (just a message when "playing") */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-lg">Trade Ease Demo Playing...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Watch a demonstration of Trade Ease features and capabilities.
        </p>
      </div>
    </div>
  );
};

export default VideoDemo; 