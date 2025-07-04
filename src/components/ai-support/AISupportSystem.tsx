import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Eye, 
  Hand, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Shield,
  Activity,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScreenCapture } from './ScreenCapture';
import { OverlayRenderer } from './OverlayRenderer';
import { 
  aiSupportService, 
  AISession, 
  ScreenAnalysisResponse,
  OverlayCommand 
} from '@/services/AISupportService';

interface AISupportSystemProps {
  userId?: string;
  autoStart?: boolean;
  enableVoiceCommands?: boolean;
  enableRealTimeAnalysis?: boolean;
}

export const AISupportSystem: React.FC<AISupportSystemProps> = ({
  userId = 'current_user',
  autoStart = false,
  enableVoiceCommands = false,
  enableRealTimeAnalysis = false
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<AISession | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<ScreenAnalysisResponse | null>(null);
  const [overlayCommands, setOverlayCommands] = useState<OverlayCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [activeTab, setActiveTab] = useState('capture');
  const [assistanceHistory, setAssistanceHistory] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Initialize AI support session
  const startAISupport = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      setIsProcessing(true);

      const session = await aiSupportService.startSession(userId);
      setCurrentSession(session);
      setIsActive(true);
      setConnectionStatus('connected');

      toast({
        title: "AI Support Started",
        description: `Session ID: ${session.sessionId}`,
      });

      // Get initial assistance suggestions
      const suggestions = await aiSupportService.getAssistanceSuggestions('Starting AI support session');
      setAssistanceHistory(suggestions);

    } catch (error) {
      console.error('Failed to start AI support:', error);
      setConnectionStatus('error');
      toast({
        title: "Failed to start AI support",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [userId, toast]);

  // Stop AI support session
  const stopAISupport = useCallback(async () => {
    try {
      setIsProcessing(true);
      await aiSupportService.endSession();
      setCurrentSession(null);
      setIsActive(false);
      setConnectionStatus('disconnected');
      setLatestAnalysis(null);
      setOverlayCommands([]);

      toast({
        title: "AI Support Stopped",
        description: "Session ended successfully",
      });
    } catch (error) {
      console.error('Failed to stop AI support:', error);
      toast({
        title: "Error stopping AI support",
        description: "Session may not have ended properly",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Handle analysis completion
  const handleAnalysisComplete = useCallback((analysis: ScreenAnalysisResponse) => {
    setLatestAnalysis(analysis);
    
    // Convert analysis to overlay commands
    const commands: OverlayCommand[] = [];
    
    // Add highlights for UI elements
    analysis.uiElements.forEach((element, index) => {
      commands.push({
        type: 'highlight',
        position: element.position,
        size: { width: element.position.width, height: element.position.height },
        color: '#00ff00',
        duration: 2000,
        animation: 'pulse'
      });
    });

    // Add cursor guidance for suggested actions
    analysis.suggestedActions.forEach((action, index) => {
      if (action.position) {
        commands.push({
          type: 'cursor',
          position: action.position,
          color: '#ff0000',
          duration: 1500,
          animation: 'bounce'
        });
      }
    });

    // Add text overlays for explanations
    if (analysis.analysis) {
      commands.push({
        type: 'text',
        position: { x: 50, y: 50 },
        text: `Analysis: ${analysis.analysis.substring(0, 100)}...`,
        color: '#ffffff',
        duration: 5000
      });
    }

    setOverlayCommands(commands);

    // Add to assistance history
    setAssistanceHistory(prev => [
      `Analysis completed with ${(analysis.confidence * 100).toFixed(1)}% confidence`,
      ...prev.slice(0, 9) // Keep last 10 entries
    ]);

  }, []);

  // Handle overlay command completion
  const handleOverlayComplete = useCallback((commandId: string) => {
    setAssistanceHistory(prev => [
      `Overlay command ${commandId} completed`,
      ...prev.slice(0, 9)
    ]);
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isActive) {
      startAISupport();
    }
  }, [autoStart, isActive, startAISupport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopAISupport();
      }
    };
  }, [isActive, stopAISupport]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Activity className="h-4 w-4" />;
      case 'connecting': return <Zap className="h-4 w-4 animate-pulse" />;
      case 'error': return <Shield className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Advanced AI Support System
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getStatusColor()} text-white`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon()}
                  {connectionStatus}
                </div>
              </Badge>
              {currentSession && (
                <Badge variant="secondary">
                  Session: {currentSession.sessionId.slice(-8)}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                AI-powered remote assistance with screen analysis and visual guidance
              </p>
              {currentSession && (
                <p className="text-xs text-muted-foreground">
                  Started: {currentSession.startTime.toLocaleTimeString()}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isActive ? (
                <Button 
                  onClick={startAISupport} 
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start AI Support
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={stopAISupport} 
                  variant="destructive"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop AI Support
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      {isActive && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="capture" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Screen Capture
            </TabsTrigger>
            <TabsTrigger value="overlay" className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Overlay Controls
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-4">
            <ScreenCapture
              onAnalysisComplete={handleAnalysisComplete}
              autoCapture={enableRealTimeAnalysis}
              captureInterval={5000}
              enableStreaming={enableRealTimeAnalysis}
              quality="medium"
            />
          </TabsContent>

          <TabsContent value="overlay" className="space-y-4">
            <OverlayRenderer
              commands={overlayCommands}
              isActive={isActive}
              onCommandComplete={handleOverlayComplete}
              autoPlay={false}
              speed="normal"
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Latest Analysis</h4>
                      <Badge variant="outline">
                        {(latestAnalysis.confidence * 100).toFixed(1)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{latestAnalysis.analysis}</p>
                    </div>

                    {latestAnalysis.uiElements && latestAnalysis.uiElements.length > 0 && (
                      <div>
                        <h5 className="font-semibold mb-2">UI Elements Detected:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {latestAnalysis.uiElements.map((element, index) => (
                            <div key={index} className="p-2 bg-blue-50 rounded border text-xs">
                              <div className="font-medium">{element.type}</div>
                              <div className="text-gray-600">{element.text || 'No text'}</div>
                              <div className="text-gray-500">
                                {element.position.x}, {element.position.y}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {latestAnalysis.suggestedActions && latestAnalysis.suggestedActions.length > 0 && (
                      <div>
                        <h5 className="font-semibold mb-2">Suggested Actions:</h5>
                        <ul className="space-y-2">
                          {latestAnalysis.suggestedActions.map((action, index) => (
                            <li key={index} className="p-2 bg-green-50 rounded border text-sm">
                              <div className="font-medium">{action.type}</div>
                              <div className="text-gray-600">{action.description}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis results yet</p>
                    <p className="text-sm">Start screen capture to see AI analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Assistance History */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Assistance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {assistanceHistory.length > 0 ? (
                assistanceHistory.map((entry, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    {entry}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No assistance history yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Alert */}
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to connect to AI support system. Please check your internet connection and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 