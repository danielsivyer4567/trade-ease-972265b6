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
  jobs = [], 
  actionLoading = null,
  onStatusChange = async () => {} 
}: JobTableProps) {
  const navigate = useNavigate();
  
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
  
  // Helper to count the number of locations
  const getLocationCount = (job: Job): number => {
    if (job.locations && job.locations.length > 0) {
      return job.locations.length;
    } else if (job.location && job.location[0] && job.location[1]) {
      return 1;
    }
    return 0;
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
              const locationCount = getLocationCount(job);
              
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
                      {locationCount > 0 && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {locationCount > 1 ? `${locationCount} locations` : '1 location'}
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
                  <TableCell>
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
