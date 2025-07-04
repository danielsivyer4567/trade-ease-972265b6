import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, 
  Hand, 
  Target, 
  ArrowRight, 
  Circle, 
  Type, 
  X,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';
import { OverlayCommand } from '@/services/AISupportService';

interface OverlayRendererProps {
  commands?: OverlayCommand[];
  isActive?: boolean;
  onCommandComplete?: (commandId: string) => void;
  autoPlay?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

interface OverlayElement {
  id: string;
  command: OverlayCommand;
  element: HTMLDivElement;
  startTime: number;
  duration: number;
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({
  commands = [],
  isActive = false,
  onCommandComplete,
  autoPlay = false,
  speed = 'normal'
}) => {
  const [activeOverlays, setActiveOverlays] = useState<OverlayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const commandQueueRef = useRef<OverlayCommand[]>([]);

  // Speed multipliers
  const speedMultipliers = {
    slow: 2.0,
    normal: 1.0,
    fast: 0.5
  };

  // Create overlay element
  const createOverlayElement = useCallback((command: OverlayCommand): HTMLDivElement => {
    const element = document.createElement('div');
    element.style.position = 'fixed';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '9999';
    element.style.transition = 'all 0.3s ease-in-out';
    
    // Position the element
    element.style.left = `${command.position.x}px`;
    element.style.top = `${command.position.y}px`;
    
    // Apply command-specific styling
    switch (command.type) {
      case 'highlight':
        element.style.width = `${command.size?.width || 100}px`;
        element.style.height = `${command.size?.height || 40}px`;
        element.style.backgroundColor = command.color || '#00ff00';
        element.style.opacity = '0.3';
        element.style.border = `2px solid ${command.color || '#00ff00'}`;
        element.style.borderRadius = '4px';
        break;
        
      case 'cursor':
        element.innerHTML = `<div style="
          width: 20px;
          height: 20px;
          background: ${command.color || '#ff0000'};
          border-radius: 50%;
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 20px;
            left: 10px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 10px solid ${command.color || '#ff0000'};
          "></div>
        </div>`;
        break;
        
      case 'arrow':
        element.innerHTML = `<div style="
          width: 40px;
          height: 40px;
          color: ${command.color || '#ff0000'};
          font-size: 40px;
          line-height: 1;
        ">→</div>`;
        break;
        
      case 'circle':
        element.style.width = `${command.size?.width || 50}px`;
        element.style.height = `${command.size?.height || 50}px`;
        element.style.border = `3px solid ${command.color || '#ff0000'}`;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = 'transparent';
        break;
        
      case 'text':
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        element.style.color = 'white';
        element.style.padding = '8px 12px';
        element.style.borderRadius = '4px';
        element.style.fontSize = '14px';
        element.style.fontWeight = '500';
        element.style.whiteSpace = 'nowrap';
        element.textContent = command.text || '';
        break;
    }
    
    // Apply animations
    if (command.animation) {
      switch (command.animation) {
        case 'pulse':
          element.style.animation = 'pulse 1s infinite';
          break;
        case 'fade':
          element.style.animation = 'fade 2s infinite';
          break;
        case 'bounce':
          element.style.animation = 'bounce 1s infinite';
          break;
      }
    }
    
    return element;
  }, []);

  // Add overlay to DOM
  const addOverlay = useCallback((command: OverlayCommand): OverlayElement => {
    const element = createOverlayElement(command);
    const overlayElement: OverlayElement = {
      id: `overlay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command,
      element,
      startTime: Date.now(),
      duration: command.duration || 3000
    };
    
    document.body.appendChild(element);
    return overlayElement;
  }, [createOverlayElement]);

  // Remove overlay from DOM
  const removeOverlay = useCallback((overlay: OverlayElement) => {
    if (overlay.element.parentNode) {
      overlay.element.parentNode.removeChild(overlay.element);
    }
  }, []);

  // Clear all overlays
  const clearAllOverlays = useCallback(() => {
    activeOverlays.forEach(removeOverlay);
    setActiveOverlays([]);
  }, [activeOverlays, removeOverlay]);

  // Process command queue
  const processCommandQueue = useCallback(() => {
    if (!isPlaying || currentCommandIndex >= commandQueueRef.current.length) {
      setIsPlaying(false);
      return;
    }

    const command = commandQueueRef.current[currentCommandIndex];
    const overlay = addOverlay(command);
    
    setActiveOverlays(prev => [...prev, overlay]);
    setCurrentCommandIndex(prev => prev + 1);

    // Schedule command completion
    setTimeout(() => {
      removeOverlay(overlay);
      setActiveOverlays(prev => prev.filter(o => o.id !== overlay.id));
      
      if (onCommandComplete) {
        onCommandComplete(overlay.id);
      }
    }, command.duration || 3000);

    // Schedule next command
    const delay = (command.duration || 3000) * speedMultipliers[speed];
    setTimeout(() => {
      processCommandQueue();
    }, delay);
  }, [isPlaying, currentCommandIndex, addOverlay, removeOverlay, onCommandComplete, speed]);

  // Start playing commands
  const startPlayback = useCallback(() => {
    if (commands.length === 0) return;
    
    commandQueueRef.current = [...commands];
    setCurrentCommandIndex(0);
    setIsPlaying(true);
    clearAllOverlays();
  }, [commands, clearAllOverlays]);

  // Stop playing commands
  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    clearAllOverlays();
  }, [clearAllOverlays]);

  // Reset playback
  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentCommandIndex(0);
    clearAllOverlays();
  }, [clearAllOverlays]);

  // Execute single command
  const executeCommand = useCallback((command: OverlayCommand) => {
    const overlay = addOverlay(command);
    setActiveOverlays(prev => [...prev, overlay]);
    
    setTimeout(() => {
      removeOverlay(overlay);
      setActiveOverlays(prev => prev.filter(o => o.id !== overlay.id));
    }, command.duration || 3000);
  }, [addOverlay, removeOverlay]);

  // Auto-play when commands change
  useEffect(() => {
    if (autoPlay && commands.length > 0 && !isPlaying) {
      startPlayback();
    }
  }, [commands, autoPlay, isPlaying, startPlayback]);

  // Process command queue when playing
  useEffect(() => {
    if (isPlaying) {
      processCommandQueue();
    }
  }, [isPlaying, processCommandQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllOverlays();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clearAllOverlays]);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }
      @keyframes fade {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getCommandIcon = (type: string) => {
    switch (type) {
      case 'highlight': return <Target className="h-4 w-4" />;
      case 'cursor': return <MousePointer className="h-4 w-4" />;
      case 'arrow': return <ArrowRight className="h-4 w-4" />;
      case 'circle': return <Circle className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'clear': return <X className="h-4 w-4" />;
      default: return <Hand className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Hand className="h-5 w-5" />
              AI Overlay Controls
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {activeOverlays.length > 0 && (
                <Badge variant="outline">
                  {activeOverlays.length} Active
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              onClick={isPlaying ? stopPlayback : startPlayback}
              variant="default"
              size="sm"
              disabled={commands.length === 0}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            
            <Button
              onClick={resetPlayback}
              variant="outline"
              size="sm"
              disabled={commands.length === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={clearAllOverlays}
              variant="outline"
              size="sm"
              disabled={activeOverlays.length === 0}
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {/* Command Queue */}
          {commands.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Command Queue ({commands.length})</h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {commands.map((command, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border text-xs cursor-pointer transition-colors ${
                      index === currentCommandIndex && isPlaying
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => executeCommand(command)}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {getCommandIcon(command.type)}
                      <span className="font-medium">{command.type}</span>
                    </div>
                    <div className="text-gray-600">
                      {command.text || `${command.position.x}, ${command.position.y}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Overlays */}
          {activeOverlays.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Active Overlays ({activeOverlays.length})</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeOverlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className="p-2 rounded border bg-green-50 border-green-200 text-xs"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {getCommandIcon(overlay.command.type)}
                      <span className="font-medium">{overlay.command.type}</span>
                    </div>
                    <div className="text-gray-600">
                      {overlay.command.text || `${overlay.command.position.x}, ${overlay.command.position.y}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overlay Container */}
      <div
        ref={containerRef}
        className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <Hand className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Overlay rendering area</p>
          <p className="text-xs">Overlays will appear on your actual screen</p>
        </div>
      </div>
    </div>
  );
}; 