import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, 
  MonitorOff, 
  Mic,
  MicOff,
  Volume2,
  Sparkles, 
  Loader2, 
  MessageSquare,
  AlertCircle,
  Settings,
  Phone,
  PhoneOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeminiLiveAssistantProps {
  geminiApiKey: string;
  onClose?: () => void;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export const GeminiLiveAssistant: React.FC<GeminiLiveAssistantProps> = ({
  geminiApiKey,
  onClose
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Initialize Gemini Live connection
  const connectToGeminiLive = async () => {
    setIsConnecting(true);
    
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext();
      
      // Connect to Gemini Live API via WebSocket
      // Note: This is a simplified version - actual implementation would need proper WebSocket URL
      const ws = new WebSocket(`wss://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${geminiApiKey}`);
      
      ws.onopen = () => {
        console.log('Connected to Gemini Live');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Send initial greeting
        sendInitialGreeting();
      };
      
      ws.onmessage = (event) => {
        handleGeminiResponse(event.data);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to Gemini Live",
          variant: "destructive"
        });
        setIsConnecting(false);
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        console.log('Disconnected from Gemini Live');
      };
      
      websocketRef.current = ws;
      
      // Start audio capture
      startAudioCapture();
      
    } catch (error) {
      console.error('Error connecting to Gemini Live:', error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to Gemini Live",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  // Send initial greeting
  const sendInitialGreeting = () => {
    const greeting = {
      contents: [{
        parts: [{
          text: "Hey there! I'm your AI assistant powered by Gemini. I can see your screen and help you with anything in the Trade Ease app. What would you like help with today?"
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };
    
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(greeting));
      
      addMessage({
        role: 'assistant',
        content: "Hey there! I'm your AI assistant powered by Gemini. I can see your screen and help you with anything in the Trade Ease app. What would you like help with today?"
      });
    }
  };

  // Start audio capture for voice input
  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const audioContext = audioContextRef.current;
      if (!audioContext) return;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (!isMuted && websocketRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert audio data to base64 and send to Gemini
          const base64Audio = arrayBufferToBase64(inputData.buffer);
          
          websocketRef.current.send(JSON.stringify({
            audio: {
              data: base64Audio,
              mimeType: 'audio/pcm;rate=16000'
            }
          }));
        }
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
    } catch (error) {
      console.error('Error starting audio capture:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "window"
        },
        audio: false
      });
      
      mediaStreamRef.current = stream;
      setIsScreenSharing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Handle stream ending
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });
      
      // Start sending screenshots periodically
      startScreenCapture();
      
      toast({
        title: "Screen Sharing Started",
        description: "I can now see your screen and help you better",
      });
      
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Screen Share Failed",
        description: "Could not start screen sharing",
        variant: "destructive"
      });
    }
  };

  // Stop screen sharing
  const stopScreenShare = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsScreenSharing(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Capture and send screenshots periodically
  const startScreenCapture = () => {
    const captureInterval = setInterval(() => {
      if (!isScreenSharing || !videoRef.current || !canvasRef.current) {
        clearInterval(captureInterval);
        return;
      }
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Convert to base64 and send to Gemini
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result as string;
              sendScreenshotToGemini(base64data.split(',')[1]);
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.8);
      }
    }, 2000); // Capture every 2 seconds
  };

  // Send screenshot to Gemini for analysis
  const sendScreenshotToGemini = (base64Image: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Analyzing the current screen. Please let me know what you need help with."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      }));
    }
  };

  // Handle Gemini responses
  const handleGeminiResponse = (data: string) => {
    try {
      const response = JSON.parse(data);
      
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = response.candidates[0].content.parts[0].text;
        addMessage({
          role: 'assistant',
          content: text
        });
        
        // Convert text to speech
        speakText(text);
      }
      
      if (response.audio) {
        // Play audio response
        playAudioResponse(response.audio.data);
      }
      
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
    }
  };

  // Convert text to speech
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  };

  // Play audio response from Gemini
  const playAudioResponse = async (base64Audio: string) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    
    try {
      const audioData = base64ToArrayBuffer(base64Audio);
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Add message to conversation
  const addMessage = (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    setConversation(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  };

  // Utility functions
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Disconnect from Gemini Live
  const disconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    stopScreenShare();
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsConnected(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Gemini Live Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              {isConnected && (
                <Badge variant="default" className="animate-pulse">
                  <Phone className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {isScreenSharing && (
                <Badge variant="secondary">
                  <Monitor className="h-3 w-3 mr-1" />
                  Sharing
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Main conversation area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 border rounded-lg p-4">
              <div className="space-y-4">
                {conversation.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Start a conversation with Gemini Live</p>
                  </div>
                )}
                
                {conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && <Sparkles className="h-4 w-4 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.audioUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => {/* Play audio */}}
                            >
                              <Volume2 className="h-4 w-4 mr-1" />
                              Play Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Current transcript */}
            {currentTranscript && (
              <div className="mt-2 p-2 bg-muted rounded text-sm text-muted-foreground">
                {currentTranscript}...
              </div>
            )}
            
            {/* Controls */}
            <div className="mt-4 flex gap-2">
              {!isConnected ? (
                <Button
                  onClick={connectToGeminiLive}
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Phone className="h-4 w-4 mr-2" />
                  )}
                  Connect to Gemini Live
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  {!isScreenSharing ? (
                    <Button
                      onClick={startScreenShare}
                      variant="secondary"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Share Screen
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScreenShare}
                      variant="destructive"
                    >
                      <MonitorOff className="h-4 w-4 mr-2" />
                      Stop Sharing
                    </Button>
                  )}
                  
                  <Button
                    onClick={disconnect}
                    variant="outline"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Screen preview */}
          {isScreenSharing && (
            <div className="w-96 flex-shrink-0">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-2 text-sm font-medium">Screen Preview</div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full"
                  style={{ maxHeight: '300px' }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  I can see your screen and help you with:
                  <ul className="list-disc list-inside mt-1">
                    <li>Navigating the Trade Ease app</li>
                    <li>Creating jobs, quotes, or invoices</li>
                    <li>Managing customers and teams</li>
                    <li>Using calculators and tools</li>
                    <li>Troubleshooting any issues</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 