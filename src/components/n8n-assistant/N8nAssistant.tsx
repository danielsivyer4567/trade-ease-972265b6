import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, 
  MonitorOff, 
  Camera, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Zap,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface N8nAssistantProps {
  geminiApiKey?: string;
  onSuggestion?: (suggestion: string) => void;
}

interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant' | 'error' | 'suggestion';
  content: string;
  timestamp: Date;
  metadata?: {
    errorType?: string;
    nodeType?: string;
    workflow?: string;
  };
}

interface N8nContext {
  currentWorkflow?: string;
  activeNode?: string;
  detectedError?: string;
  suggestedFix?: string;
}

export const N8nAssistant: React.FC<N8nAssistantProps> = ({
  geminiApiKey,
  onSuggestion
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [context, setContext] = useState<N8nContext>({});
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const analyzeIntervalRef = useRef<NodeJS.Timeout>();

  // n8n specific prompts for different scenarios
  const N8N_PROMPTS = {
    general: `You are an n8n workflow automation expert assistant. Analyze this screenshot of an n8n interface and:
1. Identify what the user is trying to do
2. Detect any errors or issues
3. Provide specific, actionable guidance
4. Suggest best practices for n8n workflows`,
    
    error: `Analyze this n8n error screenshot and:
1. Identify the exact error message and its cause
2. Explain why this error occurs in n8n
3. Provide step-by-step instructions to fix it
4. Suggest preventive measures`,
    
    setup: `Guide the user through this n8n setup by:
1. Identifying the current step in the setup process
2. Explaining what needs to be configured
3. Providing specific values or settings to use
4. Highlighting any common pitfalls to avoid`,
    
    learning: `Help the user learn n8n by:
1. Explaining the visible nodes and their purposes
2. Describing how data flows through the workflow
3. Suggesting improvements or alternative approaches
4. Teaching best practices for this type of automation`
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      setStream(mediaStream);
      setIsSharing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      addMessage({
        type: 'assistant',
        content: 'Screen sharing started! I can now see your n8n interface. Feel free to ask questions or I can analyze what you\'re working on.',
      });

      toast({
        title: "n8n Assistant Active",
        description: "I'm ready to help with your n8n workflows",
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Failed to start screen sharing",
        description: "Please allow screen sharing permission",
        variant: "destructive"
      });
    }
  };

  // Stop screen sharing
  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsSharing(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }
    setAutoAnalyze(false);
  };

  // Add message to chat
  const addMessage = (message: Omit<AssistantMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  };

  // Capture and analyze screenshot
  const analyzeScreen = async (promptType: keyof typeof N8N_PROMPTS = 'general', userQuestion?: string) => {
    if (!videoRef.current || !geminiApiKey) return;

    setIsAnalyzing(true);
    
    try {
      // Capture screenshot
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      const base64Data = imageData.split(',')[1];

      // Build the prompt
      let prompt = N8N_PROMPTS[promptType];
      if (userQuestion) {
        prompt += `\n\nUser's specific question: "${userQuestion}"`;
      }
      if (context.currentWorkflow) {
        prompt += `\n\nContext: Working on workflow "${context.currentWorkflow}"`;
      }

      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/png",
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      const analysis = data.candidates[0]?.content?.parts[0]?.text || 'No analysis available';
      
      // Parse the analysis for specific n8n insights
      const insights = parseN8nInsights(analysis);
      
      addMessage({
        type: 'assistant',
        content: analysis,
        metadata: insights
      });

      // Update context based on insights
      if (insights.errorType) {
        setContext(prev => ({ ...prev, detectedError: insights.errorType }));
      }

      if (onSuggestion && insights.suggestedFix) {
        onSuggestion(insights.suggestedFix);
      }

    } catch (error) {
      console.error('Error analyzing screen:', error);
      addMessage({
        type: 'error',
        content: 'Failed to analyze the screen. Please check your Gemini API key and try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Parse n8n specific insights from Gemini response
  const parseN8nInsights = (analysis: string): any => {
    const insights: any = {};
    
    // Look for error patterns
    if (analysis.toLowerCase().includes('error')) {
      insights.errorType = 'detected';
    }
    
    // Look for node types
    const nodeTypes = ['http request', 'webhook', 'function', 'set', 'if', 'switch', 'merge'];
    nodeTypes.forEach(nodeType => {
      if (analysis.toLowerCase().includes(nodeType)) {
        insights.nodeType = nodeType;
      }
    });
    
    return insights;
  };

  // Handle user input
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    addMessage({
      type: 'user',
      content: userInput,
    });

    if (isSharing) {
      analyzeScreen('general', userInput);
    } else {
      addMessage({
        type: 'assistant',
        content: 'Please start screen sharing so I can see your n8n interface and help you better.',
      });
    }

    setUserInput('');
  };

  // Auto-analyze for errors
  useEffect(() => {
    if (autoAnalyze && isSharing) {
      analyzeIntervalRef.current = setInterval(() => {
        analyzeScreen('error');
      }, 5000); // Check every 5 seconds
    } else if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }

    return () => {
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, [autoAnalyze, isSharing]);

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              n8n AI Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              {isSharing && (
                <Badge variant="default" className="animate-pulse">
                  <Monitor className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {autoAnalyze && (
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  Auto-Detect
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="mx-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="screen">Screen</TabsTrigger>
              <TabsTrigger value="guide">Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Start screen sharing to get help with your n8n workflows</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.type === 'error'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.type === 'assistant' && <Sparkles className="h-4 w-4 mt-0.5" />}
                          {message.type === 'error' && <AlertCircle className="h-4 w-4 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.metadata && (
                              <div className="mt-2 flex gap-2">
                                {message.metadata.errorType && (
                                  <Badge variant="destructive" className="text-xs">
                                    Error Detected
                                  </Badge>
                                )}
                                {message.metadata.nodeType && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.metadata.nodeType}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about n8n workflows, errors, or best practices..."
                    disabled={!isSharing}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!isSharing || !userInput.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="screen" className="flex-1 p-4">
              <div className="space-y-4">
                {/* Control Buttons */}
                <div className="flex flex-wrap gap-2">
                  {!isSharing ? (
                    <Button onClick={startScreenShare} variant="default">
                      <Monitor className="h-4 w-4 mr-2" />
                      Start Screen Share
                    </Button>
                  ) : (
                    <>
                      <Button onClick={stopScreenShare} variant="destructive">
                        <MonitorOff className="h-4 w-4 mr-2" />
                        Stop Sharing
                      </Button>
                      <Button 
                        onClick={() => analyzeScreen('general')} 
                        variant="secondary"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4 mr-2" />
                        )}
                        Analyze Now
                      </Button>
                      <Button
                        onClick={() => setAutoAnalyze(!autoAnalyze)}
                        variant={autoAnalyze ? "default" : "outline"}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Auto-Detect Errors
                      </Button>
                    </>
                  )}
                </div>

                {/* Video Preview */}
                {isSharing && (
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full"
                      style={{ maxHeight: '400px' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="guide" className="flex-1 p-4">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      addMessage({
                        type: 'assistant',
                        content: `Here's how to get started with n8n:
1. Create a new workflow by clicking the "+" button
2. Add your first node - try the "Manual Trigger" for testing
3. Connect nodes by dragging from the output to the input
4. Configure each node by clicking on it
5. Test your workflow with the "Execute Workflow" button

Would you like me to guide you through creating your first workflow?`
                      });
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started with n8n
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      addMessage({
                        type: 'assistant',
                        content: `Common n8n errors and fixes:
• "No data" - Make sure your previous node outputs data
• "Invalid credentials" - Check your authentication settings
• "Connection timeout" - Verify API endpoints and network
• "Expression error" - Check your JavaScript expressions syntax

Share your screen and I can help diagnose specific errors!`
                      });
                    }}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Common Errors & Fixes
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      addMessage({
                        type: 'assistant',
                        content: `n8n best practices:
• Use descriptive names for nodes and workflows
• Add notes to complex nodes
• Test with small data sets first
• Use error workflows for handling failures
• Version control your workflows
• Use expressions for dynamic values

Want me to review your workflow for improvements?`
                      });
                    }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Best Practices
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 