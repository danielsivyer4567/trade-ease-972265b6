
import { useState, useRef, useCallback } from 'react';

interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  resetRecording: () => void;
  error: string | null;
  mediaRecorder: MediaRecorder | null;
}

const useAudioRecorder = (): AudioRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          stream.getTracks().forEach(track => track.stop()); // Stop microphone access
        };
        
        mediaRecorderRef.current.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setError('Error during recording.');
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Microphone access denied or unavailable.');
        setIsRecording(false);
      }
    } else {
      setError('Audio recording is not supported by your browser.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (mediaRecorderRef.current && isRecording) {
      return new Promise((resolve) => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            setIsRecording(false);
            // Ensure tracks are stopped after recording finishes
            mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            resolve(blob);
          };
          mediaRecorderRef.current.stop();
        } else {
            resolve(null);
        }
      });
    }
    return null;
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
       mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    setError(null);
  }, [audioUrl]);

  return { 
    isRecording, 
    audioBlob, 
    audioUrl, 
    startRecording, 
    stopRecording, 
    resetRecording, 
    error,
    mediaRecorder: mediaRecorderRef.current 
  };
};

export default useAudioRecorder;