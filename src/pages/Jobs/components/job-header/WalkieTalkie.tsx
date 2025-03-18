import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useWalkieTalkie } from "../../hooks/useWalkieTalkie";
import { useIsMobile } from "@/hooks/use-mobile";
interface WalkieTalkieProps {
  jobId: string;
}
export const WalkieTalkie = ({
  jobId
}: WalkieTalkieProps) => {
  const {
    isTransmitting,
    isListening,
    startRecording,
    stopRecording,
    toggleListening
  } = useWalkieTalkie(jobId);
  const isMobile = useIsMobile();
  return <div className="flex items-center gap-2">
      <Button variant="outline" size={isMobile ? "sm" : "icon"} onClick={toggleListening} aria-label={isListening ? "Mute walkie-talkie" : "Unmute walkie-talkie"} className="rounded-full min-w-0 w-10 h-10 bg-blue-400 hover:bg-blue-300">
        {isListening ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>
      <Button className={`bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider flex items-center gap-2 h-10 ${isMobile ? "px-3 text-xs min-w-0" : "min-w-[200px] h-12"}`} onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} aria-label="Walkie talkie transmission button">
        {isTransmitting ? <MicOff className="animate-pulse w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {!isMobile && (isTransmitting ? "TRANSMITTING..." : "WALKIE TALKIE")}
        {isMobile && (isTransmitting ? "" : "")}
      </Button>
    </div>;
};