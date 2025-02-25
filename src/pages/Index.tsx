import { AppLayout } from "@/components/ui/AppLayout";
import { Calendar, DollarSign, FileText, Users, CheckSquare, Clock, MessageSquare, XSquare, Plus, Briefcase, Calendar as CalendarIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JobMap from "@/components/JobMap";
import type { Job } from "@/types/job";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

const stats = [{
  title: "Active Jobs",
  value: "12",
  icon: Calendar,
  change: "+2 from last week",
  trend: "up"
}, {
  title: "Pending Quotes",
  value: "8",
  icon: FileText,
  change: "-3 from last week",
  trend: "down"
}, {
  title: "Total Customers",
  value: "156",
  icon: Users,
  change: "+5 this month",
  trend: "up"
}, {
  title: "Revenue (MTD)",
  value: "$24,500",
  icon: DollarSign,
  change: "+15% vs last month",
  trend: "up"
}];

const allJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "in-progress",
  date: "Today",
  location: [151.2093, -33.8688],
  jobNumber: "PLM-001",
  title: "Emergency Plumbing Fix"
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "Electrical Installation",
  status: "ready",
  date: "Tomorrow",
  location: [151.2543, -33.8688],
  jobNumber: "ELE-001",
  title: "New Electrical Setup"
}, {
  id: "3",
  customer: "Mike Brown",
  type: "HVAC Maintenance",
  status: "invoiced",
  date: "Yesterday",
  location: [151.1943, -33.8788],
  jobNumber: "HVAC-001",
  title: "HVAC System Service"
}, {
  id: "4",
  customer: "Emma Wilson",
  type: "Kitchen Renovation",
  status: "ready",
  date: "Tomorrow",
  location: [151.2153, -33.8588],
  jobNumber: "REN-001",
  title: "Kitchen Upgrade"
}];

const todaysJobs = allJobs.filter(job => job.date === "Today");
const tomorrowsJobs = allJobs.filter(job => job.date === "Tomorrow");

const quoteStatuses = [{
  title: "Accepted Quotes",
  icon: CheckSquare,
  color: "#10B981",
  count: "5"
}, {
  title: "Awaiting Acceptance",
  icon: Clock,
  color: "#F59E0B",
  count: "3"
}, {
  title: "Replied Quotes",
  icon: MessageSquare,
  color: "#3B82F6",
  count: "2"
}, {
  title: "Denied Quotes",
  icon: XSquare,
  color: "#EF4444",
  count: "1"
}];

