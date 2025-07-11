import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'drawing' | 'audio' | 'video';
  title?: string;
  description?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  title,
  description
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          if (mediaType === 'audio' || mediaType === 'video') {
            togglePlayPause();
          }
          break;
        case 'f':
        case 'F':
          if (mediaType === 'video' || mediaType === 'image' || mediaType === 'drawing') {
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          if (mediaType === 'audio' || mediaType === 'video') {
            toggleMute();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mediaType]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update time for audio/video
  useEffect(() => {
    const updateTime = () => {
      const element = audioRef.current || videoRef.current;
      if (element) {
        setCurrentTime(element.currentTime);
        setDuration(element.duration || 0);
      }
    };

    const element = audioRef.current || videoRef.current;
    if (element) {
      element.addEventListener('timeupdate', updateTime);
      element.addEventListener('loadedmetadata', updateTime);
      return () => {
        element.removeEventListener('timeupdate', updateTime);
        element.removeEventListener('loadedmetadata', updateTime);
      };
    }
  }, [mediaType]);

  const togglePlayPause = () => {
    const element = audioRef.current || videoRef.current;
    if (element) {
      if (isPlaying) {
        element.pause();
      } else {
        element.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const element = audioRef.current || videoRef.current;
    if (element) {
      element.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const element = audioRef.current || videoRef.current;
    if (element) {
      element.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    const element = audioRef.current || videoRef.current;
    if (element) {
      element.currentTime = newTime;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await modalRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = `media_${Date.now()}.${mediaType === 'audio' ? 'mp3' : 'png'}`;
    link.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4",
          isFullscreen && "max-w-none max-h-none w-screen h-screen rounded-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            {(mediaType === 'image' || mediaType === 'drawing') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Media Content */}
        <div className="p-4 flex items-center justify-center">
          {mediaType === 'image' && (
            <img
              src={mediaUrl}
              alt="Media content"
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
          )}

          {mediaType === 'drawing' && (
            <div className="relative">
              <img
                src={mediaUrl}
                alt="Drawing"
                className="max-w-full max-h-[60vh] object-contain rounded-lg border-2 border-dashed border-gray-300"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Drawing
              </div>
            </div>
          )}

          {mediaType === 'audio' && (
            <div className="w-full max-w-md">
              <audio
                ref={audioRef}
                src={mediaUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              
              {/* Audio Player UI */}
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {mediaType === 'video' && (
            <div className="relative">
              <video
                ref={videoRef}
                src={mediaUrl}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="max-w-full max-h-[60vh] rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="border-t p-3 bg-gray-50 rounded-b-lg">
          <div className="text-xs text-gray-600 text-center">
            <span className="font-medium">Shortcuts:</span>
            <span className="mx-2">ESC: Close</span>
            {(mediaType === 'audio' || mediaType === 'video') && (
              <>
                <span className="mx-2">SPACE: Play/Pause</span>
                <span className="mx-2">M: Mute</span>
              </>
            )}
            {(mediaType === 'image' || mediaType === 'drawing') && (
              <span className="mx-2">F: Fullscreen</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewer;