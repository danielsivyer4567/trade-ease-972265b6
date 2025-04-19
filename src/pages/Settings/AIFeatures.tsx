import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Share2, ArrowRight, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AIFeaturesSettings() {
  return (
    <BaseLayout>
      <div className="space-y-6 h-full p-6">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">AI Features</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Assistant Configuration */}
          <Card>
            <CardHeader className="bg-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-gray-600" />
                  <CardTitle>AI Assistant</CardTitle>
                </div>
                <Switch id="ai-assistant" defaultChecked />
              </div>
              <CardDescription>Configure your AI workspace assistant</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="job-suggestions">Job suggestions</Label>
                  <Switch id="job-suggestions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autocomplete">Smart autocomplete</Label>
                  <Switch id="autocomplete" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-control">Voice control</Label>
                  <Switch id="voice-control" />
                </div>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                  Advanced Settings <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Document Analysis */}
          <Card>
            <CardHeader className="bg-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gray-600" />
                  <CardTitle>Document Analysis</CardTitle>
                </div>
                <Switch id="document-analysis" defaultChecked />
              </div>
              <CardDescription>Intelligent document processing and analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="invoice-extraction">Invoice data extraction</Label>
                  <Switch id="invoice-extraction" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="quote-generation">Automatic quote generation</Label>
                  <Switch id="quote-generation" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="contract-review">Contract review assistance</Label>
                  <Switch id="contract-review" />
                </div>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                  Process Documents <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Communication */}
          <Card>
            <CardHeader className="bg-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <CardTitle>Communication Tools</CardTitle>
                </div>
                <Switch id="communication-tools" defaultChecked />
              </div>
              <CardDescription>AI-powered customer communication</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-drafting">Email drafting assistance</Label>
                  <Switch id="email-drafting" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="response-suggestions">Response suggestions</Label>
                  <Switch id="response-suggestions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sentiment-analysis">Sentiment analysis</Label>
                  <Switch id="sentiment-analysis" />
                </div>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                  Communication Settings <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Data Usage and Privacy */}
          <Card>
            <CardHeader className="bg-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-600" />
                <CardTitle>Data Usage & Privacy</CardTitle>
              </div>
              <CardDescription>Control how AI uses your data</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-collection">Allow data collection</Label>
                  <Switch id="data-collection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="model-improvement">Contribute to model improvement</Label>
                  <Switch id="model-improvement" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Allow analytics</Label>
                  <Switch id="analytics" defaultChecked />
                </div>
                <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                  Privacy Settings <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 