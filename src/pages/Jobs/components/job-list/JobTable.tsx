
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobActions } from "./JobActions";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import type { Job } from "@/types/job";

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
      assignedTeam: "Team Blue"
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
      assignedTeam: "Team Red"
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
      assignedTeam: "Team Green"
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
  
  return (
    <div className="h-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100">
            <TableHead className="font-medium">Job Number</TableHead>
            <TableHead className="font-medium">Customer</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <TableRow 
                key={job.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  <div>
                    <div>{job.jobNumber}</div>
                    <div className="text-xs text-gray-500">{job.type}</div>
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
                <TableCell onClick={(e) => e.stopPropagation()} className="whitespace-nowrap">
                  <JobActions 
                    job={job}
                    actionLoading={actionLoading}
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No jobs match your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
