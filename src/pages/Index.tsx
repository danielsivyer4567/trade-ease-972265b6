
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import JobMap from "@/components/JobMap";
import type { Job } from "@/types/job";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import React from 'react';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatisticsGrid } from "@/components/dashboard/StatisticsGrid";
import { QuoteStatusGrid } from "@/components/dashboard/QuoteStatusGrid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const allJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "In Progress",
  date: "Today",
  location: [151.2093, -33.8688] as [number, number]
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "Electrical Installation",
  status: "Scheduled",
  date: "Tomorrow",
  location: [151.2543, -33.8688] as [number, number]
}, {
  id: "3",
  customer: "Mike Brown",
  type: "HVAC Maintenance",
  status: "Completed",
  date: "Yesterday",
  location: [151.1943, -33.8788] as [number, number]
}, {
  id: "4",
  customer: "Emma Wilson",
  type: "Kitchen Renovation",
  status: "Scheduled",
  date: "Tomorrow",
  location: [151.2153, -33.8588] as [number, number]
}];

const Index = () => {
  const [sharedDate, setSharedDate] = React.useState<Date | undefined>(new Date());
  const todaysJobs = allJobs.filter(job => job.date === "Today");
  const tomorrowsJobs = allJobs.filter(job => job.date === "Tomorrow");

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fadeIn px-2 sm:px-4 md:px-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
          <div className="lg:col-span-3 space-y-3 md:space-y-6">
            <Card className="p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Job Locations</h2>
              <JobMap jobs={[...todaysJobs, ...tomorrowsJobs]} />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <Card className="p-3 md:p-4">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Today's Jobs</h2>
            <div className="space-y-2 md:space-y-3">
              {todaysJobs.map(job => (
                <div key={job.id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm md:text-base">{job.customer}</div>
                  <div className="text-xs md:text-sm text-gray-500">{job.type}</div>
                  <span className={`inline-block mt-1.5 md:mt-2 px-2 py-0.5 md:py-1 rounded-full text-xs ${
                    job.status === "Completed" ? "bg-green-100 text-green-800" : 
                    job.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
              {todaysJobs.length === 0 && (
                <p className="text-gray-500 text-xs md:text-sm">No jobs scheduled for today</p>
              )}
            </div>
          </Card>

          <Card className="p-3 md:p-4">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Tomorrow's Jobs</h2>
            <div className="space-y-2 md:space-y-3">
              {tomorrowsJobs.map(job => (
                <div key={job.id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm md:text-base">{job.customer}</div>
                  <div className="text-xs md:text-sm text-gray-500">{job.type}</div>
                  <span className={`inline-block mt-1.5 md:mt-2 px-2 py-0.5 md:py-1 rounded-full text-xs ${
                    job.status === "Completed" ? "bg-green-100 text-green-800" : 
                    job.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
              {tomorrowsJobs.length === 0 && (
                <p className="text-gray-500 text-xs md:text-sm">No jobs scheduled for tomorrow</p>
              )}
            </div>
          </Card>
        </div>

        <QuoteStatusGrid />
        <StatisticsGrid />

        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-zinc-950">Team Calendars Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Red Team Calendar</h3>
              <TeamCalendar date={sharedDate} setDate={setSharedDate} teamColor="red" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Blue Team Calendar</h3>
              <TeamCalendar date={sharedDate} setDate={setSharedDate} teamColor="blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Green Team Calendar</h3>
              <TeamCalendar date={sharedDate} setDate={setSharedDate} teamColor="green" />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm" className="gap-2 text-gray-600 hover:text-gray-800">
              <Plus className="w-4 h-4" />
              Add Team
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
