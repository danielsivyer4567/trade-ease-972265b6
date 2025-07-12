
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudioHandling } from "./walkie-talkie/useAudioHandling";
import { useWebSocket } from "./walkie-talkie/useWebSocket";
import { useTransmission } from "./walkie-talkie/useTransmission";

export const useWalkieTalkie = (jobId: string) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const audioChunks = useRef<Blob[]>([]);
  const audioQueue = useRef<Blob[]>([]);

  // Initialize WebSocket first
  const socketRef = useWebSocket(jobId, isListening, setIsConnected);

  // Then initialize audio handling with the socket reference
  const {
    audio,
    mediaRecorder,
    playNextInQueue,
    initializeAudio
  } = useAudioHandling(jobId, socketRef, audioChunks, audioQueue);

  // Handle WebSocket messages for audio
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'audio' && data.jobId === jobId && isListening) {
            const audioData = atob(data.audioData);
            const arrayBuffer = new ArrayBuffer(audioData.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < audioData.length; i++) {
              uint8Array[i] = audioData.charCodeAt(i);
            }
            const audioBlob = new Blob([uint8Array], { type: 'audio/wav' });
            audioQueue.current.push(audioBlob);
            if (!isListening) {
              playNextInQueue();
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
    }
  }, [socketRef, jobId, isListening, playNextInQueue]);

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
