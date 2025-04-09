
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package2, Truck, Search, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  
  // Handler to navigate to the material ordering page for a job
  const handleOrderMaterials = () => {
    if (selectedJob) {
      openInTab(
        `/jobs/${selectedJob}/materials`, 
        `Materials for Job ${selectedJob.substring(0, 4)}`,
        `job-${selectedJob}-materials`
      );
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
