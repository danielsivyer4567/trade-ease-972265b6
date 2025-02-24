
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User, Calendar, Clock, FileText, Image as ImageIcon } from "lucide-react";
import type { Job } from "@/types/job";
import React from "react";

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "in-progress",
  date: "Today",
  location: [151.2093, -33.8688],
  jobNumber: "PLM-001",
  title: "Emergency Pipe Repair",
  description: "Fix leaking pipe in basement",
  assignedTeam: "Red Team",
  assignedMemberId: "RT-001"
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "Electrical Installation",
  status: "ready",
  date: "Tomorrow",
  location: [151.2543, -33.8688],
  jobNumber: "ELE-001",
  title: "New Circuit Installation",
  description: "Install new circuit for home office",
  assignedTeam: "Blue Team"
}];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return (
      <AppLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Job not found</h1>
          <Button onClick={() => navigate("/jobs")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <span className={`px-3 py-1 rounded-full text-sm ${
            job.status === "ready" ? "bg-yellow-100 text-yellow-800" :
            job.status === "in-progress" ? "bg-blue-100 text-blue-800" :
            job.status === "to-invoice" ? "bg-purple-100 text-purple-800" :
            "bg-green-100 text-green-800"
          }`}>
            {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              {job.title || job.type}
              <span className="text-sm font-mono text-gray-500">#{job.jobNumber}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Customer:</span> {job.customer}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Date:</span> {job.date}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Location:</span> 
                  <a 
                    href={`https://www.google.com/maps?q=${job.location[1]},${job.location[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Status:</span> {job.status}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Assigned Team:</span> {job.assignedTeam || 'Unassigned'}
                </div>
                {job.assignedMemberId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Team Member ID:</span> {job.assignedMemberId}
                  </div>
                )}
              </div>
            </div>

            {job.description && (
              <div className="mt-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Description:</span>
                </div>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Job Photos:</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No photos uploaded
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
