import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { JobTable } from "./job-list/JobTable";
import { Filter, Plus, Calendar, Link, Copy, MapPin, CheckCircle } from "lucide-react";
import JobSiteMapView from "./job-list/JobSiteMapView";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// FeatureAccess component for checking feature access
function FeatureAccess({ featureKey }) {
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    async function checkAccess() {
      const { data, error } = await supabase.rpc('has_feature_access', { feature_key: featureKey });
      if (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } else {
        setHasAccess(data);
      }
    }
    checkAccess();
  }, [featureKey]);

  if (hasAccess === null) return <div>Checking feature access...</div>;
  return hasAccess
    ? <div>✅ Feature is enabled for you!</div>
    : <div>❌ Feature is NOT enabled for you.</div>;
}

export function JobsMain() {
  console.log("JobsMain component is rendering");
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

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
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prevJobs => {
        const updatedJobs = prevJobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        );
        
        const completed = updatedJobs.filter(job => job.status === 'completed');
        const active = updatedJobs.filter(job => job.status !== 'completed');
        
        setCompletedJobs(completed);
        return active;
      });

      toast.success('Job status updated successfully');
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
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
    <div className="w-full h-full p-2">
      {/* Feature access check at the top */}
      <FeatureAccess featureKey="some_feature_key" />
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Job Management</h1>
          <div className="flex items-center space-x-1 w-full md:w-auto">
            <div className="relative w-full md:w-auto flex-1 md:flex-initial">
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
              <Filter className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            </div>
            <Button 
              onClick={() => navigate("/jobs/new")} 
              className="whitespace-nowrap h-9"
            >
              <Plus className="mr-1 h-4 w-4" /> New Job
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Loading jobs data...</p>
            </div>
          </div>
        ) : (
          <div className="w-full mb-3">
            <div className="bg-gray-50 p-2 rounded-t-lg border border-gray-200 border-b-0">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-blue-500" /> 
                  Job Locations
                </h2>
                <div className="text-xs text-gray-500">
                  {jobs.filter(job => 
                    (job.location && job.location[0] && job.location[1]) || 
                    (job.locations && job.locations.length > 0)
                  ).length} jobs with locations
                </div>
              </div>
            </div>
            <div className="h-[200px] bg-gray-50 rounded-b-lg border border-gray-200">
              <JobSiteMapView jobs={jobs} />
            </div>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex space-x-4 mb-3 border-b pb-2 w-full bg-transparent justify-start">
          <TabsTrigger value="jobs" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Active Jobs
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Completed Jobs
          </TabsTrigger>
          <TabsTrigger value="conversations" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Conversations
          </TabsTrigger>
          <TabsTrigger value="photos" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Photos
          </TabsTrigger>
          <TabsTrigger value="notes" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Notes
          </TabsTrigger>
          <TabsTrigger value="financials" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Financials
          </TabsTrigger>
          <TabsTrigger value="forms" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Forms
          </TabsTrigger>
          <TabsTrigger value="reviews" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="progress" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
            Progress Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-3">
            {!loading && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-2 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-blue-500" /> 
                      Active Jobs
                    </h2>
                    <div className="text-xs text-gray-500">
                      {jobs.length} active jobs
                    </div>
                  </div>
                </div>
                <JobTable 
                  searchQuery={searchQuery} 
                  jobs={jobs}
                  actionLoading={actionLoading}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-3">
            {!loading && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-2 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> 
                      Completed Jobs
                    </h2>
                    <div className="text-xs text-gray-500">
                      {completedJobs.length} completed jobs
                    </div>
                  </div>
                </div>
                <JobTable 
                  searchQuery={searchQuery} 
                  jobs={completedJobs}
                  actionLoading={actionLoading}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-3">
            <div className="flex flex-col space-y-3">
              <div>
                <h1 className="text-xl font-bold">Customer Progress Link</h1>
                <p className="text-gray-500 text-sm">Share this link with your customer to keep them updated on job progress</p>
              </div>
              
              <div>
                <h2 className="font-medium mb-1 text-sm">Select Job for Progress Link</h2>
                <Select 
                  value={selectedJob || ''} 
                  onValueChange={setSelectedJob}
                >
                  <SelectTrigger className="w-full md:w-[400px] h-9">
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
              
              <div className="flex items-center space-x-1">
                <Input
                  value={progressLink}
                  readOnly
                  className="flex-1 bg-gray-50 h-9"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => {
                    navigator.clipboard.writeText(progressLink);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  className="flex items-center h-9"
                  onClick={() => {
                    if (selectedJob) {
                      window.open(`/preview-progress/${selectedJob}`, '_blank');
                      toast.success("Opening preview in new tab");
                    } else {
                      toast.error("Please select a job first");
                    }
                  }}
                >
                  <Link className="h-4 w-4 mr-1" />
                  Preview Link
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium">Enable notifications</span>
                  <div 
                    className={`w-8 h-4 ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors duration-200`}
                    onClick={() => {
                      setNotificationsEnabled(!notificationsEnabled);
                      toast.success(notificationsEnabled ? "Notifications disabled" : "Notifications enabled");
                    }}
                  >
                    <div 
                      className={`w-3 h-3 bg-white rounded-full absolute ${notificationsEnabled ? 'right-0.5' : 'left-0.5'} top-0.5 transition-all duration-200`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-3">
            <h2 className="text-lg font-bold mb-2">Progress Portal Preview</h2>
            
            <div className="border rounded-lg p-3 mb-3">
              <Tabs defaultValue="portal-progress">
                <TabsList className="flex space-x-4 mb-3 border-b pb-2 bg-transparent justify-start">
                  <TabsTrigger value="portal-progress" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Progress</TabsTrigger>
                  <TabsTrigger value="portal-photos" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Photos</TabsTrigger>
                  <TabsTrigger value="portal-documents" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Documents</TabsTrigger>
                  <TabsTrigger value="portal-comments" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Comments</TabsTrigger>
                  <TabsTrigger value="portal-settings" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Settings</TabsTrigger>
                  <TabsTrigger value="portal-conversations" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-medium data-[state=inactive]:text-gray-500">Conversations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portal-progress">
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <p className="text-xs">Progress: {completedSteps} of {totalSteps} steps completed</p>
                      <p className="text-xs font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Job Steps</h3>
                    <div className="space-y-2">
                      {selectedJobData?.job_steps?.map((step, index) => (
                        <div key={step.id} className="border rounded-lg p-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${step.isCompleted ? 'bg-green-500 text-white' : 'border border-gray-300'}`}>
                              {step.isCompleted && '✓'}
                            </div>
                            <span className="font-medium text-sm">{step.title}</span>
                          </div>
                          {step.isCompleted && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                              Completed 2023-12-{index + 1 < 10 ? '0' + (index + 1) : index + 1}
                            </span>
                          )}
                        </div>
                      ))}
                      
                      {(!selectedJobData?.job_steps || selectedJobData.job_steps.length === 0) && (
                        <div className="text-center text-gray-500 py-2 text-sm">
                          No job steps defined for this job
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-photos">
                  <div className="text-center text-gray-500 py-2 text-sm">
                    Photos will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-documents">
                  <div className="text-center text-gray-500 py-2 text-sm">
                    Documents will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-comments">
                  <div className="text-center text-gray-500 py-2 text-sm">
                    Comments will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-settings">
                  <div className="text-center text-gray-500 py-2 text-sm">
                    Settings will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="portal-conversations">
                  <div className="text-center text-gray-500 py-2 text-sm">
                    Conversations will be displayed here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="text-center py-4 text-gray-500">
            Conversations content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="text-center py-4 text-gray-500">
            Photos content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-4 text-gray-500">
            Notes content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="financials">
          <div className="text-center py-4 text-gray-500">
            Financials content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <div className="text-center py-4 text-gray-500">
            Forms content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-4 text-gray-500">
            Reviews content will be displayed here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
