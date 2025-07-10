import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ExternalLink,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const N8nAssistantPageWorking = () => {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [geminiApiKey, setGeminiApiKey] = useState(envApiKey);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(!!envApiKey);
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

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Live Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get real-time, voice-enabled AI help with your application.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configure Gemini API Key
            </CardTitle>
            <CardDescription>
              To use the AI assistant, you need a Google Gemini API key.
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Screen Share Assistant
            </CardTitle>
            <CardDescription>
              The AI assistant is ready to help with your screen sharing needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The GeminiLiveAssistant component requires the @google/generative-ai package to be installed.
                Please install it with: <code className="bg-gray-100 px-2 py-1 rounded">npm install @google/generative-ai</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default N8nAssistantPageWorking;