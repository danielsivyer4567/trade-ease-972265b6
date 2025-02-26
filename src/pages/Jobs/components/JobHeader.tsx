
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RING_TONE_URL = "/ringtone.mp3"; // You would need to add this audio file to your public folder

interface JobHeaderProps {
  job: Job;
}

export const JobHeader = ({ job }: JobHeaderProps) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [audio] = useState(new Audio(RING_TONE_URL));
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const handleWalkieTalkieClick = () => {
    if (!isTransmitting) {
      setIsTransmitting(true);
      audio.play().catch(error => {
        toast({
          title: "Audio Error",
          description: "Could not play walkie-talkie sound",
          variant: "destructive"
        });
      });

      // Simulate transmission duration
      setTimeout(() => {
        setIsTransmitting(false);
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Walkie-Talkie Muted" : "Walkie-Talkie Unmuted",
      description: isListening ? "You won't receive transmissions" : "You will receive transmissions"
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
              className="bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 min-w-[200px] h-12"
              onClick={handleWalkieTalkieClick}
              disabled={isTransmitting}
            >
              {isTransmitting ? <MicOff className="animate-pulse" /> : <Mic />}
              {isTransmitting ? "TRANSMITTING..." : "WALKIE TALKIE"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={job.status === "completed" ? "default" : "secondary"}>
            {job.status}
          </Badge>
          <span className="text-gray-500">{job.date}</span>
        </div>
      </div>
    </Card>
  );
};
