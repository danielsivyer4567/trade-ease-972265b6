
import { useState, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AudioProcessingOptions {
  silenceDetectionThreshold?: number;
  silenceDetectionDuration?: number;
}

export const useAudioProcessing = (options: AudioProcessingOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  const silenceDetectionThreshold = options.silenceDetectionThreshold || 15;
  const silenceDetectionDuration = options.silenceDetectionDuration || 1500;

  const setupAudioAnalysis = (stream: MediaStream) => {
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
  };

  const checkAudioLevel = () => {
    if (!isListening || !analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const average = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;

    if (average < silenceDetectionThreshold) {
      if (silenceTimeoutRef.current === null) {
        silenceTimeoutRef.current = window.setTimeout(() => {
          if (isListening) {
            stopListening();
          }
        }, silenceDetectionDuration);
      }
    } else {
      if (silenceTimeoutRef.current !== null) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    requestAnimationFrame(checkAudioLevel);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      audioChunksRef.current = [];
      setRecognizedText(null);

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
      
      // Start monitoring audio levels
      requestAnimationFrame(checkAudioLevel);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

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

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Audio = base64data.split(',')[1];

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
          setRecognizedText(data.text);
          toast.success(`Recognized: "${data.text}"`);
          return data.text;
        } else {
          toast.warning("Couldn't understand audio");
          return null;
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Error processing your instruction");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean up resources when the component unmounts
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

  return {
    isListening,
    isProcessing,
    recognizedText,
    startListening,
    stopListening
  };
};
