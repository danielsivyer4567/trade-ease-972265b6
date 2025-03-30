
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { JobTable } from "./job-list/JobTable";
import { Filter, Plus, MapPin, List, Map } from "lucide-react";
import JobSiteMapView from "./job-list/JobSiteMapView";
import { toast } from "sonner";
import { mockJobs } from "../data/mockJobs";
import type { Job } from "@/types/job";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export function JobsMain() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Sample job data from mockJobs
  const jobs = mockJobs;
  
  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    setActionLoading(jobId);
    try {
      // This would be an API call in a real application
      console.log(`Changing job ${jobId} status to ${newStatus}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      toast.success(`Job ${jobId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppLayout>
      <div className="container-responsive mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">Job Management</h1>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-auto flex-1 md:flex-initial">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              <Button 
                onClick={() => navigate("/jobs/new")} 
                className="whitespace-nowrap"
              >
                <Plus className="mr-1 h-4 w-4" /> New Job
              </Button>
            </div>
          </div>
          
          <div className="h-[calc(100vh-220px)]">
            <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="h-full overflow-y-auto">
                  <JobTable 
                    searchQuery={searchQuery} 
                    jobs={jobs}
                    actionLoading={actionLoading}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="h-full p-1">
                  <JobSiteMapView jobs={jobs} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
