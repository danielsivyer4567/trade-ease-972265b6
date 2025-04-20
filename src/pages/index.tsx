import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TradeDashboardContent } from "@/components/trade-dashboard/TradeDashboardContent";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";

export default function DashboardPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  
  return (
    <BaseLayout showQuickTabs>
      <div className="pb-10 pt-0">
        <div className="p-0 space-y-4">
          <div className="text-center absolute top-12 left-0 right-0 z-10">
            <p className="text-xl font-semibold text-white drop-shadow-md border border-black bg-black/20 px-3 py-1 rounded inline-block backdrop-blur-sm">Welcome back to your dashboard.</p>
          </div>
          
          {/* Job Site Map - Google Maps Satellite View */}
          <div className="mt-0">
            <JobSiteMap />
          </div>

          {/* Jobs Today, Tomorrow, and Finished */}
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="shadow-md">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Today</h2>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="font-medium">Bathroom Renovation</p>
                      <p className="text-sm text-gray-500">Today, 9:00 AM</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Kitchen Plumbing</p>
                      <p className="text-sm text-gray-500">Today, 11:30 AM</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="shadow-md">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Tomorrow</h2>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="font-medium">Water Heater Installation</p>
                      <p className="text-sm text-gray-500">Tomorrow, 9:00 AM</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Roof Repair</p>
                      <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="shadow-md">
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Jobs Recently Finished</h2>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="font-medium">Water Heater Installation</p>
                      <p className="text-sm text-gray-500">Completed by Team Red</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Electrical Panel Upgrade</p>
                      <p className="text-sm text-gray-500">Completed by Team Blue</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Staff Calendar */}
            <div className="relative bg-gray-100 rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-medium">Staff calendar</h2>
              </div>
              
              <div className="calendar-container relative">
                <div className="text-center mb-3">
                  <h3 className="text-md font-medium">April 2025</h3>
                </div>
                
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <button className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <button className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  onSelect={setCalendarDate}
                  className="w-full bg-gray-100 rounded-lg"
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption: "hidden",
                    caption_label: "hidden",
                    nav: "hidden",
                    nav_button: "hidden",
                    table: "w-full border-collapse",
                    head_row: "flex justify-between w-full mb-2",
                    head_cell: "text-gray-500 font-normal text-sm uppercase text-center flex-1",
                    row: "flex w-full mb-3 justify-between",
                    cell: "text-center flex-1",
                    day: "h-10 w-10 p-0 font-normal hover:bg-gray-200 rounded-full mx-auto flex items-center justify-center",
                    day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-gray-200 text-gray-900",
                    day_outside: "text-gray-400 opacity-50",
                    day_disabled: "text-gray-400 opacity-50",
                    day_hidden: "invisible",
                    day_range_middle: "day-range-middle",
                    day_range_end: "day-range-end",
                  }}
                />
              </div>
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
