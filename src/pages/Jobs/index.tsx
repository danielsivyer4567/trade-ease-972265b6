
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, ClipboardList, Repeat, AlertCircle, CheckCircle2 } from "lucide-react";
import JobMap from "@/components/JobMap";
import type { Job } from "@/types/job";

const demoJobs: Job[] = [
  {
    id: "1",
    customer: "John Smith",
    type: "Plumbing Repair",
    status: "In Progress",
    date: "Today",
    location: [151.2093, -33.8688],
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    type: "Electrical Installation",
    status: "Scheduled",
    date: "Tomorrow",
    location: [151.2543, -33.8688],
  }
];

const jobTemplates = [
  {
    id: "1",
    title: "Basic Plumbing Service",
    estimatedDuration: "2 hours",
    materials: ["Pipe wrench", "Plumber's tape", "Replacement parts"],
    price: "$150",
  },
  {
    id: "2",
    title: "Electrical Safety Inspection",
    estimatedDuration: "1.5 hours",
    materials: ["Multimeter", "Safety equipment", "Testing tools"],
    price: "$120",
  },
  {
    id: "3",
    title: "HVAC Maintenance",
    estimatedDuration: "3 hours",
    materials: ["Filters", "Cleaning supplies", "Testing equipment"],
    price: "$200",
  }
];

const recurringJobs = [
  {
    id: "1",
    customer: "Office Complex A",
    type: "Monthly HVAC Maintenance",
    frequency: "Monthly",
    nextDate: "Apr 15, 2024",
  },
  {
    id: "2",
    customer: "Residential Building B",
    type: "Quarterly Plumbing Check",
    frequency: "Quarterly",
    nextDate: "Jun 1, 2024",
  }
];

export default function Jobs() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <div className="space-x-4">
            <Button variant="outline">
              <FileText className="mr-2" />
              Job Templates
            </Button>
            <Button>
              <Plus className="mr-2" />
              New Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Active Jobs Map</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="h-[300px]">
              <JobMap jobs={demoJobs} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
            </div>
            <div className="space-y-4">
              {demoJobs.filter(job => job.date === "Today").map(job => (
                <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{job.customer}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{job.type}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Quick Templates</h2>
            </div>
            <div className="space-y-4">
              {jobTemplates.slice(0, 3).map(template => (
                <div key={template.id} className="p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.title}</h3>
                    <span className="text-sm font-medium text-gray-600">{template.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Duration: {template.estimatedDuration}</p>
                  <div className="text-xs text-gray-500">
                    Materials: {template.materials.join(", ")}
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full">View All Templates</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Repeat className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold">Recurring Jobs</h2>
            </div>
            <div className="space-y-4">
              {recurringJobs.map(job => (
                <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{job.customer}</h3>
                    <span className="text-sm text-gray-600">{job.frequency}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{job.type}</p>
                  <p className="text-xs text-gray-500">Next: {job.nextDate}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold">Attention Required</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-orange-800">Parts Needed - Job #1234</h3>
                    <p className="text-sm text-orange-700 mt-1">Special order parts required for HVAC installation at 123 Main St.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-red-800">Delayed - Job #5678</h3>
                    <p className="text-sm text-red-700 mt-1">Customer rescheduling needed for electrical work at 456 Oak Ave.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Recently Completed</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Plumbing Repair</h3>
                  <span className="text-sm text-gray-600">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">789 Pine St</p>
                <p className="text-xs text-gray-500">Completed by: Mike Johnson</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Electrical Installation</h3>
                  <span className="text-sm text-gray-600">2 days ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">321 Elm St</p>
                <p className="text-xs text-gray-500">Completed by: Sarah Smith</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
