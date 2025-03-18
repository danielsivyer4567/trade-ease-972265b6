
import { useState, useRef, MutableRefObject } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAudioHandling = (
  jobId: string, 
  socketRef: React.MutableRefObject<WebSocket | null>,
  audioChunks: MutableRefObject<Blob[]>,
  audioQueue: MutableRefObject<Blob[]>
) => {
  const [audio] = useState(new Audio("/ringtone.mp3"));
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const playNextInQueue = async () => {
    if (audioQueue.current.length === 0) {
      return;
    }
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
    } catch (error) {
      console.error("Error playing audio:", error);
      playNextInQueue();
    }
  };

  const handleAudioData = (base64Audio: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const userId = "user-123";
      socketRef.current.send(JSON.stringify({
        type: 'audio',
        jobId: jobId,
        userId: userId,
        timestamp: new Date().toISOString(),
        audioData: base64Audio
      }));
    }
  };

  const initializeAudio = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            if (base64Audio) {
              handleAudioData(base64Audio);
            }
          };
          audioQueue.current.push(audioBlob);
          if (!audioQueue.current.length) {
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
  };

  return {
    audio,
    mediaRecorder,
    playNextInQueue,
    initializeAudio
  };
};
