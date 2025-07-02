import { BaseLayout } from '@/components/ui/BaseLayout';
import JobSiteMap from '@/components/dashboard/JobSiteMap';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TradeDashboardContent } from '@/components/trade-dashboard/TradeDashboardContent';
import { PerformanceSection } from '@/components/dashboard/PerformanceSection';
import { StatisticsSection } from '@/components/dashboard/StatisticsSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar as ReactCalendar } from '@/components/ui/calendar';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GoogleMap, Marker, OverlayView, useLoadScript } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';
import { useRef } from "react";




export default function DashboardPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [showFullMap, setShowFullMap] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };
  const zoomToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(18);
    }
  };
  

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase.from('jobs').select('*').limit(100);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        console.log('RAW jobs from Supabase:', data);
        const cleaned = (data || []).map(job => {
          const [lng, lat] = job.location;
          return {
            ...job,
            location: [parseFloat(lng), parseFloat(lat)],
          };
        });

        console.log('Parsed jobs:', cleaned);
        setJobs(cleaned);
      }
    }

    fetchJobs();
  }, []);

  console.log('Sanitized jobs:', jobs);

  const handleJobClick = (jobName: string) => {
    // Since these are mock jobs, we'll navigate to the jobs page with a toast
    toast.info(`Navigating to ${jobName}`);
    navigate('/jobs');
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCEZfDx6VHz83XX2tnhGRZl3VGSb9WlY1s',
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  // Only define customIcon after isLoaded is true and window.google is available
  const customIcon =
    window.google && window.google.maps
      ? {
          url: '/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png',
          scaledSize: new window.google.maps.Size(40, 40),
        }
      : undefined;

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
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: -27.987904, lng: 153.413997 }}
                zoom={14}
                onLoad={onMapLoad}
              >
                {jobs.map((job, idx) => (
                  <OverlayView
                    key={job.id || idx}
                    position={{ lat: job.location[1], lng: job.location[0] }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      onClick={() => zoomToLocation(job.location[1], job.location[0])}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(30, 30, 30, 0.5)', // semi-transparent dark
                        backdropFilter: 'blur(6px)', // blur effect
                        WebkitBackdropFilter: 'blur(6px)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        transform: 'translate(-50%, -130%)',
                        whiteSpace: 'nowrap',
                        gap: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        minWidth: '125px',
                      }}
                    >
                      <img
                        src={customIcon.url}
                        alt="Job Icon"
                        width={18}
                        height={18}
                        style={{ objectFit: 'contain', flexShrink: 0 }}
                      />
                      <span>{job.job_number || 'N/A'}</span>
                    </div>
                  </OverlayView>
                ))}
              </GoogleMap>
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
              {/* <DashboardCalendar /> */}
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
