import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Eye, 
  Hand, 
  Settings, 
  Zap,
  Shield,
  Activity,
  MessageSquare,
  HelpCircle,
  Info,
  Lightbulb,
  Users,
  Clock,
  Play
} from 'lucide-react';
import { AISupportSystem } from '@/components/ai-support/AISupportSystem';

const AISupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Screen Capture & Analysis",
      description: "Advanced screen capture with real-time AI analysis using Google Cloud Vertex AI and Gemini",
      color: "text-blue-600"
    },
    {
      icon: <Hand className="h-6 w-6" />,
      title: "Visual Overlay System",
      description: "Interactive overlays, highlights, and cursor guidance for step-by-step assistance",
      color: "text-green-600"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Intelligent UI element detection and actionable suggestions for user guidance",
      color: "text-purple-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Processing",
      description: "Instant analysis and response with streaming capabilities for live assistance",
      color: "text-orange-600"
    }
  ];

  const benefits = [
    "Reduce support ticket resolution time by 60%",
    "Provide visual guidance for complex workflows",
    "Enable remote assistance without screen sharing software",
    "Improve user onboarding and training effectiveness",
    "Scale support operations with AI automation"
  ];

  const useCases = [
    {
      title: "User Onboarding",
      description: "Guide new users through TradeEase features with visual overlays and step-by-step instructions",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Technical Support",
      description: "Provide remote assistance for troubleshooting and problem resolution",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      title: "Workflow Training",
      description: "Train users on complex business processes with interactive guidance",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: "Feature Adoption",
      description: "Help users discover and utilize advanced features effectively",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Advanced AI Support System</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Revolutionary remote assistance powered by Google Cloud Vertex AI and Gemini. 
          Get real-time screen analysis, visual guidance, and intelligent support.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Activity className="h-4 w-4 mr-1" />
            Powered by Vertex AI
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Zap className="h-4 w-4 mr-1" />
            Real-time Analysis
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            <Shield className="h-4 w-4 mr-1" />
            Secure & Private
          </Badge>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Support System
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Features & Benefits
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <AISupportSystem
            userId="demo_user"
            autoStart={false}
            enableVoiceCommands={true}
            enableRealTimeAnalysis={true}
          />
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {useCase.icon}
                      <h4 className="font-semibold">{useCase.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Interactive Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Experience the AI Support System in action. Start a demo session to see how the system 
                analyzes your screen and provides intelligent assistance.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowDemo(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
                </Button>
                <Button variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>

              {showDemo && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2 text-blue-800">Demo Mode Active</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    The AI Support System is now running in demo mode. Try navigating around the TradeEase 
                    application to see real-time analysis and overlay guidance.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Clock className="h-3 w-3" />
                    Demo session will automatically end after 10 minutes
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Start Screen Capture</h4>
                    <p className="text-sm text-muted-foreground">Click "Start Capture" to begin sharing your screen</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Navigate TradeEase</h4>
                    <p className="text-sm text-muted-foreground">Use the TradeEase application normally - the AI will analyze your actions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">View AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">Check the "AI Analysis" tab to see real-time insights and suggestions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Experience Overlays</h4>
                    <p className="text-sm text-muted-foreground">Watch as the system provides visual guidance with highlights and cursors</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> All screen data is processed securely through Google Cloud Vertex AI. 
          No data is stored permanently and all sessions are encrypted. The system only analyzes what you share 
          and provides assistance based on the current screen content.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AISupportPage; 