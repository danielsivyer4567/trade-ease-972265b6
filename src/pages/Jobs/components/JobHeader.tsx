
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

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const playbackAudio = new Audio(audioUrl);
          playbackAudio.play().catch(error => {
            toast({
              title: "Playback Error",
              description: "Could not play recorded audio",
              variant: "destructive"
            });
          });
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
  }, [audio, toast]);

  const startRecording = () => {
    if (mediaRecorder.current?.state === 'inactive') {
      audioChunks.current = [];
      setIsTransmitting(true);
      audio.play().catch(console.error);
      mediaRecorder.current?.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsTransmitting(false);
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Walkie-Talkie Muted" : "Walkie-Talkie Unmuted",
      description: isListening ? "You won't receive transmissions" : "You will receive transmissions"
    });
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
