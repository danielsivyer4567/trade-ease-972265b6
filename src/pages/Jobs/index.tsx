import React, { useState, useRef } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSearch, Clipboard, Calendar, CheckSquare, Camera, Upload, User, ChevronLeft, ChevronRight, Users, ArrowRight, Zap, Target, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Mock customers data
const mockCustomers = [
  { id: '1', name: 'John Smith', email: 'john@example.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com' },
];

// Mock audits data
const mockAudits = [
  {
    id: '1',
    title: 'Commercial Building Inspection',
    location: '123 Main St',
    status: 'in_progress' as const,
    startDate: '2024-07-10',
    completedItems: 8,
    totalItems: 15,
    assignedTo: 'John Smith'
  },
  {
    id: '2',
    title: 'Residential Safety Audit',
    location: '456 Oak Ave',
    status: 'in_progress' as const,
    startDate: '2024-07-12',
    completedItems: 5,
    totalItems: 12,
    assignedTo: 'Sarah Johnson'
  }
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
      // Mock upload logic
      toast({
        title: "Upload Successful",
        description: "Photo has been added to the customer's audit",
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

  const handleViewCustomers = (auditId: string) => {
    navigate(`/customers/${auditId}`);
  };

  const createNewAudit = (customerId: string) => {
    toast({
      title: "New Audit Created",
      description: "Site audit has been created successfully",
    });
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Modern Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="relative px-6 py-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <FileSearch className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Site Audits Dashboard
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Comprehensive site inspections with real-time photo capture and intelligent categorization
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
          {/* Audit Categories Grid */}
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
                  <select 
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    value={selectedCustomerId || ''}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                  >
                    <option value="">Select a customer...</option>
                    {mockCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
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
          {/* Modern Tabs */}
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-2 rounded-2xl">
                <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300">
                  <Activity className="h-4 w-4 mr-2" />
                  Active Audits
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Scheduled
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>
          
            <TabsContent value="active" className="pt-6">
              {mockAudits.filter(a => a.status === 'in_progress').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAudits.filter(a => a.status === 'in_progress').map((audit, index) => {
                    const gradients = [
                      'from-blue-500 to-purple-600',
                      'from-green-500 to-teal-600',
                      'from-orange-500 to-red-600',
                      'from-purple-500 to-pink-600'
                    ];
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                      <Card key={audit.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-700 transition-colors">{audit.title}</h3>
                              <p className="text-gray-600 mt-1">{audit.location}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-medium shadow-lg`}>
                              In Progress
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Started: {new Date(audit.startDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{audit.completedItems}/{audit.totalItems} completed</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                                  style={{ width: `${(audit.completedItems / audit.totalItems) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{audit.assignedTo}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className={`bg-gradient-to-r ${gradient} hover:shadow-lg text-white border-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0">
                  <CardContent className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FileSearch className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No active audits</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Start a new site audit to begin capturing data and tracking progress</p>
                    <Button 
                      onClick={() => {
                        if (!selectedCustomerId) {
                          toast({
                            title: "Select Customer",
                            description: "Please select a customer first",
                            variant: "destructive"
                          });
                          return;
                        }
                        createNewAudit(selectedCustomerId);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Create New Audit
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="scheduled" className="pt-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No scheduled audits</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Schedule a new site audit to plan ahead and organize your inspection workflow</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="pt-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No completed audits</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Complete an audit to see detailed reports and analytics here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates" className="pt-6">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Clipboard className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No audit templates</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Create reusable templates to streamline your audit process and ensure consistency</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Audits Section */}
          <div className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Site Audits</h2>
                <p className="text-gray-600">Latest inspection activities and progress updates</p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {siteAudits.map((audit, index) => {
                const statusColors = {
                  'completed': 'from-green-500 to-emerald-600',
                  'in-progress': 'from-blue-500 to-purple-600',
                  'pending': 'from-yellow-500 to-orange-600'
                };
                const statusColor = statusColors[audit.status || 'pending'];
                
                return (
                  <Card key={audit.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${statusColor}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{audit.name}</CardTitle>
                          <div className="mt-3 space-y-2">
                            {audit.date && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(audit.date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {audit.status && (
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statusColor} text-white text-xs font-medium shadow-lg`}>
                            {audit.status.charAt(0).toUpperCase() + audit.status.slice(1).replace('-', ' ')}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleViewCustomers(audit.id)}
                        className={`w-full bg-gradient-to-r ${statusColor} hover:shadow-lg text-white border-0 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 group-hover:scale-105`}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Customers
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}