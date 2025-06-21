import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  MessageSquare,
  Image,
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationResult {
  isValid: boolean;
  models: {
    geminiPro: boolean;
    geminiProVision: boolean;
    geminiFlash: boolean;
  };
  capabilities: {
    textGeneration: boolean;
    imageAnalysis: boolean;
    audioProcessing: boolean;
    streaming: boolean;
  };
  quotas: {
    requestsPerMinute?: number;
    tokensPerMinute?: number;
  };
  error?: string;
}

const GeminiKeyVerification = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Test 1: Basic API key validation with Gemini Pro
      const testTextGeneration = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Hello, this is a test. Reply with 'API key verified successfully.'"
              }]
            }]
          })
        }
      );

      const textResult = await testTextGeneration.json();
      const textGeneration = testTextGeneration.ok && !textResult.error;

      // Test 2: Vision capabilities with Gemini Pro Vision
      const testImageAnalysis = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "What do you see?" },
                {
                  inline_data: {
                    mime_type: "image/png",
                    // Small 1x1 transparent PNG
                    data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  }
                }
              ]
            }]
          })
        }
      );

      const imageResult = await testImageAnalysis.json();
      const imageAnalysis = testImageAnalysis.ok && !imageResult.error;

      // Test 3: Gemini 2.0 Flash
      const testFlash = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Test"
              }]
            }]
          })
        }
      );

      const flashResult = await testFlash.json();
      const flashAvailable = testFlash.ok && !flashResult.error;

      // Test 4: List available models
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      
      const modelsData = await modelsResponse.json();
      const availableModels = modelsData.models || [];

      // Check for streaming support
      const supportsStreaming = availableModels.some((model: any) => 
        model.supportedGenerationMethods?.includes('generateContentStream')
      );

      // Compile results
      const result: VerificationResult = {
        isValid: textGeneration || imageAnalysis,
        models: {
          geminiPro: textGeneration,
          geminiProVision: imageAnalysis,
          geminiFlash: flashAvailable
        },
        capabilities: {
          textGeneration,
          imageAnalysis,
          audioProcessing: flashAvailable, // Flash supports audio
          streaming: supportsStreaming
        },
        quotas: {
          requestsPerMinute: 60, // Default free tier
          tokensPerMinute: 1000000 // Default free tier
        }
      };

      // Handle specific errors
      if (!result.isValid) {
        if (textResult.error?.code === 403) {
          result.error = "API key is invalid or doesn't have proper permissions";
        } else if (textResult.error?.message?.includes('API_KEY_INVALID')) {
          result.error = "Invalid API key format";
        } else if (textResult.error?.message?.includes('PERMISSION_DENIED')) {
          result.error = "API key doesn't have access to Gemini API";
        } else {
          result.error = textResult.error?.message || "Unknown error occurred";
        }
      }

      setVerificationResult(result);

      if (result.isValid) {
        toast({
          title: "API Key Verified!",
          description: "Your Gemini API key is valid and working",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "API key is not valid",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        models: {
          geminiPro: false,
          geminiProVision: false,
          geminiFlash: false
        },
        capabilities: {
          textGeneration: false,
          imageAnalysis: false,
          audioProcessing: false,
          streaming: false
        },
        quotas: {},
        error: error instanceof Error ? error.message : "Failed to verify API key"
      });

      toast({
        title: "Verification Error",
        description: "Failed to connect to Gemini API",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Gemini API Key Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            Test your Gemini API key and check available models and capabilities
          </p>
        </div>

        {/* API Key Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Enter API Key
            </CardTitle>
            <CardDescription>
              Enter your Gemini API key to verify its validity and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">Gemini API Key</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={copyApiKey}
                        disabled={!apiKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={verifyApiKey}
                    disabled={isVerifying || !apiKey.trim()}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {apiKey && !apiKey.startsWith('AIzaSy') && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Gemini API keys typically start with "AIzaSy". Make sure you've copied the correct key.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification Results */}
        {verificationResult && (
          <>
            {/* Overall Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      API Key Valid
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      API Key Invalid
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {verificationResult.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{verificationResult.error}</AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your API key has been successfully verified and can access Gemini services.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Models Available */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Available Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Gemini Pro</p>
                      <p className="text-sm text-muted-foreground">Text generation and chat</p>
                    </div>
                    <StatusIcon status={verificationResult.models.geminiPro} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Gemini Pro Vision</p>
                      <p className="text-sm text-muted-foreground">Image analysis and understanding</p>
                    </div>
                    <StatusIcon status={verificationResult.models.geminiProVision} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Gemini 2.0 Flash (Experimental)</p>
                      <p className="text-sm text-muted-foreground">Multimodal with audio support</p>
                    </div>
                    <StatusIcon status={verificationResult.models.geminiFlash} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${verificationResult.capabilities.textGeneration ? 'bg-green-100' : 'bg-red-100'}`}>
                      <MessageSquare className={`h-5 w-5 ${verificationResult.capabilities.textGeneration ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Text Generation</p>
                      <p className="text-xs text-muted-foreground">Chat and content creation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${verificationResult.capabilities.imageAnalysis ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Image className={`h-5 w-5 ${verificationResult.capabilities.imageAnalysis ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Image Analysis</p>
                      <p className="text-xs text-muted-foreground">Screen capture understanding</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${verificationResult.capabilities.audioProcessing ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Mic className={`h-5 w-5 ${verificationResult.capabilities.audioProcessing ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Audio Processing</p>
                      <p className="text-xs text-muted-foreground">Voice conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${verificationResult.capabilities.streaming ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Zap className={`h-5 w-5 ${verificationResult.capabilities.streaming ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Streaming</p>
                      <p className="text-xs text-muted-foreground">Real-time responses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quotas */}
            {verificationResult.isValid && (
              <Card>
                <CardHeader>
                  <CardTitle>API Quotas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Requests per minute</span>
                      <Badge variant="secondary">{verificationResult.quotas.requestsPerMinute || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tokens per minute</span>
                      <Badge variant="secondary">{verificationResult.quotas.tokensPerMinute?.toLocaleString() || 'N/A'}</Badge>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <AlertDescription className="text-xs">
                      These are typical free tier limits. Your actual quotas may vary based on your Google Cloud project settings.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default GeminiKeyVerification; 