import React, { useState, useRef } from 'react';
import { Bell, Phone, Search, User, Clock, PhoneCall, PhoneOutgoing, PhoneIncoming, PhoneMissed, Play, Pause, Volume2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationContextProvider';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { HeaderVariant as DestructiveButton } from '@/components/ui/destructive-button';

interface NotificationButtonProps {
  className?: string;
}

// Mock data for recent calls with audio recordings
const recentCalls = [
  { 
    id: 1, 
    name: "John Smith", 
    number: "(555) 123-4567", 
    time: "Today, 2:30 PM", 
    duration: "5m 23s", 
    type: "incoming",
    // In a real app, this would be an actual audio file URL
    audioUrl: "https://example.com/recordings/call1.mp3"
  },
  { 
    id: 2, 
    name: "Jane Doe", 
    number: "(555) 987-6543", 
    time: "Today, 11:15 AM", 
    duration: "3m 45s", 
    type: "outgoing",
    audioUrl: "https://example.com/recordings/call2.mp3"
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    number: "(555) 456-7890", 
    time: "Yesterday, 4:45 PM", 
    duration: "12m 07s", 
    type: "incoming",
    audioUrl: "https://example.com/recordings/call3.mp3"
  },
  { 
    id: 4, 
    name: "Sarah Wilson", 
    number: "(555) 234-5678", 
    time: "Yesterday, 10:20 AM", 
    duration: "1m 32s", 
    type: "missed",
    audioUrl: null // Missed calls don't have recordings
  },
  { 
    id: 5, 
    name: "David Lee", 
    number: "(555) 876-5432", 
    time: "2 days ago", 
    duration: "8m 49s", 
    type: "outgoing",
    audioUrl: "https://example.com/recordings/call5.mp3"
  },
];

export const NotificationButton = ({ className }: NotificationButtonProps) => {
  const { 
    unreadCount, 
    toggleDraggableNotifications, 
    isDraggableNotificationOpen 
  } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>("dialpad");
  const [playingCallId, setPlayingCallId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioVolume, setAudioVolume] = useState(80);
  
  // Audio player reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Icon mapping for call types
  const getCallIcon = (type: string) => {
    switch(type) {
      case "incoming": return <PhoneIncoming className="h-4 w-4 text-green-600" />;
      case "outgoing": return <PhoneOutgoing className="h-4 w-4 text-blue-600" />;
      case "missed": return <PhoneMissed className="h-4 w-4 text-red-600" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };
  
  // Handle play/pause for a call recording
  const togglePlayAudio = (callId: number, audioUrl: string | null) => {
    if (!audioUrl) return; // No audio for this call
    
    if (playingCallId === callId && isPlaying) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Stop current audio if any
      if (audioRef.current && playingCallId !== callId) {
        audioRef.current.pause();
        // In a real app, we would set the audio source here
        // audioRef.current.src = audioUrl;
      }
      
      // Start new audio
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          // In a real app, we might show an error message to the user
        });
      }
      
      setPlayingCallId(callId);
      setIsPlaying(true);
    }
  };
  
  // Update audio progress
  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };
  
  // Handle audio progress change
  const handleProgressChange = (newValue: number[]) => {
    if (audioRef.current && newValue[0] !== undefined) {
      const newProgress = newValue[0];
      setAudioProgress(newProgress);
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newValue: number[]) => {
    if (audioRef.current && newValue[0] !== undefined) {
      const newVolume = newValue[0];
      setAudioVolume(newVolume);
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Phone Button with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full"
            aria-label="Phone customers"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="h-6 w-6 text-green-600 transform scale-x-[-1]"
            >
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="dialpad">Dialpad</TabsTrigger>
              <TabsTrigger value="recent">Recent Calls</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dialpad" className="space-y-2">
              <div className="flex items-center border rounded-md mb-2">
                <Search className="h-4 w-4 mx-2 text-muted-foreground" />
                <Input 
                  placeholder="Search customers..." 
                  className="border-0 focus-visible:ring-0 h-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                  <Button 
                    key={key} 
                    variant="outline" 
                    className="h-10 w-10 rounded-md flex items-center justify-center"
                  >
                    {key}
                  </Button>
                ))}
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="max-h-40 overflow-y-auto">
                {/* Example customers - In a real app, this would be filtered based on searchQuery */}
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>John Smith</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Jane Doe</span>
                </DropdownMenuItem>
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Recent Calls</DropdownMenuLabel>
                
                {recentCalls.map((call) => (
                  <div key={call.id} className="mb-4 border-b pb-3 last:border-0">
                    <DropdownMenuItem className="flex items-start py-2 cursor-pointer">
                      <div className="flex-shrink-0 mt-0.5 mr-2">
                        {getCallIcon(call.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{call.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{call.number}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{call.time}</span>
                          <span className="mx-1 text-muted-foreground">•</span>
                          <span className="text-xs font-medium">{call.duration}</span>
                        </div>
                      </div>
                      {call.audioUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlayAudio(call.id, call.audioUrl);
                          }}
                        >
                          {playingCallId === call.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {!call.audioUrl && (
                        <Badge variant="outline" className="text-xs bg-gray-100">No Recording</Badge>
                      )}
                    </DropdownMenuItem>
                    
                    {/* Audio player controls - only show for the currently playing call */}
                    {playingCallId === call.id && (
                      <div className="px-3 py-2 mt-1 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Slider
                            value={[audioProgress]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={handleProgressChange}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-3 w-3 text-muted-foreground" />
                          <Slider
                            value={[audioVolume]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="w-24"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Audio element - hidden but used for playback */}
              <audio 
                ref={audioRef}
                className="hidden"
                onTimeUpdate={updateAudioProgress}
                onEnded={() => {
                  setIsPlaying(false);
                  setAudioProgress(0);
                }}
              />
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* New Destructive Button */}
      <DestructiveButton />
      
      {/* Notifications Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "relative border-2 border-primary rounded-full",
          className, 
          isDraggableNotificationOpen && "text-primary bg-primary/10"
        )} 
        onClick={toggleDraggableNotifications}
        aria-label={`${unreadCount} unread notifications`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-6 w-6"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};
