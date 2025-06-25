<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Loader2, Mic, HelpCircle, Monitor, Sparkles } from 'lucide-react';
=======

import React, { useState, useEffect } from 'react';
import { Loader2, Mic, HelpCircle } from 'lucide-react';
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAudioProcessing } from './hooks/useAudioProcessing';
import { processCommand } from './utils/commandProcessor';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
import GeminiIcon from './GeminiIcon';
import ListeningBubble from './ListeningBubble';
import RecognizedTextBubble from './RecognizedTextBubble';

interface GeminiVoiceAssistantProps {
  className?: string;
}

const GeminiVoiceAssistant: React.FC<GeminiVoiceAssistantProps> = ({
  className
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
<<<<<<< HEAD
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showScreenShareButton, setShowScreenShareButton] = useState(false);
  const navigate = useNavigate();
=======
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
  
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

<<<<<<< HEAD
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

=======
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
  const buttonClasses = `
    ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-400 hover:bg-cyan-300'} 
    font-extralight
    transition-all duration-300
    shadow-lg hover:shadow-xl
    rounded-full p-3
    flex items-center justify-center
    h-14 w-14 sm:h-16 sm:w-16
  `;

<<<<<<< HEAD
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
=======
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <TooltipProvider>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <Button 
              className={buttonClasses}
              onClick={isListening ? stopListening : startListening} 
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
      
      {isListening && <ListeningBubble />}

      {recognizedText && !isListening && !isProcessing && (
        <RecognizedTextBubble text={recognizedText} />
      )}

      <div className="absolute bottom-0 right-20 mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-gray-100"
                onClick={() => setShowTooltip(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Voice commands help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default GeminiVoiceAssistant;
