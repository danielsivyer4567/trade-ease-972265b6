
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package2, Truck, Search, ClipboardList, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { toast } from "sonner";
import { sendEmail } from "@/utils/emailService";
import { supabase } from "@/integrations/supabase/client";

interface CustomerMaterialsProps {
  customerId: string;
  customerName: string;
  jobHistory: Array<{
    job_id: string;
    title: string;
    job_number: string;
    date: string;
    status: string;
    amount?: number;
  }>;
}

export function CustomerMaterials({ 
  customerId, 
  customerName,
  jobHistory
}: CustomerMaterialsProps) {
  const navigate = useNavigate();
  const { openInTab } = useTabNavigation();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  
  // Fetch current user's email on component mount
  React.useEffect(() => {
    const getUserEmail = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.email) {
        setUserEmail(data.session.user.email);
      }
    };
    getUserEmail();
  }, []);
  
  // Handler to navigate to the material ordering page for a job
  const handleOrderMaterials = () => {
    if (selectedJob) {
      // Find the selected job details to use later
      const jobDetails = jobHistory.find(job => job.job_id === selectedJob);
      
      if (!jobDetails) {
        toast.error("Job details not found");
        return;
      }
      
      // Use a safer approach to prevent infinite navigation loops
      const tabId = `job-${selectedJob}-materials`;
      const path = `/jobs/${selectedJob}/materials`;
      const title = `Materials for Job ${jobDetails.job_number}`;
      
      // Only open a tab if there's actually a selected job
      openInTab(path, title, tabId);
      
      // Send a notification email about material ordering
      if (userEmail) {
        sendEmail({
          to: userEmail,
          subject: `Material Order Initiated - Job #${jobDetails.job_number}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Material Order Started</h2>
              <p>You have initiated a material order for:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Job #:</strong> ${jobDetails.job_number}</p>
                <p><strong>Title:</strong> ${jobDetails.title}</p>
                <p><strong>Customer:</strong> ${customerName}</p>
              </div>
              <p>You can continue and complete your order by clicking the link below:</p>
              <p style="text-align: center;">
                <a href="${window.location.origin}/jobs/${selectedJob}/materials" 
                   style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Complete Order
                </a>
              </p>
              <p>This email serves as a record of your material ordering activity.</p>
            </div>
          `
        }).then(({ success }) => {
          if (success) {
            toast.success("Order notification sent to your email");
          }
        }).catch(() => {
          // Handle silently if email fails
          console.log("Failed to send email notification");
        });
      }
    } else {
      toast.error("Please select a job first");
    }
  };
  
  // Handler to view all orders
  const handleViewAllOrders = () => {
    navigate("/material-ordering");
  };
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Order Materials for {customerName}</h3>
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Select Job</label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobHistory.map(job => (
                      <SelectItem key={job.job_id} value={job.job_id}>
                        {job.job_number} - {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex space-x-2">
                <Button 
                  className="flex items-center gap-2 flex-1"
                  onClick={handleOrderMaterials}
                  disabled={!selectedJob}
                >
                  <Package2 className="h-4 w-4" />
                  Order Materials
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleViewAllOrders}
                >
                  <ClipboardList className="h-4 w-4" />
                  All Orders
                </Button>
              </div>
            </div>
            
            {userEmail && (
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>Order details will be sent to: {userEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Material Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {/* Orders would be mapped here */}
            <p>Orders list...</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 flex justify-center items-center">
              <div className="text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent orders found for this customer.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleOrderMaterials}
                  disabled={!selectedJob}
                >
                  Order Materials
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
