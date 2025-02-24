import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User, Calendar, Clock, FileText, Image as ImageIcon, Tag, Navigation } from "lucide-react";
import type { Job } from "@/types/job";
import React, { useState } from "react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import JobMap from "@/components/JobMap";
import { useIsMobile } from "@/hooks/use-mobile";

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "in-progress",
  date: "Today",
  location: [151.2093, -33.8688],
  address: "123 Main Street, Sydney NSW 2000",
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
  address: "45 Park Avenue, Sydney NSW 2000",
  jobNumber: "ELE-001",
  title: "New Circuit Installation",
  description: "Install new circuit for home office",
  assignedTeam: "Blue Team"
}];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = mockJobs.find(j => j.id === id);
  const isMobile = useIsMobile();

  const [quotePhotos, setQuotePhotos] = useState<string[]>([]);
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [memberToTag, setMemberToTag] = useState("");

  const handleQuotePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setQuotePhotos([...quotePhotos, ...newPhotos]);
      toast({
        title: "Photos Uploaded",
        description: `${event.target.files.length} quote inspection photos added`
      });
    }
  };

  const handleCompletionPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setCompletionPhotos([...completionPhotos, ...newPhotos]);
      toast({
        title: "Photos Uploaded",
        description: `${event.target.files.length} completion photos added`
      });
    }
  };

  const handleTagMember = () => {
    if (memberToTag) {
      toast({
        title: "Member Tagged",
        description: `${memberToTag} has been notified about this job`
      });
      setMemberToTag("");
    }
  };

  const getNavigationUrl = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [lng, lat] = job?.location || [0, 0];
    
    if (isIOS) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    } else {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    }
  };

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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Location:</span>
                    <span>{job.address}</span>
                    <div className="flex gap-2 ml-2">
                      <a 
                        href={`https://www.google.com/maps?q=${job.location[1]},${job.location[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Map
                      </a>
                      {isMobile && (
                        <a 
                          href={getNavigationUrl()}
                          className="flex items-center gap-1 text-green-600 hover:underline"
                        >
                          <Navigation className="w-4 h-4" />
                          Navigate
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="h-[200px] rounded-lg overflow-hidden border border-gray-200">
                    <JobMap jobs={[job]} />
                  </div>
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
              <div className="flex items-center justify-between gap-2 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-medium">Quote Inspection Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tag team member..."
                    value={memberToTag}
                    onChange={(e) => setMemberToTag(e.target.value)}
                    className="w-48"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTagMember}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Tag Member
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <FileUpload
                  onFileUpload={handleQuotePhotoUpload}
                  label="Upload quote inspection photos"
                />
                {quotePhotos.length > 0 ? (
                  <ImagesGrid
                    images={quotePhotos}
                    title="Quote Inspection Photos"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No quote inspection photos uploaded
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Completion Photos</span>
              </div>
              <div className="space-y-4">
                <FileUpload
                  onFileUpload={handleCompletionPhotoUpload}
                  label="Upload completion photos"
                />
                {completionPhotos.length > 0 ? (
                  <ImagesGrid
                    images={completionPhotos}
                    title="Completion Photos"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No completion photos uploaded
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
