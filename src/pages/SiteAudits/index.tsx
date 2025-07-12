import React, { useState, useRef } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSearch, Clipboard, Calendar, CheckSquare, Camera, Upload, User, ChevronLeft, ChevronRight, Users, ArrowRight, Zap, Target, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuditPhotoCapture } from './components/AuditPhotoCapture';
import { CustomerSelector } from './components/CustomerSelector';
import { DailyAuditList } from './components/DailyAuditList';
import { useAuditData } from './hooks/useAuditData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Interface for SiteAudit
interface SiteAudit {
  id: string;
  name: string;
  date?: string;
  status?: 'completed' | 'pending' | 'in-progress';
}

// Mock data - replace with actual data fetching
const siteAudits: SiteAudit[] = [
  { 
    id: 'audit-1', 
    name: 'Audit for Property A',
    date: '2024-04-17',
    status: 'completed'
  },
  { 
    id: 'audit-2', 
    name: 'Inspection at Site B',
    date: '2024-04-18',
    status: 'in-progress'
  },
];

export default function SiteAudits() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Enhanced mock data with color themes
  const auditCategories = [
    { id: 'safety', name: 'Safety Audits', color: 'from-red-500 to-red-700', count: 12, icon: Target },
    { id: 'quality', name: 'Quality Control', color: 'from-blue-500 to-blue-700', count: 8, icon: CheckSquare },
    { id: 'compliance', name: 'Compliance Check', color: 'from-green-500 to-green-700', count: 15, icon: FileSearch },
    { id: 'performance', name: 'Performance Review', color: 'from-purple-500 to-purple-700', count: 6, icon: TrendingUp }
  ];
  
  const { 
    audits, 
    customers, 
    isLoading, 
    uploadAuditPhoto, 
    createNewAudit,
    auditsByDay,
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek
  } = useAuditData();

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    toast({
      title: "Customer Selected",
      description: `Ready to capture photos for this customer's audit`,
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!selectedCustomerId || !files || files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a customer before uploading photos",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      uploadAuditPhoto(selectedCustomerId, file)
        .then(() => {
          toast({
            title: "Upload Successful",
            description: "Photo has been added to the customer's audit",
          });
        })
        .catch((error) => {
          toast({
            title: "Upload Failed",
            description: error.message || "Failed to upload photo",
            variant: "destructive"
          });
        });
    });
  };

  const triggerFileUpload = () => {
    if (!selectedCustomerId) {
      toast({
        title: "Select Customer",
        description: "Please select a customer first before uploading photos",
        variant: "destructive"
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    if (!selectedCustomerId) {
      toast({
        title: "Select Customer",
        description: "Please select a customer first before taking photos",
        variant: "destructive"
      });
      return;
    }
    setShowPhotoCapture(true);
  };

  // Ensure audits array is defined
  const auditsList = audits || [];
  // Ensure auditsByDay array is defined
  const auditsByDayList = auditsByDay || [];

  const handleViewCustomers = (auditId: string) => {
    navigate(`/customers/${auditId}`);
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Modern Gradient Header - Reduced by 50% */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="relative px-6 py-2">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Site Audits Dashboard
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Comprehensive site inspections with real-time photo capture and intelligent categorization
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
          {/* Audit Categories Grid - Reduced by 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {auditCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
                  <CardContent className="p-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{category.count}</span>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Enhanced Quick Upload Section */}
          <Card className="mb-8 bg-gradient-to-r from-white to-blue-50/50 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Quick Photo Upload</h3>
                      <p className="text-gray-600">Instant capture and categorization for on-site inspections</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                  <CustomerSelector 
                    customers={customers} 
                    selectedCustomerId={selectedCustomerId} 
                    onSelectCustomer={handleCustomerSelect} 
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleTakePhoto} 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                      disabled={!selectedCustomerId}
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      <span>Capture</span>
                    </Button>
                    <Button 
                      onClick={triggerFileUpload}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                      disabled={!selectedCustomerId}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      <span>Upload</span>
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      multiple 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e.target.files)} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        
        {showPhotoCapture && selectedCustomerId && (
          <AuditPhotoCapture 
            customerId={selectedCustomerId}
            onClose={() => setShowPhotoCapture(false)}
          />
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Weekly Audit Schedule</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousWeek}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Week</span>
              </Button>
              <span className="text-sm font-medium">
                Week of {format(currentWeekStart || new Date(), 'MMM d, yyyy')}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextWeek}
                className="flex items-center gap-1"
              >
                <span>Next Week</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading audits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {auditsByDayList.map((dayData, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <DailyAuditList 
                    dayData={dayData} 
                    onAddPhoto={handleTakePhoto}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 max-w-lg">
            <TabsTrigger value="active">Active Audits</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Loading audits...</p>
              </div>
            ) : auditsList.filter(a => a.status === 'in_progress').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {auditsList.filter(a => a.status === 'in_progress').map((audit) => (
                  <Card key={audit.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{audit.title}</h3>
                          <p className="text-sm text-muted-foreground">{audit.location}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          In Progress
                        </span>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {new Date(audit.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-4 w-4" />
                          <span>{audit.completedItems}/{audit.totalItems} completed</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-2 border-t flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-4 w-4" />
                          <span>{audit.assignedTo}</span>
                        </div>
                        <Button size="sm" variant="link" className="text-primary hover:underline">
                          View details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No active audits</h3>
                <p className="mb-4">Start a new site audit to begin capturing data</p>
                <Button onClick={() => {
                  if (!selectedCustomerId) {
                    toast({
                      title: "Select Customer",
                      description: "Please select a customer first",
                      variant: "destructive"
                    });
                    return;
                  }
                  createNewAudit(selectedCustomerId);
                }}>
                  Create New Audit
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No scheduled audits</h3>
              <p>Schedule a new site audit to get started</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No completed audits</h3>
              <p>Complete an audit to see it here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <Clipboard className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No audit templates</h3>
              <p>Create a template to streamline your audit process</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Site Audits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {siteAudits.map((audit) => (
              <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{audit.name}</CardTitle>
                  <div className="text-sm text-gray-500">
                    {audit.date && <p>Date: {new Date(audit.date).toLocaleDateString()}</p>}
                    {audit.status && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        audit.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCustomers(audit.id)}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      View Customers
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </div>
    </BaseLayout>
  );
}
