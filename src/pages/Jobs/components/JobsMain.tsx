import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { JobTable } from "./job-list/JobTable";
import { Filter, Plus, Calendar, Link, Copy } from "lucide-react";
import JobSiteMapView from "./job-list/JobSiteMapView";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function JobsMain() {
  console.log("JobsMain component is rendering");
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("Fetching jobs from supabase...");
      setLoading(true);
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        console.log("Supabase response:", { data, error });
        if (error) {
          console.error("Supabase error:", error);
          toast.error("Failed to fetch jobs");
        } else {
          setJobs(data || []);
          if (data && data.length > 0) {
            setSelectedJob(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error in fetchJobs:", err);
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    setActionLoading(jobId);
    try {
      await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId);
      setJobs(jobs => jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
      toast.success(`Job ${jobId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  const selectedJobData = jobs.find(job => job.id === selectedJob);
  const completedSteps = selectedJobData?.job_steps?.filter(step => step.isCompleted)?.length || 0;
  const totalSteps = selectedJobData?.job_steps?.length || 0;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  const progressLink = selectedJob ? 
    `https://1b024d1a-36c6-4c1f-bf9e-27b08a6c3df4.lovableproject.com/progress/${selectedJob}` : '';

  return (
    <div className="w-full h-full p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex space-x-6 mb-6 border-b pb-4 w-full bg-transparent justify-start">
          <TabsTrigger value="overview" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Jobs & Quotes
          </TabsTrigger>
          <TabsTrigger value="conversations" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Conversations
          </TabsTrigger>
          <TabsTrigger value="photos" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Photos
          </TabsTrigger>
          <TabsTrigger value="notes" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Notes
          </TabsTrigger>
          <TabsTrigger value="financials" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Financials
          </TabsTrigger>
          <TabsTrigger value="forms" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Forms
          </TabsTrigger>
          <TabsTrigger value="reviews" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="progress" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Progress Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="text-center py-10 text-gray-500">
            Overview content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
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
              <ResizablePanelGroup direction="horizontal" className="rounded-lg">
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
        </TabsContent>

        <TabsContent value="progress">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Customer Progress Link</h1>
                <p className="text-gray-500">Share this link with your customer to keep them updated on job progress</p>
              </div>
              
              <div>
                <h2 className="font-medium mb-2">Select Job for Progress Link</h2>
                <Select 
                  value={selectedJob || ''} 
                  onValueChange={setSelectedJob}
                >
                  <SelectTrigger className="w-full md:w-[400px]">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} ({job.jobNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  value={progressLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(progressLink);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Link className="h-4 w-4 mr-2" />
                  Preview Link
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Enable notifications</span>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Progress Portal Preview</h2>
            
            <div className="border rounded-lg p-4 mb-6">
              <Tabs defaultValue="portal-progress">
                <TabsList className="flex space-x-6 mb-6 border-b pb-4 bg-transparent justify-start">
                  <TabsTrigger value="portal-progress" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Progress</TabsTrigger>
                  <TabsTrigger value="portal-photos" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Photos</TabsTrigger>
                  <TabsTrigger value="portal-documents" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Documents</TabsTrigger>
                  <TabsTrigger value="portal-comments" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Comments</TabsTrigger>
                  <TabsTrigger value="portal-settings" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Settings</TabsTrigger>
                  <TabsTrigger value="portal-conversations" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Conversations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portal-progress">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm">Progress: {completedSteps} of {totalSteps} steps completed</p>
                      <p className="text-sm font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Job Steps</h3>
                    <div className="space-y-4">
                      {selectedJobData?.job_steps?.map((step, index) => (
                        <div key={step.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${step.isCompleted ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                              {step.isCompleted && '✓'}
                            </div>
                            <span className="font-medium">{step.title}</span>
                          </div>
                          {step.isCompleted && (
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                              Completed 2023-12-{index + 1 < 10 ? '0' + (index + 1) : index + 1}
                            </span>
                          )}
                        </div>
                      ))}
                      
                      {(!selectedJobData?.job_steps || selectedJobData.job_steps.length === 0) && (
                        <div className="text-center text-gray-500 py-4">
                          No job steps defined for this job
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-photos">
                  <div className="text-center text-gray-500 py-4">
                    Photos will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-documents">
                  <div className="text-center text-gray-500 py-4">
                    Documents will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-comments">
                  <div className="text-center text-gray-500 py-4">
                    Comments will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-settings">
                  <div className="text-center text-gray-500 py-4">
                    Settings will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-conversations">
                  <div className="text-center text-gray-500 py-4">
                    Conversations will be displayed here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="text-center py-10 text-gray-500">
            Conversations content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="text-center py-10 text-gray-500">
            Photos content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-10 text-gray-500">
            Notes content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="financials">
          <div className="text-center py-10 text-gray-500">
            Financials content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <div className="text-center py-10 text-gray-500">
            Forms content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-10 text-gray-500">
            Reviews content will be displayed here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
