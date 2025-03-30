
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
import type { Job } from "@/types/job";

export function JobsMain() {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Sample job data
  const sampleJobs: Job[] = [
    {
      id: "1",
      title: "Plumbing Repair",
      customer: "John Smith",
      jobNumber: "PLM-001",
      type: "Plumbing",
      status: "in-progress",
      date: "2023-05-15",
      location: [151.2093, -33.8688],
      assignedTeam: "Team Blue"
    },
    {
      id: "2",
      title: "Electrical Installation",
      customer: "Sarah Johnson",
      jobNumber: "ELE-001",
      type: "Electrical",
      status: "ready",
      date: "2023-05-16",
      location: [151.2093, -33.8688],
      assignedTeam: "Team Red"
    },
    {
      id: "3",
      title: "HVAC Maintenance",
      customer: "Michael Brown",
      jobNumber: "HVAC-001",
      type: "HVAC",
      status: "to-invoice",
      date: "2023-05-17",
      location: [151.2093, -33.8688],
      assignedTeam: "Team Green"
    }
  ];
  
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
          
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={showMap ? "outline" : "default"}
              size="sm"
              onClick={() => setShowMap(false)}
              className="flex items-center"
            >
              <List className="mr-1 h-4 w-4" />
              List View
            </Button>
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(true)}
              className="flex items-center"
            >
              <Map className="mr-1 h-4 w-4" />
              Map View
            </Button>
          </div>

          {showMap ? (
            <Card>
              <CardContent className="p-0 relative">
                <JobSiteMapView jobs={sampleJobs} />
              </CardContent>
            </Card>
          ) : (
            <JobTable 
              searchQuery={searchQuery} 
              jobs={sampleJobs}
              actionLoading={actionLoading}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
