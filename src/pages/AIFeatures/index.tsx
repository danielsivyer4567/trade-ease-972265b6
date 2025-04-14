
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Zap, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AIFeatures() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState("");
  const { toast } = useToast();
  
  const handleOpenAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-openai', {
        body: { 
          prompt,
          model: 'gpt-4o-mini'  // Explicitly specify the model
        }
      });

      if (error) throw error;

      setResponse(data.generatedText);
      toast({
        title: "Generation Complete",
        description: "Your content has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeminiGenerate = async () => {
    setIsGenerating(true);
    try {
      toast({
        title: "Processing with Gemini",
        description: "Your request is being processed...",
      });
      // Gemini integration will be added here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">AI Features</h1>
        </div>
        
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Gemini
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai">
            <Card>
              <CardHeader>
                <CardTitle>OpenAI Integration</CardTitle>
                <CardDescription>
                  Leverage OpenAI's powerful language models for your tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleOpenAIGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full"
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Generate with OpenAI
                    </span>
                  )}
                </Button>
                {response && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{response}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gemini">
            <Card>
              <CardHeader>
                <CardTitle>Gemini 2.0 Flash</CardTitle>
                <CardDescription>
                  Experience advanced AI capabilities with Gemini's latest models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Flash Thinking
                      </CardTitle>
                      <CardDescription>
                        Advanced reasoning and analysis capabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Enter your prompt for Flash Thinking..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={handleGeminiGenerate}
                        disabled={isGenerating || !prompt}
                        className="w-full mt-4"
                      >
                        {isGenerating ? (
                          "Processing..."
                        ) : (
                          <span className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Generate with Flash Thinking
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
