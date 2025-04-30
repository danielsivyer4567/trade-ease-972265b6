import { useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useWebSocket = (
  jobId: string, 
  isListening: boolean,
  setIsConnected: (connected: boolean) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const connect = useCallback(() => {
    try {
      const WEBSOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_URL || "wss://api.yourcompany.com/ws";
      const userId = localStorage.getItem('userId') || 'anonymous';
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Authentication Error",
          description: "Please log in to use this feature",
          variant: "destructive"
        });
        return;
      }

      const socket = new WebSocket(`${WEBSOCKET_BASE_URL}/jobs/${jobId}?userId=${userId}&token=${authToken}`);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
        
        try {
          socket.send(JSON.stringify({
            type: 'join',
            jobId: jobId,
            userId: userId,
            authToken: authToken
          }));
        } catch (error) {
          console.error('Error sending join message:', error);
          socket.close();
        }
      };

      socket.onerror = error => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: "Lost connection to the team. Trying to reconnect...",
          variant: "destructive"
        });
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Only attempt to reconnect if the closure wasn't clean
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            toast({
              title: "Reconnecting",
              description: "Attempting to reconnect to the team communication..."
            });
            connect();
          }, 5000);
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Handle different message types here if needed
          console.log('Received message:', data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish connection. Please try again later.",
        variant: "destructive"
      });
    }
  }, [jobId, toast, setIsConnected]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, "Component unmounting");
      }
    };
  }, [connect]);

  return socketRef;
};
