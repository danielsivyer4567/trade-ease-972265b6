import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, MessageSquare, Users, Shield, ClipboardList, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { downloadToolboxTalkPDF, previewToolboxTalkPDF } from '@/utils/toolboxTalkPdfGenerator';

export default function ToolboxTalkTemplatePage() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      
      // Generate and download the PDF
      downloadToolboxTalkPDF('Toolbox-Talk-Template.pdf');
      
      toast.success('Toolbox Talk PDF template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewOnline = () => {
    try {
      // Generate and preview the PDF
      previewToolboxTalkPDF();
      toast.info('Opening PDF preview in new tab...');
    } catch (error) {
      console.error('Error previewing template:', error);
      toast.error('Failed to preview template. Please try again.');
    }
  };

  return (
    <AppLayout>
      {/* Top Space with Back Button */}
      <div className="pt-4 pb-2 px-4">
        <div className="container mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/credentials')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-gray-300 text-gray-700 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Credentials
          </Button>
        </div>
      </div>

      {/* Blue Gradient Header with Animated Text and Helmet */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        {/* Animated Background Dots */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-12 right-12 w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-8 left-16 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-16 right-8 w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-6">
              {/* Toolbox Icon */}
              <div className="relative">
                <img
                  src="/lovable-uploads/197e55c93e89b.png"
                  alt="Toolbox Icon"
                  width="140"
                  height="120"
                  className="relative drop-shadow-lg"
                  style={{
                    mixBlendMode: 'multiply',
                    filter: 'brightness(1.2) contrast(1.3)',
                    background: 'transparent'
                  }}
                />
              </div>
              
              {/* Animated Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl font-bold">Toolbox Talk Template</span>
                  <div className="text-green-400 animate-pulse">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <p className="text-xl text-blue-100">Professional Safety Meeting Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legal Requirement Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-blue-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              <strong>Legal Requirement Notice:</strong> Under Australian Work Health and Safety (WHS) legislation, a Safe Work Method Statement (SWMS) is mandatory for high-risk construction work. This document must be prepared before work begins and requires consultation with workers and their representatives.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 max-w-6xl">

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Actions */}
            <Card className="h-fit bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-5 w-5" />
                  Template Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? 'Downloading...' : 'Download Template'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleViewOnline}
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-colors flex items-center gap-2 bg-white/60 backdrop-blur-sm"
                  >
                    <FileText className="h-4 w-4" />
                    View Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <ClipboardList className="h-5 w-5" />
                  About Toolbox Talks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Toolbox talks are short safety meetings held before work begins to discuss potential hazards and safety procedures.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100/80 rounded backdrop-blur-sm">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Team Communication</h4>
                        <p className="text-sm text-gray-600">Engage your team in safety discussions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-purple-100/80 rounded backdrop-blur-sm">
                        <Shield className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Risk Awareness</h4>
                        <p className="text-sm text-gray-600">Identify and discuss potential hazards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100/80 rounded backdrop-blur-sm">
                        <ClipboardList className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Documentation</h4>
                        <p className="text-sm text-gray-600">Keep records of safety meetings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <MessageSquare className="h-5 w-5" />
                How to Use the Toolbox Talk Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50/80 p-4 rounded-lg backdrop-blur-sm border border-blue-200/50">
                  <h4 className="font-medium mb-3 text-blue-700">Before the Meeting:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Download and fill out the PDF template</li>
                    <li>• Identify specific hazards for your project</li>
                    <li>• Prepare relevant safety procedures</li>
                    <li>• Schedule the meeting with your team</li>
                  </ul>
                </div>
                <div className="bg-purple-50/80 p-4 rounded-lg backdrop-blur-sm border border-purple-200/50">
                  <h4 className="font-medium mb-3 text-purple-700">During the Meeting:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Discuss identified hazards and controls</li>
                    <li>• Encourage team participation</li>
                    <li>• Record attendance and signatures</li>
                    <li>• Keep the meeting focused and brief</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </AppLayout>
  );
} 