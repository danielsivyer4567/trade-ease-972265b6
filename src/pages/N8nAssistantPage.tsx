import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Settings, 
  Key, 
  Monitor,
  MessageSquare,
  Zap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { N8nAssistant } from '@/components/n8n-assistant/N8nAssistant';
import { useToast } from '@/hooks/use-toast';

const N8nAssistantPage = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (geminiApiKey.trim()) {
      setApiKeyConfigured(true);
      toast({
        title: "API Key Saved",
        description: "Gemini API key has been configured successfully",
      });
    }
  };

  const features = [
    {
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your n8n interface for real-time assistance"
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Gemini AI analyzes your workflows and detects issues"
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Ask questions and get instant help with n8n"
    },
    {
      icon: Zap,
      title: "Auto Error Detection",
      description: "Automatically detects and helps fix errors"
    }
  ];

  const useCases = [
    {
      title: "Workflow Debugging",
      description: "Get help fixing errors in your n8n workflows",
      icon: AlertCircle
    },
    {
      title: "Learning n8n",
      description: "Learn best practices and n8n concepts interactively",
      icon: BookOpen
    },
    {
      title: "Setup Assistance",
      description: "Get guided help setting up nodes and credentials",
      icon: Settings
    },
    {
      title: "Optimization Tips",
      description: "Receive suggestions to improve your workflows",
      icon: CheckCircle
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            n8n AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get real-time AI-powered help with your n8n workflows using screen sharing and Gemini AI
          </p>
        </div>

        {!apiKeyConfigured ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Configure Gemini API Key
              </CardTitle>
              <CardDescription>
                To use the AI assistant, you need a Google Gemini API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">Gemini API Key</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your Gemini API key"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                    <Button onClick={handleSaveApiKey}>
                      Save Key
                    </Button>
                  </div>
                </div>
                <Alert>
                  <AlertDescription>
                    <p className="mb-2">To get a Gemini API key:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio <ExternalLink className="h-3 w-3 inline" /></a></li>
                      <li>Click "Get API Key"</li>
                      <li>Create a new API key or use an existing one</li>
                      <li>Copy and paste it above</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Assistant */}
            <div>
              <N8nAssistant 
                geminiApiKey={geminiApiKey}
                onSuggestion={(suggestion) => {
                  console.log('Suggestion:', suggestion);
                }}
              />
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Helps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {useCases.map((useCase, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <useCase.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{useCase.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {useCase.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Share your entire n8n window for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Enable auto-detect to catch errors as they happen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Ask specific questions about nodes or errors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Use the guides tab for common workflows</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* API Key Management */}
        {apiKeyConfigured && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setApiKeyConfigured(false);
                setGeminiApiKey('');
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change API Key
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default N8nAssistantPage; 