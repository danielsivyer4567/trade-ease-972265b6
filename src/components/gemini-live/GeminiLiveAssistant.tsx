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
  Headphones,
  LifeBuoy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MicrophoneTest } from './MicrophoneTest';
import { AnnotationOverlay, Annotation } from './AnnotationOverlay';

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

type GeminiContentPart = {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
};

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
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Initialize Gemini Live connection
  const connectToGeminiLive = async () => {
    setIsConnecting(true);
    
    console.log('Connecting with API key:', geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'No API key');
    
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
        
        console.log('Speech recognition result:', { transcript, isFinal: event.results[last].isFinal });
        setCurrentTranscript(transcript);
        
        if (event.results[last].isFinal) {
          console.log('Final transcript received. Processing with Gemini...');
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
      
      console.log('Audio capture started.');
      
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

  // Process user input with Gemini
  const processUserInput = async (text: string, includeScreenshot?: boolean) => {
    console.log('processUserInput called with:', { text, includeScreenshot });
    try {
      const systemInstruction = {
        role: "system",
        parts: [{
          text: `You are an expert user of the "Trade Ease" application. Your goal is to provide helpful, step-by-step guidance. A user is sharing their screen and has asked for help. Analyze the user's request and the screenshot to provide a clear, actionable response.`
        }]
      };

      const userParts: GeminiContentPart[] = [{ text: `User request: "${text}"` }];

      if (includeScreenshot) {
        const screenshotData = getBase64Screenshot();
        if (screenshotData) {
          userParts.push({ inline_data: { mime_type: "image/jpeg", data: screenshotData } });
        }
      }

      const userRequest = {
        role: "user",
        parts: userParts,
      };
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [systemInstruction, userRequest],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(errorData.error?.message || `API returned ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.candidates && responseData.candidates.length > 0) {
        const responseText = responseData.candidates[0].content.parts[0].text;
        
        // Since we removed the JSON requirement, we just process the text directly.
        addMessage({ role: 'assistant', content: responseText });
        speakText(responseText);

      } else {
        console.error("No candidates in response from Gemini:", responseData);
        throw new Error("Invalid response structure from API.");
      }

    } catch (error) {
      console.error('Error processing input:', error);
      addMessage({
        role: 'system',
        content: 'Sorry, I encountered an error processing your request.'
      });
    }
  };

  const getBase64Screenshot = (): string => {
    if (isScreenSharing && canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      }
    }
    return '';
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
    <>
      <video ref={videoRef} autoPlay muted playsInline style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <AnnotationOverlay 
        annotations={annotations}
        width={window.innerWidth}
        height={window.innerHeight}
        onClear={() => setAnnotations([])}
      />

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Gemini Live Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                {isConnected && (
                  <Badge variant={isScreenSharing ? 'default' : 'secondary'}>
                    {isScreenSharing ? 'Screen Sharing Active' : 'Screen Sharing Inactive'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMicTest(true)}
                  title="Audio Test"
                >
                  <Headphones className="h-4 w-4" />
                </Button>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex gap-4 p-4 overflow-hidden">
            {showMicTest ? (
              <MicrophoneTest onClose={() => setShowMicTest(false)} />
            ) : (
              <>
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-4">
                      {conversation.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md p-3 rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                      {currentTranscript && (
                        <div className="flex justify-end">
                            <div className="max-w-md p-3 rounded-xl bg-primary/80 text-primary-foreground">
                                <p className="text-sm italic">{currentTranscript}</p>
                            </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                    
                  <div className="mt-4 space-y-3">
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
                    
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                        {!isConnected ? (
                            <Button
                            onClick={connectToGeminiLive}
                            disabled={isConnecting}
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
                            </>
                        )}
                        </div>

                        {isConnected && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                    toast({
                                        title: 'Feature Coming Soon',
                                        description: 'Human agent escalation and ticketing are not yet available. Please continue to use the AI assistant for guidance.',
                                    });
                                    }}
                                    variant="outline"
                                    title="Escalate to a human agent"
                                >
                                    <LifeBuoy className="h-4 w-4 mr-2" />
                                    Request Help
                                </Button>
                                <Button
                                    onClick={disconnect}
                                    variant="outline"
                                >
                                    <PhoneOff className="h-4 w-4 mr-2" />
                                    End Call
                                </Button>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
                
                <div className="w-1/3 flex flex-col gap-4">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-lg bg-black" />
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      The AI can see your screen and will provide guidance. Your screen is not recorded.
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
