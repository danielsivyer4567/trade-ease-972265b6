import React, { useState, useRef } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSearch, Clipboard, Calendar, CheckSquare, Camera, Upload, User, ChevronLeft, ChevronRight, Users, ArrowRight } from 'lucide-react';
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
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <SectionHeader
          title="Site Audits"
          description="Manage site inspections and upload photos directly to customer profiles"
          icon={<FileSearch className="h-6 w-6" />}
        />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Quick Photo Upload</h3>
              <p className="text-sm text-muted-foreground">Select a customer and upload inspection photos on the go</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <CustomerSelector 
                customers={customers} 
                selectedCustomerId={selectedCustomerId} 
                onSelectCustomer={handleCustomerSelect} 
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleTakePhoto} 
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!selectedCustomerId}
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Photo</span>
                </Button>
                <Button 
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!selectedCustomerId}
                >
                  <Upload className="h-4 w-4" />
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
        </div>
        
        {showPhotoCapture && selectedCustomerId && (
          <AuditPhotoCapture 
            customerId={selectedCustomerId}
            onClose={() => setShowPhotoCapture(false)}
            onPhotoCapture={(blob) => {
              const file = new File([blob], `audit_photo_${Date.now()}.jpg`, {
                type: 'image/jpeg'
              });
              handleFileUpload(new DataTransfer().files);
              setShowPhotoCapture(false);
            }}
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
    </BaseLayout>
  );
}
