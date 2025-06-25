import React, { useState, useEffect } from 'react';
import { Loader2, Mic, HelpCircle, Monitor, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAudioProcessing } from './hooks/useAudioProcessing';
import { processCommand } from './utils/commandProcessor';
import { useNavigate } from 'react-router-dom';
import GeminiIcon from './GeminiIcon';
import ListeningBubble from './ListeningBubble';
import RecognizedTextBubble from './RecognizedTextBubble';

interface GeminiVoiceAssistantProps {
  className?: string;
}

export const GeminiVoiceAssistant: React.FC<GeminiVoiceAssistantProps> = ({
  className
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showScreenShareButton, setShowScreenShareButton] = useState(false);
  const navigate = useNavigate();
  
  const {
    isListening,
    isProcessing,
    recognizedText,
    startListening,
    stopListening
  } = useAudioProcessing({
    silenceDetectionThreshold: 15,
    silenceDetectionDuration: 1500
  });

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('geminiTooltipSeen');
    if (!hasSeenTooltip) {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem('geminiTooltipSeen', 'true');
      }, 5000);
    }
  }, []);

  // Process the recognized text with commands
  useEffect(() => {
    if (recognizedText) {
      processCommand(recognizedText);
    }
  }, [recognizedText]);

  // Show screen share button after first interaction
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        setShowScreenShareButton(true);
      }, 1000); // Show after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  const handleVoiceButtonClick = () => {
    setHasInteracted(true);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleScreenShareClick = () => {
    navigate('/n8n-assistant');
  };

  const buttonClasses = `
    ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-400 hover:bg-cyan-300'} 
    font-extralight
    transition-all duration-300
    shadow-lg hover:shadow-xl
    rounded-full p-3
    flex items-center justify-center
    h-14 w-14 sm:h-16 sm:w-16
  `;

  const screenShareButtonClasses = `
    bg-purple-500 hover:bg-purple-600
    font-extralight
    transition-all duration-500
    shadow-lg hover:shadow-xl
    rounded-full p-3
    flex items-center justify-center
    h-12 w-12 sm:h-14 sm:w-14
    ${showScreenShareButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
  `;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {/* Screen Share AI Help Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className={screenShareButtonClasses}
                onClick={handleScreenShareClick}
                aria-label="Screen share AI help"
              >
                <div className="relative">
                  <Monitor className="h-5 w-5 text-white" />
                  <Sparkles className="h-3 w-3 text-white absolute -top-1 -right-1" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-slate-800 text-white p-3 max-w-[200px]">
              <p className="font-semibold mb-1">AI Screen Share Assistant</p>
              <p className="text-xs">Get AI help with n8n workflows by sharing your screen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Main Voice Assistant Button */}
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <Button 
                className={buttonClasses}
                onClick={handleVoiceButtonClick} 
                disabled={isProcessing}
                aria-label={isListening ? "Stop listening" : "Start voice assistant"}
              >
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : isListening ? (
                  <Mic className="h-6 w-6 text-white animate-pulse" />
                ) : (
                  <GeminiIcon className="h-6 w-6 text-white" isListening={isListening} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-slate-800 text-white p-3 max-w-[200px]">
              <p>Click to use voice commands. Try saying "Go to jobs" or "Create new quote"</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {isListening && <ListeningBubble />}

      {recognizedText && !isListening && !isProcessing && (
        <RecognizedTextBubble text={recognizedText} />
      )}

      <div className="absolute bottom-0 right-20 mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowTooltip(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-slate-800 text-white p-3 max-w-[200px]">
              <p>Need help with voice commands?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
