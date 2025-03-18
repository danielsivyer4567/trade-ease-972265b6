
import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useWebSocket = (
  jobId: string, 
  isListening: boolean,
  audioQueue: React.MutableRefObject<Blob[]>,
  playNextInQueue: () => void,
  setIsConnected: (connected: boolean) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

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
      setIsConnected(false);
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
  }, [jobId, isListening, toast, audioQueue, playNextInQueue, setIsConnected]);

  return socketRef;
};
