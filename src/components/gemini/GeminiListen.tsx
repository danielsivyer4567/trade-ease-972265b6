
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GeminiListenProps {
  className?: string;
}

const GeminiListen: React.FC<GeminiListenProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = handleAudioStop;
      
      mediaRecorder.start();
      setIsListening(true);
      toast.info("Listening for instructions...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
  };

  const handleAudioStop = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix
        const base64Audio = base64data.split(',')[1];
        
        // Send to Supabase Edge Function for processing
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.text) {
          toast.success(`Recognized: "${data.text}"`);
          processCommand(data.text);
        } else {
          toast.warning("Couldn't understand audio");
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Error processing your instruction");
    } finally {
      setIsProcessing(false);
    }
  };

  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Basic command processing - this could be expanded with a more sophisticated NLP system
    if (lowerText.includes("go to") || lowerText.includes("navigate to")) {
      const destination = extractDestination(lowerText);
      if (destination) {
        navigateTo(destination);
      }
    } else if (lowerText.includes("create") || lowerText.includes("new")) {
      if (lowerText.includes("job")) {
        window.location.href = "/jobs/new";
      } else if (lowerText.includes("customer")) {
        window.location.href = "/customers/new";
      } else if (lowerText.includes("quote")) {
        window.location.href = "/quotes/new";
      } else if (lowerText.includes("workflow")) {
        window.location.href = "/workflow";
      }
    } else if (lowerText.includes("search")) {
      // Search functionality could be implemented here
      toast.info("Search functionality coming soon!");
    } else {
      toast.info("Command not recognized. Try saying 'Go to Jobs' or 'Create new customer'");
    }
  };

  const extractDestination = (text: string): string | null => {
    const goToMatch = text.match(/go to\s+(\w+)/i);
    const navigateToMatch = text.match(/navigate to\s+(\w+)/i);
    
    if (goToMatch && goToMatch[1]) {
      return goToMatch[1];
    } else if (navigateToMatch && navigateToMatch[1]) {
      return navigateToMatch[1];
    }
    
    return null;
  };

  const navigateTo = (destination: string) => {
    const destinations: Record<string, string> = {
      dashboard: "/",
      home: "/",
      jobs: "/jobs",
      customers: "/customers",
      quotes: "/quotes",
      workflow: "/workflow",
      settings: "/settings",
      calendar: "/calendar",
      team: "/teams",
      expenses: "/expenses",
      banking: "/banking",
      inventory: "/inventory"
    };
    
    const url = destinations[destination.toLowerCase()];
    if (url) {
      window.location.href = url;
      toast.success(`Navigating to ${destination}`);
    } else {
      toast.warning(`Unknown destination: ${destination}`);
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Button
        size="lg"
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors duration-200 ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        }`}
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        ) : isListening ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </Button>
      
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm">Listening...</p>
          <div className="flex justify-center mt-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-2 mx-1 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiListen;
