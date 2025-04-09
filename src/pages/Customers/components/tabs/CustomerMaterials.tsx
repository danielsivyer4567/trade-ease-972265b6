
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package2, Truck, Search, ClipboardList, Mail, Paperclip, Send, X, Minimize, Maximize, Users } from "lucide-react";
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

// Define common suppliers
const commonSuppliers = [
  { name: "ABC Building Supplies", email: "orders@abcbuilding.com" },
  { name: "Smith's Timber & Hardware", email: "orders@smithstimber.com" },
  { name: "Metro Electrical Wholesale", email: "orders@metroelectrical.com" },
  { name: "Coastal Plumbing Supplies", email: "orders@coastalplumbing.com" },
  { name: "BuildWell Construction Materials", email: "sales@buildwell.com" },
  { name: "Premier Roofing Supplies", email: "orders@premierroofing.com" },
];

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
  const [messageBody, setMessageBody] = useState<string>("");
  const [supplierEmail, setSupplierEmail] = useState<string>("");
  const [ccEmail, setCcEmail] = useState<string>("");
  const [bccEmail, setBccEmail] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  
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
  
  // Function to generate default message body when job is selected
  React.useEffect(() => {
    if (selectedJob) {
      const jobDetails = jobHistory.find(job => job.job_id === selectedJob);
      if (jobDetails) {
        setMessageBody(`Please supply the following materials for job #${jobDetails.job_number} - ${jobDetails.title}:

1. 
2. 
3. 

Delivery address: ${customerName}

Requested delivery date: 

Thank you,
`);
      }
    }
  }, [selectedJob, jobHistory, customerName]);
  
  // Handler for selecting a supplier from the dropdown
  const handleSupplierSelect = (supplierEmail: string) => {
    const supplier = commonSuppliers.find(s => s.email === supplierEmail);
    if (supplier) {
      setSupplierEmail(supplier.email);
    }
  };
  
  // Handler to send materials email
  const handleSendOrder = () => {
    if (!selectedJob) {
      toast.error("Please select a job first");
      return;
    }
    
    const jobDetails = jobHistory.find(job => job.job_id === selectedJob);
    
    if (!jobDetails) {
      toast.error("Job details not found");
      return;
    }
    
    // Send the actual email
    sendEmail({
      to: supplierEmail,
      subject: `Material Order - Job #${jobDetails.job_number} - ${jobDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Material Order Request</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Job #:</strong> ${jobDetails.job_number}</p>
            <p><strong>Title:</strong> ${jobDetails.title}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
          </div>
          <div style="white-space: pre-wrap;">${messageBody}</div>
        </div>
      `
    }).then(({ success }) => {
      if (success) {
        toast.success("Material order sent successfully");
        
        // Send a confirmation to the user as well
        if (userEmail) {
          sendEmail({
            to: userEmail,
            subject: `Material Order Sent - Job #${jobDetails.job_number}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Material Order Sent</h2>
                <p>You have successfully sent a material order for:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p><strong>Job #:</strong> ${jobDetails.job_number}</p>
                  <p><strong>Title:</strong> ${jobDetails.title}</p>
                  <p><strong>Customer:</strong> ${customerName}</p>
                  <p><strong>Supplier:</strong> ${supplierEmail}</p>
                </div>
                <p>Order details:</p>
                <div style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${messageBody}</div>
              </div>
            `
          });
        }
      } else {
        toast.error("Failed to send material order");
      }
    }).catch((error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send material order");
    });
  };
  
  // Handler to view all orders
  const handleViewAllOrders = () => {
    navigate("/material-ordering");
  };
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Order Materials for {customerName}</h3>
        <Card className={`bg-slate-50 ${isMinimized ? 'h-16 overflow-hidden' : ''}`}>
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">New Message</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center border-b py-2">
                  <span className="w-16 text-sm text-gray-500">To</span>
                  <div className="flex-1 flex items-center gap-2">
                    <Input 
                      value={supplierEmail} 
                      onChange={e => setSupplierEmail(e.target.value)} 
                      className="border-none shadow-none focus-visible:ring-0" 
                      placeholder="Supplier email"
                    />
                    <div className="min-w-[180px]">
                      <Select onValueChange={handleSupplierSelect}>
                        <SelectTrigger className="h-8 border-dashed border-slate-300">
                          <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span className="text-xs">Select supplier</span>
                        </SelectTrigger>
                        <SelectContent>
                          {commonSuppliers.map((supplier) => (
                            <SelectItem key={supplier.email} value={supplier.email}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center border-b py-2">
                  <span className="w-16 text-sm text-gray-500">Cc</span>
                  <Input 
                    value={ccEmail} 
                    onChange={e => setCcEmail(e.target.value)} 
                    className="border-none shadow-none focus-visible:ring-0" 
                    placeholder="Cc email addresses"
                  />
                </div>
                
                <div className="flex items-center border-b py-2">
                  <span className="w-16 text-sm text-gray-500">Subject</span>
                  <div className="flex-1">
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                      <SelectTrigger className="border-none shadow-none focus:ring-0">
                        <SelectValue placeholder="Select a job for material order" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobHistory.map(job => (
                          <SelectItem key={job.job_id} value={job.job_id}>
                            Job #{job.job_number} - {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Textarea 
                  value={messageBody} 
                  onChange={e => setMessageBody(e.target.value)} 
                  placeholder="Type your material order details here..."
                  className="min-h-[200px] border-none shadow-none focus-visible:ring-0"
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Paperclip className="h-4 w-4 mr-1" />
                      Attach
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewAllOrders}
                    >
                      <ClipboardList className="h-4 w-4 mr-1" />
                      All Orders
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSendOrder}
                      disabled={!selectedJob || !messageBody.trim() || !supplierEmail.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send Order
                    </Button>
                  </div>
                </div>
                
                {userEmail && (
                  <div className="mt-4 text-xs text-gray-500 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>Order confirmation will be sent to: {userEmail}</span>
                  </div>
                )}
              </div>
            </CardContent>
          )}
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
                  onClick={() => setIsMinimized(false)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Create Material Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
