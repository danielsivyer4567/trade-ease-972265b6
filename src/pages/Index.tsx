import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/ui/AppLayout";
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  Users, 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  XSquare,
  Plus,
  Briefcase,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JobMap from "@/components/JobMap";
import type { Job } from "@/types/job";

const stats = [
  {
    title: "Active Jobs",
    value: "12",
    icon: Calendar,
    change: "+2 from last week",
    trend: "up",
  },
  {
    title: "Pending Quotes",
    value: "8",
    icon: FileText,
    change: "-3 from last week",
    trend: "down",
  },
  {
    title: "Total Customers",
    value: "156",
    icon: Users,
    change: "+5 this month",
    trend: "up",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,500",
    icon: DollarSign,
    change: "+15% vs last month",
    trend: "up",
  },
];

const allJobs: Job[] = [
  {
    id: "1",
    customer: "John Smith",
    type: "Plumbing Repair",
    status: "In Progress",
    date: "Today",
    location: [151.2093, -33.8688] as [number, number],
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    type: "Electrical Installation",
    status: "Scheduled",
    date: "Tomorrow",
    location: [151.2543, -33.8688] as [number, number],
  },
  {
    id: "3",
    customer: "Mike Brown",
    type: "HVAC Maintenance",
    status: "Completed",
    date: "Yesterday",
    location: [151.1943, -33.8788] as [number, number],
  },
  {
    id: "4",
    customer: "Emma Wilson",
    type: "Kitchen Renovation",
    status: "Scheduled",
    date: "Tomorrow",
    location: [151.2153, -33.8588] as [number, number],
  },
];

const todaysJobs = allJobs.filter(job => job.date === "Today");
const tomorrowsJobs = allJobs.filter(job => job.date === "Tomorrow");

const quoteStatuses = [
  { title: "Accepted Quotes", icon: CheckSquare, color: "#10B981", count: "5" },
  { title: "Awaiting Acceptance", icon: Clock, color: "#F59E0B", count: "3" },
  { title: "Replied Quotes", icon: MessageSquare, color: "#3B82F6", count: "2" },
  { title: "Denied Quotes", icon: XSquare, color: "#EF4444", count: "1" },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back to Trade Ease</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" /> New Job
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" /> New Quote
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" /> New Customer
          </Button>
          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <DollarSign className="w-4 h-4 mr-1" /> New Payment
          </Button>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <CalendarIcon className="w-4 h-4 mr-1" /> Pay Run
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <FileText className="w-4 h-4 mr-1" /> New Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Job Locations</h2>
              <JobMap jobs={[...todaysJobs, ...tomorrowsJobs]} />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Today's Jobs</h2>
                <div className="space-y-3">
                  {todaysJobs.map(job => (
                    <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{job.customer}</div>
                      <div className="text-sm text-gray-500">{job.type}</div>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                          job.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : job.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                  {todaysJobs.length === 0 && (
                    <p className="text-gray-500 text-sm">No jobs scheduled for today</p>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Tomorrow's Jobs</h2>
                <div className="space-y-3">
                  {tomorrowsJobs.map(job => (
                    <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{job.customer}</div>
                      <div className="text-sm text-gray-500">{job.type}</div>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                          job.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : job.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                  {tomorrowsJobs.length === 0 && (
                    <p className="text-gray-500 text-sm">No jobs scheduled for tomorrow</p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Quote Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quoteStatuses.map((quote) => (
                  <div 
                    key={quote.title}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <quote.icon className="w-5 h-5" style={{ color: quote.color }} />
                      <span className="font-medium">{quote.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{quote.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 animate-slideUp">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-2">
                    {stat.value}
                  </h3>
                  <p
                    className={`text-sm mt-2 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="w-6 h-6 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="animate-slideUp">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t border-gray-100 text-sm"
                    >
                      <td className="py-3">{job.customer}</td>
                      <td className="py-3">{job.type}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            job.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : job.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3">{job.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
