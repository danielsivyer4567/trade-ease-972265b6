import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar, MapPin, Filter, Plus, Link, Copy, CheckCircle, Zap, Wrench, AlertTriangle, Settings, Droplets, Building, Clock, BarChart3, Users, MessageCircle, Camera, FileText, DollarSign, ClipboardList, Star } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Job, Technician } from "@/types/job";
import { supabase } from "@/lib/supabase";
import JobMap from "@/components/JobMap";
import { ActiveJobCards } from "@/components/ActiveJobCards";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import ModernFinancialDashboard from "@/pages/TradeDash/components/ModernFinancialDashboard";

export default function DashboardPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("analytics");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [isQueuedSectionDragOver, setIsQueuedSectionDragOver] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Real technician data from database
  const [technicians, setTechnicians] = useState<Technician[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data from supabase...");
      setLoading(true);
      try {
        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase.from('jobs').select('*');
        console.log("Fetched jobs:", jobsData);

        if (jobsError) {
          console.error("Jobs fetch error:", jobsError);
          toast.error("Failed to fetch jobs");
        } else {
          setJobs(jobsData || []);
          if (jobsData && jobsData.length > 0) {
            setSelectedJob(jobsData[0].id);
          }
        }

        // Fetch technicians/team members
        const { data: techniciansData, error: techniciansError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'technician');

        if (techniciansError) {
          console.error("Technicians fetch error:", techniciansError);
          // Don't show error toast for technicians as it's not critical for dashboard
        } else {
          // Transform user data to technician format
          const transformedTechnicians: Technician[] = (techniciansData || []).map(user => ({
            id: user.id,
            name: user.full_name || user.email || 'Unknown',
            email: user.email || '',
            phone: user.phone || '',
            skills: user.skills || [],
            shift: user.shift || { start: "8:00 AM", end: "5:00 PM" },
            isAvailable: user.is_available ?? true,
            maxConcurrentJobs: user.max_concurrent_jobs || 3,
            hourlyRate: user.hourly_rate || 0
          }));
          setTechnicians(transformedTechnicians);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJobClick = useCallback((jobName: string) => {
    toast.info(`Navigating to ${jobName}`);
    navigate('/jobs');
  }, [navigate]);

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

  const handleJobSelect = useCallback((jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  }, []);

  const handleJobAssignToTechnician = async (jobId: string, technicianId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ assignedTo: technicianId })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === jobId ? { ...j, assignedTo: technicianId } : j
        )
      );

      const technician = technicians.find(t => t.id === technicianId);
      toast.success(`Job assigned to ${technician?.name || 'technician'}`);
    } catch (error) {
      console.error('Error assigning job to technician:', error);
      toast.error('Failed to assign job to technician');
    }
  };

  const handleActiveJobStatusUpdate = (jobId: string, status: "pending" | "ready" | "in-progress" | "completed" | "cancelled") => {
    // Map the ActiveJobCards status to our Job status
    const mappedStatus = status === 'pending' ? 'ready' : status as Job['status'];
    handleStatusChange(jobId, mappedStatus);
  };

  // Transform jobs to match ActiveJobCards interface - memoized for performance
  const transformJobsForActiveCards = useCallback((jobs: Job[]) => {
    return jobs.map(job => {
      const jobData = job as Job & {
        priority?: "low" | "medium" | "high" | "urgent";
        size?: "S" | "M" | "L" | "XL";
        estimatedDuration?: number;
        value?: number;
        cost?: number;
        lat?: number;
        lng?: number;
        created_at?: string;
        due_date?: string;
        completed_at?: string;
        customerRating?: number;
        notes?: string[];
        tags?: string[];
        weatherSensitive?: boolean;
        requiresSpecialEquipment?: boolean;
      };

      return {
        id: job.id,
        type: job.type || job.title || 'General Service',
        customer: job.customer || 'Unknown Customer',
        status: (job.status === 'to-invoice' || job.status === 'invoiced' ? 'ready' : job.status) as "pending" | "ready" | "in-progress" | "completed" | "cancelled",
        priority: (jobData.priority || (job.type?.toLowerCase().includes('emergency') ? 'urgent' : 'medium')) as "low" | "medium" | "high" | "urgent",
        category: job.type?.toLowerCase().includes('emergency') ? 'emergency' :
                  job.type?.toLowerCase().includes('electrical') ? 'electrical' :
                  job.type?.toLowerCase().includes('hvac') ? 'hvac' :
                  job.type?.toLowerCase().includes('plumbing') ? 'plumbing' :
                  'maintenance' as "emergency" | "maintenance" | "electrical" | "hvac" | "plumbing",
        size: (jobData.size || 'M') as "S" | "M" | "L" | "XL",
        assignedTo: job.assignedTo,
        estimatedDuration: jobData.estimatedDuration || 120,
        value: jobData.value || 450,
        cost: jobData.cost || 280,
        location: {
          address: typeof job.location === 'string' ? job.location : job.address || 'Unknown Address',
          lat: jobData.lat || 0,
          lng: jobData.lng || 0
        },
        createdAt: new Date(jobData.created_at || Date.now()),
        dueDate: new Date(jobData.due_date || job.date || Date.now()),
        completedAt: jobData.completed_at ? new Date(jobData.completed_at) : undefined,
        customerRating: jobData.customerRating,
        notes: jobData.notes || [],
        tags: jobData.tags || [],
        weatherSensitive: jobData.weatherSensitive || false,
        requiresSpecialEquipment: jobData.requiresSpecialEquipment || false
      };
    });
  }, []);

  // Transform technicians to match ActiveJobCards interface - memoized for performance
  const transformTechniciansForActiveCards = useCallback((technicians: Technician[]) => {
    return technicians.map(tech => {
      const techData = tech as Technician & {
        certifications?: string[];
        currentJobs?: string[];
      };

      return {
        id: tech.id,
        name: tech.name,
        email: tech.email,
        phone: tech.phone,
        skills: tech.skills,
        certifications: techData.certifications || [],
        currentJobs: techData.currentJobs || [],
        maxConcurrentJobs: tech.maxConcurrentJobs,
        hourlyRate: tech.hourlyRate,
        isAvailable: tech.isAvailable
      };
    });
  }, []);

  const getTeamColor = useCallback((assignedTeam?: string) => {
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
  }, []);

  const getTeamColorClasses = useCallback((assignedTeam?: string) => {
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
  }, [getTeamColor]);

  const getJobIcon = (jobType: string) => {
    const type = jobType.toLowerCase();
    if (type.includes('plumbing')) return <Droplets className="w-5 h-5" />;
    if (type.includes('electrical')) return <Zap className="w-5 h-5" />;
    if (type.includes('hvac') || type.includes('maintenance')) return <Settings className="w-5 h-5" />;
    if (type.includes('emergency')) return <AlertTriangle className="w-5 h-5" />;
    if (type.includes('building') || type.includes('construction')) return <Building className="w-5 h-5" />;
    return <Wrench className="w-5 h-5" />;
  };

  const getJobPriority = (job: Job) => {
    if (job.type.toLowerCase().includes('emergency')) return 'H';
    if (job.status === 'ready') return 'M';
    return 'L';
  };

  const getJobPrice = (job: Job) => {
    // Mock pricing based on job type
    if (job.type.toLowerCase().includes('emergency')) return '$450';
    if (job.type.toLowerCase().includes('hvac')) return '$280';
    if (job.type.toLowerCase().includes('maintenance')) return '$180';
    return '$250';
  };

  const isJobOverdue = useCallback((job: Job) => {
    if (!job.date || job.date_undecided) return false;
    const jobDate = new Date(job.date);
    const today = new Date();
    return jobDate < today && job.status !== 'completed';
  }, []);

  // Memoize filtered jobs for better performance
  const filteredJobsForActiveCards = useMemo(() => {
    return jobs.filter(job => job.status === 'ready' || job.status === 'in-progress' || job.date_undecided);
  }, [jobs]);

  // Memoize transformed jobs and technicians
  const transformedJobs = useMemo(() => {
    return transformJobsForActiveCards(filteredJobsForActiveCards);
  }, [transformJobsForActiveCards, filteredJobsForActiveCards]);

  const transformedTechnicians = useMemo(() => {
    return transformTechniciansForActiveCards(technicians);
  }, [transformTechniciansForActiveCards, technicians]);

  return (
    <BaseLayout showQuickTabs>
      <div className="pb-10 pt-0">
        <div className="p-0 space-y-0">
          {/* Job Site Map - Google Maps Satellite View */}
          <div className="mt-0 relative px-4">
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
                  <div className="flex justify-between items-center relative py-4">
                    <h2 className="text-sm font-medium flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-blue-500" /> 
                      Job Locations
                    </h2>
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <p className="text-xl font-semibold text-white drop-shadow-md border border-black bg-black/60 px-4 py-2 rounded inline-block backdrop-blur-sm">
                        Welcome back to your dashboard
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {jobs.filter(job => 
                        (job.location && Array.isArray(job.location) && job.location.length >= 2) || 
                        (job.locations && Array.isArray(job.locations) && job.locations.length > 0)
                      ).length} jobs with locations
                    </div>
                  </div>
                </div>
                <div className="h-[400px] bg-gray-50 rounded-b-lg border border-gray-200">
                  <JobMap 
                    jobs={jobs} 
                    showWeatherControls={true}
                    autoFit={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Job Management Controls - Integrated from Jobs Page */}
          <div className="px-4 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-4">
              {/* Job Management Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex space-x-0 mb-4 border-b-0 pb-0 w-full bg-transparent justify-between overflow-x-auto">
                  <TabsTrigger value="analytics" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <BarChart3 className="w-4 h-4" />
                    Stats
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <Clock className="w-4 h-4" />
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <Users className="w-4 h-4" />
                    Team
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <Camera className="w-4 h-4" />
                    Photos
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <FileText className="w-4 h-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="forms" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <ClipboardList className="w-4 h-4" />
                    Forms
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-2 px-4 py-3 rounded-t-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:font-medium data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200">
                    <Star className="w-4 h-4" />
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="analytics" className="mt-0">
                  <div className="space-y-6">
                    <ModernFinancialDashboard />
                    <StatisticsSection />
                  </div>
                </TabsContent>

                <TabsContent value="jobs" className="mt-0">
                  <ActiveJobCards
                    jobs={transformedJobs}
                    technicians={transformedTechnicians}
                    selectedJobs={selectedJobs}
                    onJobSelect={handleJobSelect}
                    onStatusUpdate={handleActiveJobStatusUpdate}
                    onAssign={handleJobAssignToTechnician}
                  />
                </TabsContent>

                <TabsContent value="team" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Team Management</p>
                    <p className="text-2xl font-bold text-purple-600">{technicians.length}</p>
                    <p className="text-sm text-gray-500">Active team members</p>
                    <Button onClick={() => navigate("/teams")} variant="outline" className="mt-2">
                      Manage Team
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-0">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Team Chat</p>
                    <Button onClick={() => navigate("/messaging")} variant="outline" className="mt-2">
                      Open Chat
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

          {/* Staff Calendar - Only show when in Jobs tab */}
          {activeTab === "jobs" && (
            <div className="px-4 mt-4">
              <div className="relative bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                <DashboardCalendar jobs={jobs} onJobAssign={handleJobAssign} />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