const statusColor = (status: Job['status']) => {
  switch (status) {
    case 'ready':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'to-invoice':
      return 'bg-purple-100 text-purple-800';
    case 'invoiced':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Index = () => {
  const [sharedDate, setSharedDate] = React.useState<Date | undefined>(new Date());
  const [teams, setTeams] = React.useState([
    { name: 'Red Team', color: 'red' },
    { name: 'Blue Team', color: 'blue' },
    { name: 'Green Team', color: 'green' }
  ]);

  const getColorForTeam = (teamIndex: number) => {
    const baseColors = [
      'red', 'blue', 'green', 'purple', 'orange', 'pink', 'teal', 'yellow', 'indigo', 'rose'
    ];
    
    const colorIndex = teamIndex % baseColors.length;
    return baseColors[colorIndex];
  };

  const handleAddTeam = () => {
    const newTeamIndex = teams.length;
    const newColor = getColorForTeam(newTeamIndex);
    const newTeam = {
      name: `Team ${newTeamIndex + 1}`,
      color: newColor
    };
    
    setTeams([...teams, newTeam]);
    toast.success(`Added ${newTeam.name} with ${newColor} color scheme`);
  };

  const handleJobAssign = (jobId: string, date: Date) => {
    // Handle job assignment
    toast({
      title: "Job Assigned",
      description: `Job ${jobId} has been scheduled for ${format(date, 'PPP')}`,
    });
  };

  const mockJobs: Job[] = [{
    id: "1",
    customer: "John Smith",
    type: "Plumbing",
    status: "ready",
    date: "2024-03-15",
    location: [151.2093, -33.8688],
    jobNumber: "job-001",
    title: "Water Heater Installation",
    description: "Install new water heater system",
    assignedTeam: "Red Team"
  }, {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "job-002",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team"
  }, {
    id: "3",
    customer: "Mike Brown",
    type: "Electrical",
    status: "to-invoice",
    date: "2024-03-13",
    location: [151.1943, -33.8788],
    jobNumber: "job-003",
    title: "Electrical Panel Upgrade",
    description: "Upgrade main electrical panel",
    assignedTeam: "Green Team"
  }, {
    id: "4",
    customer: "Emily Davis",
    type: "Plumbing",
    status: "invoiced",
    date: "2024-03-12",
    location: [151.2153, -33.8588],
    jobNumber: "job-004",
    title: "Plumbing Repair",
    description: "Fix kitchen sink",
    assignedTeam: "Red Team"
  }];

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fadeIn px-2 sm:px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-4 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl text-gray-900 mx-[7px] my-0 px-0 py-0 font-extrabold">Managers Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center mt-4 md:mt-6 w-full max-w-screen-lg">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm flex-grow md:flex-grow-0"
            >
              <Link to="/jobs/new">New Job</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs md:text-sm flex-grow md:flex-grow-0"
            >
              <Link to="/quotes/new" className="flex items-center">
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Quote
              </Link>
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs md:text-sm flex-grow md:flex-grow-0">
              <Link to="/customers/new" className="flex items-center">
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Customer
              </Link>
            </Button>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs md:text-sm flex-grow md:flex-grow-0">
              <Link to="/payments/new" className="flex items-center">
                <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Payment
              </Link>
            </Button>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm flex-grow md:flex-grow-0">
              <Link to="/payroll/pay-run" className="flex items-center">
                <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Pay Run
              </Link>
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm flex-grow md:flex-grow-0">
              <Link to="/invoices/new" className="flex items-center">
                <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Invoice
              </Link>
            </Button>
          </div>
        </div>

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
                  <span className={`inline-block mt-1.5 md:mt-2 px-2 py-0.5 md:py-1 rounded-full text-xs ${statusColor(job.status)}`}>
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
                  <span className={`inline-block mt-1.5 md:mt-2 px-2 py-0.5 md:py-1 rounded-full text-xs ${statusColor(job.status)}`}>
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

        <div className="lg:col-span-3">
          <Card className="p-3 md:p-4">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quote Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {quoteStatuses.map(quote => (
                <div key={quote.title} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 md:gap-3">
                    <quote.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: quote.color }} />
                    <span className="font-medium text-sm md:text-base">{quote.title}</span>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-600">{quote.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          {stats.map(stat => (
            <Card key={stat.title} className="p-3 md:p-6 animate-slideUp">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mt-1 md:mt-2">
                    {stat.value}
                  </h3>
                  <p className={`text-xs md:text-sm mt-1 md:mt-2 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="animate-slideUp">
          <div className="p-3 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <div className="mt-3 md:mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-xs md:text-sm text-gray-500">
                    <th className="pb-2 md:pb-3">Customer</th>
                    <th className="pb-2 md:pb-3">Type</th>
                    <th className="pb-2 md:pb-3">Status</th>
                    <th className="pb-2 md:pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map(job => (
                    <tr key={job.id} className="border-t border-gray-100 text-xs md:text-sm">
                      <td className="py-2 md:py-3">{job.customer}</td>
                      <td className="py-2 md:py-3">{job.type}</td>
                      <td className="py-2 md:py-3">
                        <span className={`px-2 py-0.5 md:py-1 rounded-full text-xs ${statusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-2 md:py-3">{job.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Team Calendars */}
        <div className="lg:col-span-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Team Calendars Overview</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddTeam}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.name} className="p-4">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className={`text-lg font-semibold text-${team.color}-600`}>
                      {team.name}
                    </CardTitle>
                    <CardDescription>
                      View and manage team schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TeamCalendar 
                      date={sharedDate} 
                      setDate={setSharedDate} 
                      teamColor={team.color}
                      onJobAssign={handleJobAssign}
                      assignedJobs={mockJobs.filter(job => job.assignedTeam === team.name)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
