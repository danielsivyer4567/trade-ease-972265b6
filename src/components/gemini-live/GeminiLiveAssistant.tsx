import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
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
  PhoneOff,
  Headphones
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MicrophoneTest } from './MicrophoneTest';

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

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    speechRecognition: any;
  }
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
  const [showMicTest, setShowMicTest] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Initialize Gemini Live connection
  const connectToGeminiLive = async () => {
    setIsConnecting(true);
    
    try {
      // For now, we'll use the REST API approach since WebSocket requires special setup
      setIsConnected(true);
      setIsConnecting(false);
      
      // Send initial greeting
      addMessage({
        role: 'assistant',
        content: "Hey there! I'm your AI assistant powered by Gemini. I can see your screen and help you with anything in the Trade Ease app. What would you like help with today?"
      });
      
      // Start audio capture
      startAudioCapture();
      
      toast({
        title: "Connected",
        description: "Gemini assistant is ready to help",
      });
      
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to Gemini",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  // Start audio capture for voice input using Web Speech API
  const startAudioCapture = async () => {
    try {
      // Check if speech recognition is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        
        setCurrentTranscript(transcript);
        
        if (event.results[last].isFinal) {
          // Add user message
          addMessage({
            role: 'user',
            content: transcript
          });
          
          // Process with Gemini (include screenshot if screen is being shared)
          processUserInput(transcript, isScreenSharing);
          setCurrentTranscript('');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice input",
            variant: "destructive"
          });
        }
      };

      recognition.onend = () => {
        // Restart if still connected and not muted
        if (isConnected && !isMuted) {
          recognition.start();
        }
      };

      if (!isMuted) {
        recognition.start();
      }

      // Store recognition instance
      (window as any).speechRecognition = recognition;
      
    } catch (error) {
      console.error('Error starting audio capture:', error);
      toast({
        title: "Voice Input Error",
        description: "Could not start voice recognition. Try using text input instead.",
        variant: "destructive"
      });
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
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
      
      // Automatically ask how to help when screen sharing starts
      setTimeout(() => {
        const message = "I can now see your screen! How can I help you with Trade Ease today?";
        addMessage({
          role: 'assistant',
          content: message
        });
        speakText(message);
      }, 1000);
      
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

  // Process user input with Gemini
  const processUserInput = async (text: string, includeScreenshot?: boolean) => {
    try {
      // Add context if screen is being shared
      const contextualText = includeScreenshot 
        ? `User is sharing their screen with Trade Ease app. User says: "${text}". Please help them based on what you can see on their screen.`
        : text;
      
      let parts: any[] = [{ text: contextualText }];
      
      // Add screenshot if screen is being shared
      if (includeScreenshot && isScreenSharing && canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          
          const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
          parts.push({
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          });
        }
      }
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts
            }],
            generationConfig: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        addMessage({
          role: 'assistant',
          content: responseText
        });
        
        // Convert to speech
        speakText(responseText);
      }
    } catch (error) {
      console.error('Error processing input:', error);
      addMessage({
        role: 'system',
        content: 'Sorry, I encountered an error processing your request.'
      });
    }
  };

  // Send screenshot to Gemini for analysis
  const sendScreenshotToGemini = (base64Image: string) => {
    // Don't send automatic messages, just store the screenshot for next user input
    // This prevents spamming the user with repeated messages
    console.log('Screenshot captured for context');
  };



  // Convert text to speech
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  };

  // Play audio response from Gemini (simplified for now)
  const playAudioResponse = async (base64Audio: string) => {
    // For now, we'll use text-to-speech instead of raw audio playback
    console.log('Audio playback not implemented in this version');
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
    // Stop speech recognition
    if ((window as any).speechRecognition) {
      (window as any).speechRecognition.stop();
    }
    stopScreenShare();
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
                onClick={() => setShowMicTest(!showMicTest)}
                title="Audio Test"
              >
                <Headphones className="h-4 w-4" />
              </Button>
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
          {/* Show microphone test if enabled */}
          {showMicTest ? (
            <MicrophoneTest onClose={() => setShowMicTest(false)} />
          ) : (
            <>
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
            <div className="mt-4 space-y-3">
              {/* Text input as primary method */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message or use voice..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const text = e.currentTarget.value;
                      addMessage({ role: 'user', content: text });
                      processUserInput(text, isScreenSharing);
                      e.currentTarget.value = '';
                    }
                  }}
                  disabled={!isConnected}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Type your message or use voice..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      const text = input.value;
                      addMessage({ role: 'user', content: text });
                      processUserInput(text, isScreenSharing);
                      input.value = '';
                    }
                  }}
                  disabled={!isConnected}
                >
                  Send
                </Button>
              </div>
              
              <div className="flex gap-2">
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
                    Connect to Assistant
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if ((window as any).speechRecognition) {
                          if (isMuted) {
                            (window as any).speechRecognition.start();
                          } else {
                            (window as any).speechRecognition.stop();
                          }
                        }
                      }}
                      variant={isMuted ? "destructive" : "secondary"}
                      size="icon"
                      title={isMuted ? "Enable voice input" : "Disable voice input"}
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
          </>
        )}
        </CardContent>
      </Card>
    </div>
  );
};
