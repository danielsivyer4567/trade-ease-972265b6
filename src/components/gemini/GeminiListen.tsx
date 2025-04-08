import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
interface GeminiListenProps {
  className?: string;
}
const GeminiListen: React.FC<GeminiListenProps> = ({
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const silenceDetectionThreshold = 15; // Threshold for silence detection
  const silenceDetectionDuration = 1500; // Duration of silence before stopping in ms

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      audioChunksRef.current = [];

      // Set up audio analysis for silence detection
      setupAudioAnalysis(stream);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = handleAudioStop;
      mediaRecorder.start(100); // Collect data in 100ms chunks
      setIsListening(true);
      toast.info("Listening for instructions...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };
  const setupAudioAnalysis = (stream: MediaStream) => {
    // Initialize AudioContext and analyzer
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    // Start monitoring audio levels
    checkAudioLevel();
  };
  const checkAudioLevel = () => {
    if (!isListening || !analyserRef.current || !dataArrayRef.current) return;

    // Get current audio data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Calculate average volume level
    const average = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;

    // If sound level is below threshold, start silence timeout
    if (average < silenceDetectionThreshold) {
      if (silenceTimeoutRef.current === null) {
        silenceTimeoutRef.current = window.setTimeout(() => {
          if (isListening) {
            stopListening();
          }
        }, silenceDetectionDuration);
      }
    } else {
      // If sound is detected, clear the silence timeout
      if (silenceTimeoutRef.current !== null) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    // Continue checking audio level
    requestAnimationFrame(checkAudioLevel);
  };
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    // Clean up audio analysis
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    // Clear any remaining silence timeout
    if (silenceTimeoutRef.current !== null) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setIsListening(false);
  };
  const handleAudioStop = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm'
      });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix
        const base64Audio = base64data.split(',')[1];

        // Send to Supabase Edge Function for processing
        const {
          data,
          error
        } = await supabase.functions.invoke('voice-to-text', {
          body: {
            audio: base64Audio
          }
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
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
      if (silenceTimeoutRef.current !== null) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Gemini icon as SVG
  const GeminiIcon = ({
    className = ""
  }: {
    className?: string;
  }) => <svg width="24" height="24" viewBox="0 0 192 192" className={className} fill="currentColor">
      <path d="M96 16c-44.12 0-80 35.88-80 80s35.88 80 80 80 80-35.88 80-80-35.88-80-80-80zm-9.43 151.84v-31.89L61.36 96l25.21-39.95v-31.9c31.15 3.33 55.56 29.64 55.56 61.85 0 32.2-24.41 58.51-55.56 61.84zm-20.28-34.09v20.3c-19.81-6.12-34.22-24.77-34.22-46.05 0-21.29 14.41-39.94 34.22-46.06v20.31L42.26 96l24.03 37.75z" />
    </svg>;
  return <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Button size="lg" onClick={isListening ? stopListening : startListening} disabled={isProcessing} className="font-extralight bg-cyan-400 hover:bg-cyan-300">
        {isProcessing ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <GeminiIcon className="h-6 w-6 text-white" />}
      </Button>
      
      {isListening && <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm">Listening...</p>
          <div className="flex justify-center mt-1">
            {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-2 mx-1 bg-primary rounded-full animate-pulse" style={{
          animationDelay: `${i * 0.1}s`
        }} />)}
          </div>
        </div>}
    </div>;
};
export default GeminiListen;