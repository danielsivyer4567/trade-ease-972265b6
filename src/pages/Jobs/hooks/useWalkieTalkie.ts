
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudioHandling } from "./walkie-talkie/useAudioHandling";
import { useWebSocket } from "./walkie-talkie/useWebSocket";
import { useTransmission } from "./walkie-talkie/useTransmission";

export const useWalkieTalkie = (jobId: string) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const {
    audio,
    mediaRecorder,
    audioQueue,
    playNextInQueue,
    initializeAudio
  } = useAudioHandling(jobId, socketRef);

  const socketRef = useWebSocket(
    jobId,
    isListening,
    audioQueue,
    playNextInQueue,
    setIsConnected
  );

  const { startRecording, stopRecording } = useTransmission(
    jobId,
    socketRef,
    mediaRecorder,
    audio,
    setIsTransmitting
  );

  useEffect(() => {
    initializeAudio();
    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, initializeAudio]);

  const toggleListening = () => {
    if (!isConnected && !isListening) {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        setIsConnected(true);
        setIsListening(true);
        toast({
          title: "Connected to Team",
          description: "You will now receive team transmissions"
        });
      }
    } else {
      setIsListening(!isListening);
      toast({
        title: isListening ? "Walkie-Talkie Muted" : "Walkie-Talkie Active",
        description: isListening ? "You won't receive transmissions" : "You will receive transmissions"
      });

      if (isListening) {
        audioQueue.current = [];
      }

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: isListening ? 'mute' : 'unmute',
          jobId: jobId,
          userId: "user-123",
          timestamp: new Date().toISOString()
        }));
      }
    }
  };

  return {
    isTransmitting,
    isListening,
    isConnected,
    startRecording,
    stopRecording,
    toggleListening
  };
};
