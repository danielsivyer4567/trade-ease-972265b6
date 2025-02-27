
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Coffee, PackageX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobHeaderProps {
  job: Job;
}

export const JobHeader = ({ job }: JobHeaderProps) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [isOnSmoko, setIsOnSmoko] = useState(false);
  const [audio] = useState(new Audio("/ringtone.mp3"));
  const { toast } = useToast();
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioQueue = useRef<Array<Blob>>([]);
  const isPlayingRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const jobIdRef = useRef<string>(job.id);

  // Initialize WebSocket connection
  useEffect(() => {
    // Create a WebSocket connection with a more specific URL
    // In a production app, you would use an environment variable for the base URL
    const WEBSOCKET_BASE_URL = "wss://api.yourcompany.com/ws";
    const userId = "user-123"; // In production, get this from your auth system
    const authToken = "your-auth-token"; // In production, get this from your auth system
    
    // Construct the WebSocket URL with job ID and authentication
    const socket = new WebSocket(
      `${WEBSOCKET_BASE_URL}/jobs/${job.id}?userId=${userId}&token=${authToken}`
    );
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      // Join the job channel with authentication
      socket.send(JSON.stringify({
        type: 'join',
        jobId: job.id,
        userId: userId,
        authToken: authToken
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'audio' && data.jobId === job.id && isListening) {
          // Convert base64 audio data to a Blob
          const audioData = atob(data.audioData);
          const arrayBuffer = new ArrayBuffer(audioData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < audioData.length; i++) {
            uint8Array[i] = audioData.charCodeAt(i);
          }
          
          const audioBlob = new Blob([uint8Array], { type: 'audio/wav' });
          
          // Add to queue and play if not already playing
          audioQueue.current.push(audioBlob);
          if (!isPlayingRef.current) {
            playNextInQueue();
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Lost connection to the team. Trying to reconnect...",
        variant: "destructive"
      });
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect in a real implementation
      setTimeout(() => {
        toast({
          title: "Reconnecting",
          description: "Attempting to reconnect to the team communication..."
        });
        // In a real implementation, you would recall this effect to reconnect
      }, 5000);
    };
    
    socketRef.current = socket;
    
    // Clean up WebSocket on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [job.id, toast]);

  // Set up audio recording
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          
          // Send the audio data over WebSocket
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            // Convert Blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
              const base64Audio = reader.result?.toString().split(',')[1]; // Remove data URL prefix
              if (base64Audio) {
                const userId = "user-123"; // In production, get this from your auth system
                
                socketRef.current?.send(JSON.stringify({
                  type: 'audio',
                  jobId: job.id,
                  userId: userId,
                  timestamp: new Date().toISOString(),
                  audioData: base64Audio
                }));
              }
            };
          }
          
          // Add to local queue for playback as well (for testing)
          audioQueue.current.push(audioBlob);
          
          // If not already playing, start playing audio messages
          if (!isPlayingRef.current) {
            playNextInQueue();
          }
          
          audioChunks.current = [];
        };
      })
      .catch(error => {
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
  }, [audio, toast, job.id]);

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
    
    // When this message finishes playing, play the next one if available
    playbackAudio.onended = () => {
      URL.revokeObjectURL(audioUrl); // Clean up
      playNextInQueue();
    };

    try {
      await playbackAudio.play();
      
      // Show toast when a new transmission is received
      if (isListening) {
        toast({
          title: "Incoming Transmission",
          description: `Receiving audio from team member`,
        });
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      playNextInQueue(); // Try the next one if this one fails
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current?.state === 'inactive') {
      audioChunks.current = [];
      setIsTransmitting(true);
      
      // Play the ringtone to indicate start of transmission
      audio.play().catch(console.error);
      
      // Start recording
      mediaRecorder.current?.start();
      
      // Notify team members through WebSocket that you're starting transmission
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const userId = "user-123"; // In production, get this from your auth system
        
        socketRef.current.send(JSON.stringify({
          type: 'transmission_started',
          jobId: job.id,
          userId: userId,
          timestamp: new Date().toISOString()
        }));
      }
      
      toast({
        title: "Transmitting",
        description: "Your voice is being transmitted to the team",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsTransmitting(false);
      audio.pause();
      audio.currentTime = 0;
      
      // Notify team members through WebSocket that you've stopped transmission
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const userId = "user-123"; // In production, get this from your auth system
        
        socketRef.current.send(JSON.stringify({
          type: 'transmission_ended',
          jobId: job.id,
          userId: userId,
          timestamp: new Date().toISOString()
        }));
      }
      
      toast({
        title: "Transmission Complete",
        description: "Your message has been sent to the team",
      });
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Walkie-Talkie Muted" : "Walkie-Talkie Unmuted",
      description: isListening ? "You won't receive transmissions" : "You will receive transmissions"
    });
    
    // Clear the audio queue when muting
    if (isListening) {
      audioQueue.current = [];
    }
    
    // Notify system about listening state change
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const userId = "user-123"; // In production, get this from your auth system
      
      socketRef.current.send(JSON.stringify({
        type: isListening ? 'mute' : 'unmute',
        jobId: job.id,
        userId: userId,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const handleSmoko = () => {
    setIsOnSmoko(!isOnSmoko);
    toast({
      title: isOnSmoko ? "Break Ended" : "Break Started",
      description: isOnSmoko ? "Back to work!" : "Enjoy your break!",
    });
  };

  const handlePackUp = () => {
    toast({
      title: "Packing Up",
      description: "End of work day recorded. Good job!",
    });
  };

  return (
    <Card className="relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{job.customer}</h2>
            <p className="text-gray-500">{job.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className="rounded-full"
            >
              {isListening ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              className={`bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[150px] h-12 ${
                isOnSmoko ? 'animate-pulse' : ''
              }`}
              onClick={handleSmoko}
            >
              <Coffee className={isOnSmoko ? 'animate-bounce' : ''} />
              SMOKO
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[150px] h-12"
              onClick={handlePackUp}
            >
              <PackageX />
              PACK HER UP
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[200px] h-12"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              {isTransmitting ? <MicOff className="animate-pulse" /> : <Mic />}
              {isTransmitting ? "TRANSMITTING..." : "WALKIE TALKIE"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={job.status === "invoiced" ? "default" : "secondary"}>
            {job.status}
          </Badge>
          <span className="text-gray-500">{job.date}</span>
        </div>
      </div>
    </Card>
  );
}
