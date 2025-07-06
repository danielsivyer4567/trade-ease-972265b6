import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { TicketWallet } from './components/TicketWallet';
import { JobList } from './components/JobList.tsx';
import { StaffList } from './components/StaffList';
import { SafetyDocumentsManager } from './components/SafetyDocumentsManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CredentialsPage() {
  const navigate = useNavigate();

  const handleOpenSWMSCreator = () => {
    navigate('/calculators/ai-swms-creator');
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

          {/* Right Column - SWMS Creator */}
          <div className="xl:col-span-1">
            <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 shadow-lg sticky top-4">
              <CardContent className="p-6">
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
                  AI-powered Safe Work Method Statement generator for construction projects and risk assessments
                </p>
                
                <Button 
                  onClick={handleOpenSWMSCreator}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
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