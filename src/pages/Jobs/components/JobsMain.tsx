import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { JobTable } from "./job-list/JobTable";
import { Filter, Plus, MapPin, List, Map } from "lucide-react";
import JobSiteMapView from "./job-list/JobSiteMapView";
import { toast } from "sonner";
import { mockJobs, convertToJob } from "../data/mockJobs";
import { mockDatabaseService } from "@/services/MockDatabaseService";
import type { Job } from "@/types/job";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

export function JobsMain() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("jobs");
  
  // Fetch jobs using React Query
  const { isLoading, isError, data: jobs = [], error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      try {
        const mockJobs = await mockDatabaseService.getJobs();
        return mockJobs.map(convertToJob);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    },
    // Fallback to mockJobs if there's an error
    placeholderData: mockJobs,
  });
  
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

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full p-0">
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
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-2">Error loading jobs</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list"><List className="mr-1 h-4 w-4" /> List View</TabsTrigger>
              <TabsTrigger value="map"><Map className="mr-1 h-4 w-4" /> Map View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="bg-white rounded-md">
              <JobTable 
                jobs={filteredJobs}
                searchQuery={searchQuery}
                actionLoading={actionLoading}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="map">
              <div className="h-[600px] bg-white rounded-md">
                <JobSiteMapView jobs={filteredJobs} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
