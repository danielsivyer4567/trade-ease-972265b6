import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession } from "@google/generative-ai";
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
  const [recognitionStatus, setRecognitionStatus] = useState('Idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<ChatSession | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize Gemini Live connection
  const connectToGeminiLive = async () => {
    setIsConnecting(true);
    console.log('Connecting with API key:', geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'No API key');

    if (!geminiApiKey) {
      toast({
        title: "API Key Missing",
        description: "The Gemini API key is not configured.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Validate the API key by sending a simple, non-streaming request
      await model.generateContent("hello");

      // If validation is successful, set up the chat session
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `You are an expert user of the "Trade Ease" application. Your goal is to provide helpful, step-by-step guidance. A user is sharing their screen and has asked for help. Analyze the user's request and the screenshot to provide a clear, actionable response.` }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am ready to assist the user with the Trade Ease application by analyzing their screen and requests." }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 1,
          topK: 1,
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ]
      });

      chatRef.current = chat;
      setIsConnected(true);
      
      const greeting = "Hey there! I'm your AI assistant powered by Gemini. I can see your screen and help you with anything in the Trade Ease app. What would you like help with today?";
      addMessage({
        role: 'assistant',
        content: greeting
      });
      speakText(greeting);
      
      startAudioCapture();
      
      toast({
        title: "Connected",
        description: "Gemini assistant is ready to help",
      });

    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      const detailedError = error instanceof Error ? error.message : String(error);
      toast({
        title: "Connection Failed",
        description: `Details: ${detailedError}. Please check your API key and Google Cloud project settings.`,
        variant: "destructive",
        duration: 9000
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Start audio capture for voice input using Web Speech API
  const startAudioCapture = async () => {
    try {
      // Stop any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      // Proactively get the audio stream to ensure microphone is active, then release it.
      const tempStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      tempStream.getTracks().forEach(track => track.stop());

      // Check if speech recognition is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setRecognitionStatus('Listening...');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        
        setRecognitionStatus(`Hearing: "${transcript}"`);
        setCurrentTranscript(transcript);
        
        if (event.results[last].isFinal) {
          console.log('Final transcript received. Processing with Gemini...');
          // Add user message
          addMessage({
            role: 'user',
            content: transcript
          });
          
          // Process with Gemini (include screenshot if screen is being shared)
          processUserInput(transcript);
          setCurrentTranscript('');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setRecognitionStatus(`Error: ${event.error}`);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice input",
            variant: "destructive"
          });
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setRecognitionStatus('Idle');
        // Only restart if connected, not muted, and not currently speaking
        if (isConnected && !isMuted && !isSpeaking && recognitionRef.current) {
          setTimeout(() => {
            if (recognitionRef.current && isConnected && !isMuted && !isSpeaking) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('Could not restart recognition:', error);
              }
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;

      if (!isMuted && !isSpeaking) {
        recognition.start();
      }
      
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
  const processUserInput = async (text: string) => {
    if (!chatRef.current) {
      toast({
        title: "Not Connected",
        description: "The assistant is not connected. Please connect first.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Processing user input with SDK:', { text });

    try {
      const screenshotData = getBase64Screenshot();
      const promptParts: ({text: string} | {inlineData: {mimeType: string, data: string}})[] = [
        { text: `User request: "${text}"` }
      ];

      if (isScreenSharing && screenshotData) {
        promptParts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: screenshotData,
          }
        });
      }
      
      // Start a streaming request
      const result = await chatRef.current.sendMessageStream(promptParts);

      let responseText = '';
      addMessage({ role: 'assistant', content: '...' }); // Placeholder for streaming response

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        responseText += chunkText;
        
        // Update the last message in the conversation with the streamed content
        setConversation(prev => {
            const newConversation = [...prev];
            newConversation[newConversation.length - 1].content = responseText;
            return newConversation;
        });
      }

      console.log("Full streamed response received:", responseText);
      speakText(responseText);

    } catch (error) {
      console.error('Error processing input with SDK:', error);
      const detailedError = error instanceof Error ? error.message : String(error);
      const errorMessage = `Sorry, I encountered an error. Details: ${detailedError}`;
      addMessage({
        role: 'system',
        content: errorMessage,
      });
      speakText(errorMessage);
    }
  };

  const getBase64Screenshot = (): string | null => {
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
    return null;
  };

  // Convert text to speech
  const speakText = (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    setRecognitionStatus('Speaking...');

    // Stop speech recognition during synthesis
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping recognition for speech:', error);
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('Speech synthesis started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech synthesis finished, preparing to restart recognition.');
      setIsSpeaking(false);
      setRecognitionStatus('Idle');
      
      // Restart recognition after a small delay to ensure speech synthesis has fully ended
      setTimeout(() => {
        if (isConnected && !isMuted && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Could not restart recognition after speech:', error);
          }
        }
      }, 500);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setRecognitionStatus('Idle');
      
      // Try to restart recognition even if speech failed
      setTimeout(() => {
        if (isConnected && !isMuted && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Could not restart recognition after speech error:', error);
          }
        }
      }, 500);
    };
    
    // Find a better voice
    const voices = speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
    const naturalVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Natural'));

    if (googleVoice) {
      utterance.voice = googleVoice;
    } else if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    // Otherwise, it will use the system default

    speechSynthesis.speak(utterance);
  };

  // Add message to conversation
  const addMessage = (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    setConversation(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  };

  // Disconnect from Gemini Live
  const disconnect = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (error) {
        console.log('Error stopping recognition during disconnect:', error);
      }
    }
    
    // Stop any ongoing speech synthesis
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    setRecognitionStatus('Disconnected');
    stopScreenShare();
    setIsConnected(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    // Make sure voices are loaded
    speechSynthesis.getVoices();
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
                    <div className="text-center text-xs text-muted-foreground">
                      Status: <span className="font-medium text-black">{recognitionStatus}</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message or use voice..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            const text = e.currentTarget.value;
                            addMessage({ role: 'user', content: text });
                            processUserInput(text);
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
                            processUserInput(text);
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
                                if (recognitionRef.current) {
                                    if (isMuted) {
                                    // Enabling microphone - start recognition
                                    try {
                                        recognitionRef.current.start();
                                    } catch (error) {
                                        console.log('Could not start recognition:', error);
                                    }
                                    } else {
                                    // Disabling microphone - stop recognition
                                    try {
                                        recognitionRef.current.stop();
                                    } catch (error) {
                                        console.log('Could not stop recognition:', error);
                                    }
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
