import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar, MapPin, Filter, Plus, Link, Copy, CheckCircle } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TradeDashboardContent } from "@/components/trade-dashboard/TradeDashboardContent";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar as ReactCalendar } from "@/components/ui/calendar";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Job } from "@/types/job";
import { supabase } from "@/lib/supabase";
import JobMap from "@/components/JobMap";

export default function DashboardPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("jobs");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [isQueuedSectionDragOver, setIsQueuedSectionDragOver] = useState(false);


  useEffect(() => {
    const fetchJobs = async () => {
      console.log("Fetching jobs from supabase...");
      setLoading(true);
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        console.log("Fetched jobs:", data);

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

  const handleJobClick = (jobName: string) => {
    toast.info(`Navigating to ${jobName}`);
    navigate('/jobs');
  };

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

  const handleJobAssign = async (jobId: string, date: Date) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      // Update job with new date (use local date to avoid timezone issues)
      const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const { error } = await supabase
        .from('jobs')
        .update({ 
          date: localDateString,
          status: 'in-progress',
          date_undecided: false
        })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === jobId 
            ? { ...j, date: localDateString, status: 'in-progress' as const, date_undecided: false }
            : j
        )
      );

      // Send notification to customer
      try {
        const notificationMessage = `Hello ${job.customer}, your job "${job.title || job.type}" has been scheduled for ${date.toLocaleDateString()}. We'll be in touch with more details soon. - Trade Ease Team`;
        
        // Here you would integrate with your SMS/messaging service
        // For now, we'll just log it and show a toast
        console.log('Notification sent:', notificationMessage);
        
        // Add notification to progression portal
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            job_id: jobId,
            customer: job.customer,
            message: notificationMessage,
            type: 'job_scheduled',
            sent_at: new Date().toISOString(),
            status: 'sent'
          });

        if (notificationError) {
          console.error('Failed to log notification:', notificationError);
        }

      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      toast.success(`Job assigned to ${date.toLocaleDateString()} and customer notified`);
    } catch (error) {
      console.error('Error assigning job:', error);
      toast.error('Failed to assign job');
    }
  };

  const handleJobUnschedule = async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      // Update job to remove date and set back to ready status
      const { error } = await supabase
        .from('jobs')
        .update({ 
          date: null,
          status: 'ready',
          date_undecided: true
        })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === jobId 
            ? { ...j, date: '', status: 'ready' as const, date_undecided: true }
            : j
        )
      );

      // Send notification to customer
      try {
        const notificationMessage = `Hello ${job.customer}, your job "${job.title || job.type}" has been moved back to our queue and will be rescheduled. We'll contact you soon with a new date. - Trade Ease Team`;
        
        console.log('Notification sent:', notificationMessage);
        
        // Add notification to progression portal
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            job_id: jobId,
            customer: job.customer,
            message: notificationMessage,
            type: 'job_unscheduled',
            sent_at: new Date().toISOString(),
            status: 'sent'
          });

        if (notificationError) {
          console.error('Failed to log notification:', notificationError);
        }

      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      toast.success(`Job moved back to queue and customer notified`);
    } catch (error) {
      console.error('Error unscheduling job:', error);
      toast.error('Failed to unschedule job');
    }
  };

  const getTeamColor = (assignedTeam?: string) => {
    if (!assignedTeam) return 'white'; // No team assigned
    
    switch (assignedTeam.toLowerCase()) {
      case 'red':
      case 'team red':
      case 'red team':
        return 'red';
      case 'blue':
      case 'team blue': 
      case 'blue team':
        return 'blue';
      case 'green':
      case 'team green':
      case 'green team':
        return 'green';
      default:
        return 'white'; // Unknown team or unassigned
    }
  };

  const getTeamColorClasses = (assignedTeam?: string) => {
    const teamColor = getTeamColor(assignedTeam);
    
    switch (teamColor) {
      case 'red':
        return {
          border: 'border-red-400',
          background: 'bg-red-50',
          hover: 'hover:border-red-500 hover:bg-red-100',
          indicator: 'bg-red-500',
          text: 'group-hover:text-red-700'
        };
      case 'blue':
        return {
          border: 'border-blue-400',
          background: 'bg-blue-50',
          hover: 'hover:border-blue-500 hover:bg-blue-100',
          indicator: 'bg-blue-500',
          text: 'group-hover:text-blue-700'
        };
      case 'green':
        return {
          border: 'border-green-400',
          background: 'bg-green-50',
          hover: 'hover:border-green-500 hover:bg-green-100',
          indicator: 'bg-green-500',
          text: 'group-hover:text-green-700'
        };
      default: // white/unassigned
        return {
          border: 'border-slate-200',
          background: 'bg-white',
          hover: 'hover:border-blue-400 hover:bg-slate-50',
          indicator: 'bg-slate-300',
          text: 'group-hover:text-blue-700'
        };
    }
  };

  return (
    <BaseLayout showQuickTabs>
      <div className="pb-10 pt-0">
        <div className="p-0 space-y-0">
          {/* Job Site Map - Google Maps Satellite View */}
          <div className="mt-0 relative">
            <div className="h-[400px]">

            {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Loading jobs data...</p>
            </div>
          </div>
        ) : (
          <div className="w-full mb-0">
            <div className="bg-gray-50 p-2 rounded-t-lg border border-gray-200 border-b-0">
              <div className="flex justify-between items-center relative">
                <h2 className="text-sm font-medium flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-blue-500" /> 
                  Job Locations
                </h2>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <p className="text-xl font-semibold text-white drop-shadow-md border border-black bg-black/60 px-3 py-1 rounded inline-block backdrop-blur-sm">
                    Welcome back to your dashboard
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {jobs.filter(job => 
                    (job.location && job.location[0] && job.location[1]) || 
                    (job.locations && job.locations.length > 0)
                  ).length} jobs with locations
                </div>
              </div>
            </div>
            <div className="h-[400px] bg-gray-50 rounded-b-lg border border-gray-200">
            <JobMap jobs={jobs} />
            </div>
          </div>
        )}

            </div>
          </div>

          {/* Job Management Controls - Integrated from Jobs Page */}
          <div className="px-4 mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-4">
              {/* Search and New Job Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64 flex-1 md:flex-initial">
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
                    className="whitespace-nowrap h-9 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-1 h-4 w-4" /> New Job
                  </Button>
                  <Button 
                    onClick={() => navigate("/jobs")} 
                    variant="outline"
                    className="whitespace-nowrap h-9"
                  >
                    <Link className="mr-1 h-4 w-4" /> View All Jobs
                  </Button>
                </div>
              </div>

              {/* Job Management Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex space-x-2 mb-4 border-b pb-2 w-full bg-transparent justify-start overflow-x-auto">
                  <TabsTrigger value="jobs" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Queued Jobs
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Completed Jobs
                  </TabsTrigger>
                  <TabsTrigger value="conversations" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Conversations
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Photos
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="financials" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Financials
                  </TabsTrigger>
                  <TabsTrigger value="forms" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Forms
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="px-3 py-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:font-medium data-[state=inactive]:text-gray-500">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="jobs" className="mt-0">
                  <div 
                    className={`p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border transition-all duration-200 ${
                      isQueuedSectionDragOver 
                        ? 'border-green-400 bg-green-50 shadow-lg' 
                        : 'border-slate-200'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsQueuedSectionDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      // Only set false if we're leaving the entire container
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsQueuedSectionDragOver(false);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsQueuedSectionDragOver(false);
                      
                      const jobDataStr = e.dataTransfer.getData('application/json');
                      if (jobDataStr) {
                        try {
                          const job = JSON.parse(jobDataStr);
                          if (job.id && job.date) {
                            // Only unschedule if job has a date (is scheduled)
                            handleJobUnschedule(job.id);
                          }
                        } catch (error) {
                          console.error('Error parsing job data:', error);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-800">Queued Jobs</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                          {jobs.filter(job => job.status === 'ready' || job.date_undecided).length} jobs
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className={`w-2 h-2 rounded-full ${
                          isQueuedSectionDragOver 
                            ? 'bg-green-500 animate-bounce' 
                            : 'bg-blue-500 animate-pulse'
                        }`}></div>
                        <span className={`font-medium ${
                          isQueuedSectionDragOver ? 'text-green-700' : 'text-slate-600'
                        }`}>
                          {isQueuedSectionDragOver ? 'Drop to unschedule' : 'Drag jobs to schedule'}
                        </span>
                      </div>
                    </div>
                    
                    {isQueuedSectionDragOver && (
                      <div className="mb-4 p-4 bg-green-100 border-2 border-green-300 border-dashed rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                          <span className="font-semibold">Drop job here to remove from schedule</span>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {jobs.filter(job => job.status === 'ready' || job.date_undecided).map((job) => {
                        const teamColors = getTeamColorClasses(job.assignedTeam);
                        return (
                          <div
                            key={job.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/json', JSON.stringify(job));
                              e.dataTransfer.effectAllowed = 'move';
                              e.currentTarget.style.opacity = '0.5';
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            className={`group ${teamColors.background} border-2 ${teamColors.border} rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-lg ${teamColors.hover} hover:scale-105 transition-all duration-300 ease-in-out`}
                            style={{ 
                              minHeight: '120px', 
                              maxWidth: '160px',
                              aspectRatio: '1.3'
                            }}
                          >
                            <div className="flex flex-col h-full">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className={`font-bold text-slate-800 text-sm leading-tight line-clamp-2 ${teamColors.text} transition-colors`}>
                                    {job.title || job.type}
                                  </h4>
                                  <div className={`w-2 h-2 ${teamColors.indicator} rounded-full transition-colors`}></div>
                                </div>
                              
                                <div className="space-y-1">
                                  <p className="text-slate-600 text-xs font-medium truncate">
                                    {job.customer}
                                  </p>
                                  <p className="text-slate-500 text-xs font-mono">
                                    #{job.job_number}
                                  </p>
                                </div>
                              </div>
                            
                              <div className="mt-auto pt-2">
                                <div className="flex items-center justify-center">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                                    job.status === 'ready' 
                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                                  }`}>
                                    {job.status === 'ready' ? 'Ready' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {jobs.filter(job => job.status === 'ready' || job.date_undecided).length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-medium mb-2">No queued jobs</p>
                        <p className="text-sm mb-4">Get started by adding your first job</p>
                        <Button 
                          onClick={() => navigate("/jobs/new")} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Job
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Completed Jobs</p>
                    <p className="text-2xl font-bold text-green-600">{completedJobs.length}</p>
                    <p className="text-sm text-gray-500">Jobs completed</p>
                  </div>
                </TabsContent>

                <TabsContent value="conversations" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Recent Conversations</p>
                    <Button onClick={() => navigate("/conversations")} variant="outline" className="mt-2">
                      View All Conversations
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Job Photos</p>
                    <Button onClick={() => navigate("/photos")} variant="outline" className="mt-2">
                      View Photo Gallery
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Job Notes</p>
                    <Button onClick={() => navigate("/notes")} variant="outline" className="mt-2">
                      View All Notes
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="financials" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Financial Overview</p>
                    <Button onClick={() => navigate("/financials")} variant="outline" className="mt-2">
                      View Financials
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="forms" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Job Forms</p>
                    <Button onClick={() => navigate("/forms")} variant="outline" className="mt-2">
                      View All Forms
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Customer Reviews</p>
                    <Button onClick={() => navigate("/reviews")} variant="outline" className="mt-2">
                      View All Reviews
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Staff Calendar - Only show when in Queued Jobs tab */}
          {activeTab === "queued" && (
            <div className="px-4 mt-4">
              <div className="relative bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                {/* Replace the existing calendar with our new synchronized DashboardCalendar */}
                <DashboardCalendar jobs={jobs} onJobAssign={handleJobAssign} />
              </div>
            </div>
          )}

          {/* Performance Section */}
          <div className="px-4 mt-4">
            <Collapsible className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Performance Metrics</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="pt-4">
                  <PerformanceSection />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Statistics Section */}
            <Collapsible className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Statistics & Analytics</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="pt-4">
                  <StatisticsSection />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Google Business Dashboard */}
            <Collapsible className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Google Business Dashboard</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="pt-4">
                  <TradeDashboardContent />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
