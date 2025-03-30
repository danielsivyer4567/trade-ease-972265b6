
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobActions } from "./JobActions";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

interface JobTableProps {
  searchQuery: string;
}

export function JobTable({ searchQuery }: JobTableProps) {
  const navigate = useNavigate();
  
  // Sample jobs data
  const jobs = [
    {
      id: "1",
      title: "Plumbing Repair",
      customer: "John Smith",
      jobNumber: "PLM-001",
      type: "Plumbing",
      status: "in-progress",
      date: "2023-05-15",
      location: "Gold Coast, QLD",
      team: "Team Blue"
    },
    {
      id: "2",
      title: "Electrical Installation",
      customer: "Sarah Johnson",
      jobNumber: "ELE-001",
      type: "Electrical",
      status: "ready",
      date: "2023-05-16",
      location: "Southport, QLD",
      team: "Team Red"
    },
    {
      id: "3",
      title: "HVAC Maintenance",
      customer: "Michael Brown",
      jobNumber: "HVAC-001",
      type: "HVAC",
      status: "to-invoice",
      date: "2023-05-17",
      location: "Broadbeach, QLD",
      team: "Team Green"
    }
  ];
  
  // Filter jobs based on search query
  const filteredJobs = searchQuery
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="font-medium">Job Number</TableHead>
              <TableHead className="font-medium">Customer</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Team</TableHead>
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
                  <TableCell className="font-medium">{job.jobNumber}</TableCell>
                  <TableCell>{job.customer}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status as any} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span>{job.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {job.team}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <JobActions 
                      jobId={job.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No jobs match your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
