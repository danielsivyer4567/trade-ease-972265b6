import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TradeDashboardContent } from "@/components/trade-dashboard/TradeDashboardContent";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar as ReactCalendar } from "@/components/ui/calendar";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
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
  const [showFullMap, setShowFullMap] = useState(false);


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

  return (
    <BaseLayout showQuickTabs>
      <div className="pb-10 pt-0">
        <div className="p-0 space-y-4">
          {/* Job Site Map - Google Maps Satellite View with welcome message overlay */}
          <div className="mt-0 relative">
            <div className="flex justify-between items-center px-4 py-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Job Site Map
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowFullMap(!showFullMap)}>
                {showFullMap ? 'Compact View' : 'Expand Map'}
              </Button>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${showFullMap ? 'h-[600px]' : 'h-[400px]'}`}>

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
            <JobMap jobs={jobs} />


            </div>
          </div>
        )}

            </div>

            {/* Welcome message as absolute overlay inside the map */}
            <div className="absolute top-0 left-0 right-0 z-10 text-center mt-4">
              <p className="text-xl font-semibold text-white drop-shadow-md border border-black bg-black/60 px-3 py-1 rounded inline-block backdrop-blur-sm">
                Welcome back to your dashboard.
              </p>
            </div>
          </div>

          {/* Jobs Today, Tomorrow, and Finished */}
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="shadow-md border-2 border-gray-400">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Today</h2>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        navigate('/jobs?filter=today');
                        toast.info("Viewing today's jobs");
                      }}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Bathroom Renovation')}
                    >
                      <p className="font-medium">Bathroom Renovation</p>
                      <p className="text-sm text-gray-500">Today, 9:00 AM</p>
                    </div>
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Kitchen Plumbing')}
                    >
                      <p className="font-medium">Kitchen Plumbing</p>
                      <p className="text-sm text-gray-500">Today, 11:30 AM</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="shadow-md border-2 border-gray-400">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Tomorrow</h2>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        navigate('/jobs?filter=tomorrow');
                        toast.info("Viewing tomorrow's jobs");
                      }}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Water Heater Installation')}
                    >
                      <p className="font-medium">Water Heater Installation</p>
                      <p className="text-sm text-gray-500">Tomorrow, 9:00 AM</p>
                    </div>
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Roof Repair')}
                    >
                      <p className="font-medium">Roof Repair</p>
                      <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="shadow-md border-2 border-gray-400">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Recently Finished</h2>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        navigate('/jobs?filter=completed');
                        toast.info('Viewing completed jobs');
                      }}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Water Heater Installation')}
                    >
                      <p className="font-medium">Water Heater Installation</p>
                      <p className="text-sm text-gray-500">Completed by Team Red</p>
                    </div>
                    <div
                      className="border-b pb-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      onClick={() => handleJobClick('Electrical Panel Upgrade')}
                    >
                      <p className="font-medium">Electrical Panel Upgrade</p>
                      <p className="text-sm text-gray-500">Completed by Team Blue</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Staff Calendar */}
            <div className="relative bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
              {/* Replace the existing calendar with our new synchronized DashboardCalendar */}
              <DashboardCalendar />
            </div>

            {/* Performance Section */}
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
