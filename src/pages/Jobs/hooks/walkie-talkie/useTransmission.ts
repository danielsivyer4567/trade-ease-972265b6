
import { useToast } from "@/hooks/use-toast";

export const useTransmission = (
  jobId: string,
  socketRef: React.MutableRefObject<WebSocket | null>,
  mediaRecorder: React.MutableRefObject<MediaRecorder | null>,
  audio: HTMLAudioElement,
  setIsTransmitting: (transmitting: boolean) => void
) => {
  const { toast } = useToast();

  const startRecording = () => {
    if (mediaRecorder.current?.state === 'inactive') {
      setIsTransmitting(true);
      audio.play().catch(console.error);
      mediaRecorder.current?.start();

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'transmission_started',
          jobId: jobId,
          userId: "user-123",
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

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'transmission_ended',
          jobId: jobId,
          userId: "user-123",
          timestamp: new Date().toISOString()
        }));
      }

      toast({
        title: "Transmission Complete",
        description: "Your message has been sent to the team"
      });
    }
  };

  return {
    startRecording,
    stopRecording
  };
};
