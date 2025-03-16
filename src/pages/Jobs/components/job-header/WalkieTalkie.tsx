
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useWalkieTalkie } from "../../hooks/useWalkieTalkie";

interface WalkieTalkieProps {
  jobId: string;
}

export const WalkieTalkie = ({ jobId }: WalkieTalkieProps) => {
  const {
    isTransmitting,
    isListening,
    startRecording,
    stopRecording,
    toggleListening
  } = useWalkieTalkie(jobId);

  return (
    <>
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
        onMouseDown={startRecording} 
        onMouseUp={stopRecording} 
        onMouseLeave={stopRecording} 
        onTouchStart={startRecording} 
        onTouchEnd={stopRecording}
      >
        {isTransmitting ? <MicOff className="animate-pulse" /> : <Mic />}
        {isTransmitting ? "TRANSMITTING..." : "WALKIE TALKIE"}
      </Button>
    </>
  );
};
