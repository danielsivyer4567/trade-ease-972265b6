import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWalkieTalkie = (jobId: string) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [audio] = useState(new Audio("/ringtone.mp3"));
  const { toast } = useToast();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioQueue = useRef<Array<Blob>>([]);
  const isPlayingRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const WEBSOCKET_BASE_URL = "wss://api.yourcompany.com/ws";
    const userId = "user-123";
    const authToken = "your-auth-token";

    const socket = new WebSocket(`${WEBSOCKET_BASE_URL}/jobs/${jobId}?userId=${userId}&token=${authToken}`);
    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({
        type: 'join',
        jobId: jobId,
        userId: userId,
        authToken: authToken
      }));
    };
    socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'audio' && data.jobId === jobId && isListening) {
          const audioData = atob(data.audioData);
          const arrayBuffer = new ArrayBuffer(audioData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < audioData.length; i++) {
            uint8Array[i] = audioData.charCodeAt(i);
          }
          const audioBlob = new Blob([uint8Array], {
            type: 'audio/wav'
          });

          audioQueue.current.push(audioBlob);
          if (!isPlayingRef.current) {
            playNextInQueue();
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    socket.onerror = error => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Lost connection to the team. Trying to reconnect...",
        variant: "destructive"
      });
    };
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => {
        toast({
          title: "Reconnecting",
          description: "Attempting to reconnect to the team communication..."
        });
      }, 5000);
    };
    socketRef.current = socket;

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [jobId, toast]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = event => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: 'audio/wav'
        });

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            if (base64Audio) {
              const userId = "user-123";

              socketRef.current?.send(JSON.stringify({
                type: 'audio',
                jobId: jobId,
                userId: userId,
                timestamp: new Date().toISOString(),
                audioData: base64Audio
              }));
            }
          };
        }

        audioQueue.current.push(audioBlob);

        if (!isPlayingRef.current) {
          playNextInQueue();
        }
        audioChunks.current = [];
      };
    }).catch(error => {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    });
    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, toast, jobId]);

  const playNextInQueue = async () => {
    if (audioQueue.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const nextAudio = audioQueue.current.shift();
    if (!nextAudio) return;
    const audioUrl = URL.createObjectURL(nextAudio);
    const playbackAudio = new Audio(audioUrl);

    playbackAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      playNextInQueue();
    };
    try {
      await playbackAudio.play();

      if (isListening) {
        toast({
          title: "Incoming Transmission",
          description: `Receiving audio from team member`
        });
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      playNextInQueue();
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current?.state === 'inactive') {
      audioChunks.current = [];
      setIsTransmitting(true);

      audio.play().catch(console.error);

      mediaRecorder.current?.start();

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const userId = "user-123";

        socketRef.current.send(JSON.stringify({
          type: 'transmission_started',
          jobId: jobId,
          userId: userId,
          timestamp: new Date().toISOString()
        }));
      }
      toast({
        title: "Transmitting",
        description: "Your voice is being transmitted to the team"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsTransmitting(false);
      audio.pause();
      audio.currentTime = 0;

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const userId = "user-123";

        socketRef.current.send(JSON.stringify({
          type: 'transmission_ended',
          jobId: jobId,
          userId: userId,
          timestamp: new Date().toISOString()
        }));
      }
      toast({
        title: "Transmission Complete",
        description: "Your message has been sent to the team"
      });
    }
  };

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

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const userId = "user-123";

        socketRef.current.send(JSON.stringify({
          type: isListening ? 'mute' : 'unmute',
          jobId: jobId,
          userId: userId,
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
