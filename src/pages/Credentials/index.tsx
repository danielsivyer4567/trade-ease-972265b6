import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { TicketWallet } from './components/TicketWallet';
import { JobList } from './components/JobList.tsx';
import { StaffList } from './components/StaffList';
import { SafetyDocumentsManager } from './components/SafetyDocumentsManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ExternalLink, ArrowLeft, MessageSquare, Shield, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CredentialsPage() {
  const navigate = useNavigate();

  const handleOpenSWMSCreator = () => {
    navigate('/calculators/ai-swms-creator');
  };

  const handleOpenToolboxTalk = () => {
    // Navigate to toolbox talk template (placeholder)
    navigate('/toolbox-talk-template');
  };

  const handleOpenWHSSLAM = () => {
    // Navigate to WHS SLAM (placeholder)
    navigate('/whs-slam');
  };

  const handleOpenWHSJSEA = () => {
    // Navigate to WHS JSEA (placeholder)
    navigate('/whs-jsea');
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Credentials & Compliance</h1>

        {/* Two-column layout: Main content on left, SWMS Creator on right */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Tickets Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Ticket Wallet</h2>
              <TicketWallet />
            </section>

            {/* Safety Document Management Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Safety Management</h2>
              <p className="text-gray-600 mb-4">
                Manage site-specific documents like SWMS and JSAs. Drag documents onto Jobs or Staff to assign them.
              </p>
              
              {/* Status Legend */}
              <div className="flex items-center space-x-4 mb-4 p-2 bg-slate-100 rounded border border-slate-200 text-sm text-slate-600">
                <span className="font-medium">Status Legend:</span>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Incomplete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span>Pending</span>
                </div>
              </div>

              {/* Grid layout for Jobs, Staff, and Documents */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <JobList />
                </div>
                <div className="lg:col-span-1">
                  <StaffList />
                </div>
                <div className="lg:col-span-1">
                  <SafetyDocumentsManager />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column - WHS Tools */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* SWMS Creator */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100 border-blue-200 shadow-lg">
              {/* Animated Background Dots */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute w-3 h-3 bg-white/80 rounded-full animate-pulse top-4 left-6 shadow-sm"></div>
                <div className="absolute w-2 h-2 bg-yellow-200/90 rounded-full animate-pulse top-8 right-8 shadow-sm" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute w-4 h-4 bg-white/70 rounded-full animate-pulse bottom-12 left-4 shadow-sm" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-pink-200/90 rounded-full animate-pulse top-12 right-12 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute w-3 h-3 bg-cyan-200/80 rounded-full animate-pulse bottom-6 right-4 shadow-sm" style={{animationDelay: '2s'}}></div>
              </div>
              
              <CardContent className="relative z-30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">AI SWMS Creator</h3>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  (standard mandatory risk control measures each worker must abide by)
                </p>
                
                <Button 
                  onClick={handleOpenSWMSCreator}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            {/* Toolbox Talk Template */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-100 border-green-200 shadow-lg">
              {/* Animated Background Dots */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute w-3 h-3 bg-white/80 rounded-full animate-pulse top-4 left-6 shadow-sm"></div>
                <div className="absolute w-2 h-2 bg-green-200/90 rounded-full animate-pulse top-8 right-8 shadow-sm" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute w-4 h-4 bg-white/70 rounded-full animate-pulse bottom-12 left-4 shadow-sm" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-teal-200/90 rounded-full animate-pulse top-12 right-12 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute w-3 h-3 bg-green-300/80 rounded-full animate-pulse bottom-6 right-4 shadow-sm" style={{animationDelay: '2s'}}></div>
              </div>
              
              <CardContent className="relative z-30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Toolbox Talk Template</h3>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Generate professional toolbox talk templates for team safety meetings and hazard discussions
                </p>
                
                <Button 
                  onClick={handleOpenToolboxTalk}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            {/* WHS SLAM */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-lg">
              {/* Animated Background Dots */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute w-3 h-3 bg-white/80 rounded-full animate-pulse top-4 left-6 shadow-sm"></div>
                <div className="absolute w-2 h-2 bg-red-200/90 rounded-full animate-pulse top-8 right-8 shadow-sm" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute w-4 h-4 bg-white/70 rounded-full animate-pulse bottom-12 left-4 shadow-sm" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-pink-200/90 rounded-full animate-pulse top-12 right-12 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute w-3 h-3 bg-red-300/80 rounded-full animate-pulse bottom-6 right-4 shadow-sm" style={{animationDelay: '2s'}}></div>
              </div>
              
              <CardContent className="relative z-30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">WHS SLAM</h3>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Stop, Look, Assess & Manage (required before every activity / task)
                </p>
                
                <Button 
                  onClick={handleOpenWHSSLAM}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>

            {/* WHS JSEA */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200 shadow-lg">
              {/* Animated Background Dots */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute w-3 h-3 bg-white/80 rounded-full animate-pulse top-4 left-6 shadow-sm"></div>
                <div className="absolute w-2 h-2 bg-orange-200/90 rounded-full animate-pulse top-8 right-8 shadow-sm" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute w-4 h-4 bg-white/70 rounded-full animate-pulse bottom-12 left-4 shadow-sm" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-2 h-2 bg-yellow-200/90 rounded-full animate-pulse top-12 right-12 shadow-sm" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute w-3 h-3 bg-orange-300/80 rounded-full animate-pulse bottom-6 right-4 shadow-sm" style={{animationDelay: '2s'}}></div>
              </div>
              
              <CardContent className="relative z-30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">WHS JSEA</h3>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Job Safety and Environmental Analysis tool for comprehensive workplace risk assessment and control
                </p>
                
                <Button 
                  onClick={handleOpenWHSJSEA}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </AppLayout>
  );
} 