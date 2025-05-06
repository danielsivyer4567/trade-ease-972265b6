import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobActions } from "./JobActions";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import type { Job } from "@/types/job";
import { Progress } from "@/components/ui/progress";

interface JobTableProps {
  searchQuery?: string;
  jobs?: Job[];
  actionLoading?: string | null;
  onStatusChange?: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export function JobTable({ 
  searchQuery = "", 
  jobs: propJobs, 
  actionLoading = null,
  onStatusChange = async () => {} 
}: JobTableProps) {
  const navigate = useNavigate();
  
  // Sample jobs data - use prop jobs if provided, otherwise use sample data
  const defaultJobs = [
    {
      id: "1",
      title: "Plumbing Repair",
      customer: "John Smith",
      jobNumber: "PLM-001",
      type: "Plumbing",
      status: "in-progress" as "in-progress",
      date: "2023-05-15",
      location: [151.2093, -33.8688] as [number, number],
      // Adding multiple locations example
      locations: [
        {
          coordinates: [151.2093, -33.8688] as [number, number],
          address: "123 Main St, Sydney NSW",
          label: "Primary Site"
        },
        {
          coordinates: [151.2293, -33.8888] as [number, number],
          address: "456 Second St, Sydney NSW",
          label: "Secondary Site"
        }
      ],
      assignedTeam: "Team Blue",
      job_steps: [
        { id: 1, title: "Initial Assessment", tasks: [], isCompleted: true },
        { id: 2, title: "Parts Procurement", tasks: [], isCompleted: true },
        { id: 3, title: "Installation", tasks: [], isCompleted: false },
        { id: 4, title: "Testing", tasks: [], isCompleted: false },
      ]
    },
    {
      id: "2",
      title: "Electrical Installation",
      customer: "Sarah Johnson",
      jobNumber: "ELE-001",
      type: "Electrical",
      status: "ready" as "ready",
      date: "2023-05-16",
      location: [151.2093, -33.8688] as [number, number],
      // Adding multiple locations example
      locations: [
        {
          coordinates: [151.2093, -33.8688] as [number, number],
          address: "789 Park Ave, Sydney NSW",
          label: "Main Building"
        },
        {
          coordinates: [151.2193, -33.8788] as [number, number],
          address: "790 Park Ave, Sydney NSW",
          label: "Warehouse"
        },
        {
          coordinates: [151.2293, -33.8888] as [number, number],
          address: "800 Park Ave, Sydney NSW",
          label: "Office Building"
        }
      ],
      assignedTeam: "Team Red",
      job_steps: [
        { id: 1, title: "Initial Consultation", tasks: [], isCompleted: true },
        { id: 2, title: "Quote Provided", tasks: [], isCompleted: true },
        { id: 3, title: "Materials Ordered", tasks: [], isCompleted: true },
        { id: 4, title: "Installation", tasks: [], isCompleted: false },
        { id: 5, title: "Testing", tasks: [], isCompleted: false },
      ]
    },
    {
      id: "3",
      title: "HVAC Maintenance",
      customer: "Michael Brown",
      jobNumber: "HVAC-001",
      type: "HVAC",
      status: "to-invoice" as "to-invoice",
      date: "2023-05-17",
      location: [151.2093, -33.8688] as [number, number],
      assignedTeam: "Team Green",
      job_steps: [
        { id: 1, title: "System Inspection", tasks: [], isCompleted: true },
        { id: 2, title: "Filter Replacement", tasks: [], isCompleted: true },
        { id: 3, title: "System Cleaning", tasks: [], isCompleted: true },
        { id: 4, title: "Performance Testing", tasks: [], isCompleted: true },
      ]
    }
  ];
  
  const jobs = propJobs || defaultJobs;
  
  // Filter jobs based on search query
  const filteredJobs = searchQuery
    ? jobs.filter(job => 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;
  
  // Calculate progress for each job
  const getJobProgress = (job: Job) => {
    if (!job.job_steps || job.job_steps.length === 0) return 0;
    const completed = job.job_steps.filter(step => step.isCompleted).length;
    return Math.round((completed / job.job_steps.length) * 100);
  };
  
  return (
    <div className="h-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent border-b border-gray-200">
            <TableHead className="font-medium text-gray-700">Project</TableHead>
            <TableHead className="font-medium text-gray-700">Customer</TableHead>
            <TableHead className="font-medium text-gray-700">Status</TableHead>
            <TableHead className="font-medium text-gray-700">Progress</TableHead>
            <TableHead className="font-medium text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const progress = getJobProgress(job);
              const completedSteps = job.job_steps?.filter(s => s.isCompleted).length || 0;
              const totalSteps = job.job_steps?.length || 0;
              const locationCount = job.locations?.length || 0;
              
              return (
                <TableRow 
                  key={job.id}
                  className="hover:bg-white/50 backdrop-blur-sm cursor-pointer border-b border-gray-100"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-xs text-gray-500">#{job.jobNumber}</div>
                      {locationCount > 1 && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {locationCount} locations
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{job.customer}</div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{job.date || 'Not scheduled'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{completedSteps} of {totalSteps} steps</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()} className="whitespace-nowrap">
                    <JobActions 
                      job={job}
                      actionLoading={actionLoading}
                      onStatusChange={onStatusChange}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No jobs match your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
