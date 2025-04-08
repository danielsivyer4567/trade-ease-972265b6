
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, FileText, Image, MessageSquare, Settings, Users, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface CustomerProgressLinkProps {
  customerId: string;
}

export function CustomerProgressLink({ customerId }: CustomerProgressLinkProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [progressLink, setProgressLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");
  const [customerJobs, setCustomerJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch jobs associated with this customer
    const fetchCustomerJobs = async () => {
      if (!customerId) return;
      
      try {
        setLoading(true);
        const { data: customer } = await supabase
          .from('customers')
          .select('name')
          .eq('id', customerId)
          .single();
        
        if (customer && customer.name) {
          const { data: jobs, error } = await supabase
            .from('jobs')
            .select('id, title, job_number, status, date')
            .eq('customer', customer.name)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setCustomerJobs(jobs || []);
          if (jobs && jobs.length > 0) {
            setSelectedJobId(jobs[0].id);
            // Set the progress link for the first job
            setProgressLink(`${window.location.origin}/progress/${jobs[0].id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching customer jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerJobs();
  }, [customerId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(progressLink);
    setLinkCopied(true);
    toast({
      title: "Link copied",
      description: "Progress link copied to clipboard"
    });
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };
  
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setProgressLink(`${window.location.origin}/progress/${jobId}`);
  };
  
  const handlePreviewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (selectedJobId) {
      navigate(`/progress/${selectedJobId}`);
    } else {
      toast({
        title: "No job selected",
        description: "Please select a job to preview",
        variant: "destructive"
      });
    }
  };
  
  // Mock data for job steps
  const jobSteps = [
    { id: 1, name: "Initial Consultation", complete: true, date: "2023-12-01" },
    { id: 2, name: "Quote Provided", complete: true, date: "2023-12-05" },
    { id: 3, name: "Materials Ordered", complete: true, date: "2023-12-10" },
    { id: 4, name: "Materials Delivered", complete: false, date: null },
    { id: 5, name: "Work In Progress", complete: false, date: null },
    { id: 6, name: "Quality Check", complete: false, date: null },
    { id: 7, name: "Job Completed", complete: false, date: null }
  ];
  
  // Mock job documents
  const jobDocuments = [
    { id: 1, name: "Initial Quote.pdf", type: "quote", date: "2023-12-05" },
    { id: 2, name: "Contract Agreement.pdf", type: "contract", date: "2023-12-07" },
    { id: 3, name: "Material List.pdf", type: "materials", date: "2023-12-10" }
  ];
  
  // Mock images for carousel
  const progressImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ];
  
  // Mock comments
  const comments = [
    { 
      id: 1, 
      user: "Customer", 
      text: "When will the materials be delivered?", 
      date: "2023-12-12", 
      time: "14:30",
      replies: [
        { id: 101, user: "Project Manager", text: "Scheduled for December 15th", date: "2023-12-12", time: "15:45" }
      ]
    },
    { 
      id: 2, 
      user: "Site Supervisor", 
      text: "Updated the timeline for the next steps", 
      date: "2023-12-13", 
      time: "09:15",
      replies: []
    }
  ];
  
  const renderProgressBar = () => {
    const completedSteps = jobSteps.filter(step => step.complete).length;
    const progressPercentage = (completedSteps / jobSteps.length) * 100;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress: {completedSteps} of {jobSteps.length} steps completed</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Slider 
          value={[progressPercentage]} 
          max={100} 
          step={1}
          disabled
        />
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-56 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
          <div className="h-10 bg-slate-200 rounded w-full mb-6"></div>
          
          <div className="h-60 bg-slate-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-md p-4 border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Customer Progress Link</h3>
            <p className="text-sm text-gray-500">Share this link with your customer to keep them updated on job progress</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Enable notifications</span>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>
        
        {customerJobs.length > 0 ? (
          <>
            <div className="space-y-2">
              <label htmlFor="job-select" className="block text-sm font-medium text-gray-700">
                Select Job for Progress Link
              </label>
              <select 
                id="job-select"
                value={selectedJobId || ''}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {customerJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.job_number})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={progressLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button
                variant={linkCopied ? "default" : "outline"}
                className="shrink-0 gap-2"
                onClick={handleCopyLink}
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{linkCopied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Link className="h-4 w-4 mr-1" />
                <a href="#" onClick={handlePreviewClick}>
                  Preview Link
                </a>
              </Button>
              
              {notificationsEnabled && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Notifications Enabled
                </Badge>
              )}
            </div>
          </>
        ) : (
          <Alert>
            <AlertDescription className="text-sm">
              No jobs found for this customer. Create a job first to generate a progress link.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Progress Portal Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="w-full border-b rounded-none bg-white">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="p-4 space-y-4">
              {renderProgressBar()}
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium">Job Steps</h4>
                {jobSteps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between border rounded p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.complete ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                        {step.complete && <Check className="h-4 w-4" />}
                      </div>
                      <span className={step.complete ? 'text-black' : 'text-gray-500'}>
                        {step.name}
                      </span>
                    </div>
                    <div>
                      {step.complete ? (
                        <Badge variant="outline" className="bg-green-50">
                          Completed {step.date}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Photos Tab */}
            <TabsContent value="photos" className="p-4 space-y-4">
              <h4 className="font-medium">Job Photos</h4>
              <Carousel className="w-full">
                <CarouselContent>
                  {progressImages.map((img, index) => (
                    <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="aspect-video rounded-md overflow-hidden">
                          <img 
                            src={img} 
                            alt={`Job progress ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Photo taken on Dec 10, 2023</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              
              <ImagesGrid 
                images={progressImages} 
                title="All Photos"
              />
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="p-4 space-y-4">
              <h4 className="font-medium">Job Documents</h4>
              <div className="space-y-2">
                {jobDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{doc.date}</span>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Comments Tab */}
            <TabsContent value="comments" className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Comments & Questions</h4>
                <Button size="sm">New Comment</Button>
              </div>
              
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-50 p-3 border-b flex justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{comment.user}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {comment.date} at {comment.time}
                      </span>
                    </div>
                    <div className="p-3">
                      <p>{comment.text}</p>
                      
                      {comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-slate-50 p-2 rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{reply.user}</span>
                                <span className="text-xs text-gray-500">
                                  {reply.date} at {reply.time}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Reply</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Notification Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Email notifications</label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">SMS notifications</label>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Available Automations</h4>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-purple-500" />
                          <span>Automatic Progress Updates</span>
                        </div>
                        <Toggle>Enable</Toggle>
                      </div>
                    </div>
                    
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-purple-500" />
                          <span>Photo Notifications</span>
                        </div>
                        <Toggle>Enable</Toggle>
                      </div>
                    </div>
                    
                    <div className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-500" />
                          <span>Comment Reminders</span>
                        </div>
                        <Toggle>Enable</Toggle>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
