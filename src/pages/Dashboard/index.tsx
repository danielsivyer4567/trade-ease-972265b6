import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Calendar as CalendarIcon, MapPin, Users, Star, TrendingUp, CircleDollarSign, Clock, CheckCircle } from "lucide-react";
import { Button } from '@/components/ui/button';

// Mock data for upcoming jobs
const upcomingJobs = [
  { id: 1, title: "Kitchen Remodel", address: "123 Main St", date: "Aug 15", status: "Scheduled" },
  { id: 2, title: "Bathroom Renovation", address: "456 Oak Ave", date: "Aug 18", status: "Pending Materials" },
  { id: 3, title: "Fence Installation", address: "789 Pine Rd", date: "Aug 22", status: "Confirmed" },
  { id: 4, title: "Deck Construction", address: "101 Cedar Blvd", date: "Aug 25", status: "Waiting Approval" },
];

// Mock data for team progress
const teamProgress = [
  { id: 1, name: "Team Red", completedJobs: 12, ongoingJobs: 5, rating: 4.8 },
  { id: 2, name: "Team Blue", completedJobs: 9, ongoingJobs: 3, rating: 4.6 },
  { id: 3, name: "Team Green", completedJobs: 15, ongoingJobs: 7, rating: 4.9 },
];

// Mock data for key statistics
const keyStatistics = [
  {
    title: "Monthly Revenue",
    value: "$45,289",
    change: "+12.5%",
    trend: "up",
    icon: BarChart,
    description: "vs. last month"
  },
  {
    title: "Active Jobs",
    value: "24",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
    description: "vs. last week"
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: CheckCircle,
    description: "based on recent reviews"
  },
  {
    title: "Outstanding Payments",
    value: "$12,450",
    change: "-15%",
    trend: "down",
    icon: CircleDollarSign,
    description: "vs. last month"
  }
];

// Mock data for Google Business stats
const googleBusinessStats = [
  {
    title: "Google Rating",
    value: "4.8",
    change: "+0.3",
    trend: "up",
    icon: Star,
    description: "last 30 days"
  },
  {
    title: "Profile Views",
    value: "1,284",
    change: "+22%",
    trend: "up",
    icon: TrendingUp,
    description: "vs. last month"
  },
  {
    title: "Customer Reviews",
    value: "156",
    change: "+12",
    trend: "up",
    icon: CheckCircle,
    description: "last 30 days"
  },
  {
    title: "Location Searches",
    value: "892",
    change: "+15%",
    trend: "up",
    icon: MapPin,
    description: "vs. last month"
  }
];

// Simplified Team Calendar Component
const TeamCalendar = () => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" /> Team Calendar
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
            <div 
              key={date} 
              className={`p-2 text-center text-sm border rounded-md ${
                date === 15 || date === 22 ? 'bg-blue-100 border-blue-300' : 
                date === 18 ? 'bg-green-100 border-green-300' : 
                date === 25 ? 'bg-yellow-100 border-yellow-300' : 
                'border-gray-200'
              }`}
            >
              {date}
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
            <span>Team Red</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
            <span>Team Blue</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
            <span>Team Green</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Simplified Job Site Map Component
const JobSiteMap = () => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" /> Job Site Map
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="bg-gray-100 rounded-md p-4 h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Interactive job site map</p>
          <p className="text-gray-400 text-sm">Showing 24 active job locations</p>
          <Button variant="outline" size="sm" className="mt-2">View Full Map</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-1 h-4 w-4" /> Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-1 h-4 w-4" /> All Teams
            </Button>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyStatistics.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="space-y-0 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Site Map and Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <JobSiteMap />
          <TeamCalendar />
        </div>

        {/* Upcoming Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Upcoming Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Job</th>
                    <th className="text-left p-3 font-medium">Location</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingJobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{job.title}</td>
                      <td className="p-3">{job.address}</td>
                      <td className="p-3">{job.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                          job.status === 'Pending Materials' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'Waiting Approval' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Team Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Team Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Team</th>
                    <th className="text-left p-3 font-medium">Completed Jobs</th>
                    <th className="text-left p-3 font-medium">Ongoing Jobs</th>
                    <th className="text-left p-3 font-medium">Rating</th>
                    <th className="text-right p-3 font-medium">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {teamProgress.map((team) => (
                    <tr key={team.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{team.name}</td>
                      <td className="p-3">{team.completedJobs}</td>
                      <td className="p-3">{team.ongoingJobs}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{team.rating}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(team.completedJobs / (team.completedJobs + team.ongoingJobs)) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Google Business Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" /> Google Business Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {googleBusinessStats.map((stat) => (
                <div key={stat.title} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {stat.description}
                    </span>
                  </div>
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