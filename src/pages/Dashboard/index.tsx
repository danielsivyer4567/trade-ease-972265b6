import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobMap from '@/components/JobMap';

// Mock data for jobs
const todayJobs = [
  { id: 1, title: "Bathroom Renovation", time: "9:00 AM" },
  { id: 2, title: "Kitchen Plumbing", time: "11:30 AM" },
];

const tomorrowJobs = [
  { id: 1, title: "Water Heater Installation", time: "9:00 AM" },
  { id: 2, title: "Roof Repair", time: "10:00 AM" },
];

const completedJobs = [
  { id: 1, title: "Water Heater Installation", team: "Team Red" },
  { id: 2, title: "Electrical Panel Upgrade", team: "Team Blue" },
];

// Calendar data
const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const currentMonth = Array.from({ length: 31 }, (_, i) => i + 1);

// Mock data for job locations
const jobLocations = [
  {
    id: 1,
    jobNumber: "HVAC-001",
    customer: "Gold Coast Residence",
    type: "HVAC Installation",
    date: "Today, 9:00 AM",
    location: [153.4014, -28.0171] // [longitude, latitude]
  },
  {
    id: 2,
    jobNumber: "ELE-001",
    customer: "Surfers Paradise Office",
    type: "Electrical Upgrade",
    date: "Today, 11:30 AM",
    location: [153.4261, -27.9994]
  }
];

const Dashboard: React.FC = () => {
  // Get today's date to highlight in the calendar
  const today = new Date().getDate();
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-4 p-4">
        {/* Google Maps View */}
        <div className="w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden relative">
          <JobMap 
            jobs={jobLocations}
            center={[153.4014, -28.0171]} // Gold Coast coordinates
            zoom={12}
            height={300}
          />
        </div>

        {/* Job Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Jobs Today */}
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-lg">Jobs Today</CardTitle>
              <Button variant="outline" size="sm" className="h-8">View All</Button>
            </CardHeader>
            <CardContent>
              {todayJobs.map(job => (
                <div key={job.id} className="mb-3 last:mb-0">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">Today, {job.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Jobs Tomorrow */}
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-lg">Jobs Tomorrow</CardTitle>
              <Button variant="outline" size="sm" className="h-8">View All</Button>
            </CardHeader>
            <CardContent>
              {tomorrowJobs.map(job => (
                <div key={job.id} className="mb-3 last:mb-0">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">Tomorrow, {job.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Jobs Recently Finished */}
          <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-lg">Jobs Recently Finished</CardTitle>
              <Button variant="outline" size="sm" className="h-8">View All</Button>
            </CardHeader>
            <CardContent>
              {completedJobs.map(job => (
                <div key={job.id} className="mb-3 last:mb-0">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">Completed by {job.team}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Staff Calendar */}
        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg">Staff calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Days of week header */}
              {daysOfWeek.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar dates */}
              {currentMonth.map(date => (
                <div 
                  key={date} 
                  className={`text-center py-2 border ${
                    date === today ? 'bg-blue-500 text-white' : 
                    date === 20 ? 'bg-blue-100' : 
                    'hover:bg-gray-100'
                  } ${date === 1 ? 'rounded-tl-lg' : ''} ${date === 7 ? 'rounded-tr-lg' : ''}`}
                >
                  {date}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard; 