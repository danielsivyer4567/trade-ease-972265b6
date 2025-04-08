
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box, Upload, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailIntegrationSetup } from "@/components/materials/EmailIntegrationSetup";
import { MaterialOrderForm } from "@/components/materials/MaterialOrderForm";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobMaterialOrdering() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("order");

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        
        const { data: job, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
          
        if (error) throw error;
        
        setJobDetails(job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
            <div className="h-32 bg-slate-200 rounded mb-4"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!jobDetails) {
    return (
      <AppLayout>
        <div className="container p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Job not found</h1>
            <Button onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Box className="mr-2 h-6 w-6 text-primary" />
                Job Materials
              </h1>
              <p className="text-muted-foreground">
                {jobDetails.job_number} - {jobDetails.title}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order">Order Materials</TabsTrigger>
            <TabsTrigger value="email">Email Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="order" className="space-y-4">
            <MaterialOrderForm 
              jobId={jobId || ""} 
              jobNumber={jobDetails.job_number || "Unknown"} 
              jobAddress={jobDetails.customer || "Unknown Address"} 
            />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Capture Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center">
                    <Inbox className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="font-medium mb-1">Upload Invoice</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop or click to upload a supplier invoice
                    </p>
                    <Button variant="outline">Select File</Button>
                    <p className="text-xs text-gray-400 mt-4">
                      Supported formats: PDF, JPG, PNG
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <EmailIntegrationSetup />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
