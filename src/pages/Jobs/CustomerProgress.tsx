
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, MessageSquare, Calendar, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function CustomerProgress() {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [customerComment, setCustomerComment] = useState("");
  const [openStepId, setOpenStepId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("progress");
  
  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        // Fetch job data from Supabase
        // This endpoint should be secured with Row-Level Security
        const { data, error } = await supabase
          .from('jobs')
          .select('*, job_steps')
          .eq('id', jobId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setJob(data);
        
        // Open the first incomplete step
        if (data.job_steps && data.job_steps.length > 0) {
          const firstIncompleteStep = data.job_steps.find((step: any) => !step.isCompleted);
          if (firstIncompleteStep) {
            setOpenStepId(firstIncompleteStep.id);
          } else {
            // If all steps are complete, open the last one
            setOpenStepId(data.job_steps[data.job_steps.length - 1].id);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast("Unable to load job progress. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [jobId]);
  
  const handleSubmitComment = async (stepId: number) => {
    if (!customerComment.trim()) return;
    
    try {
      // Find the current step
      const updatedSteps = job.job_steps.map((step: any) => {
        if (step.id === stepId) {
          // Add customer comment
          return {
            ...step,
            comments: [
              ...(step.comments || []),
              {
                id: Date.now().toString(),
                content: customerComment,
                author: "Customer",
                timestamp: new Date().toISOString(),
                isCustomer: true
              }
            ]
          };
        }
        return step;
      });
      
      // Update in Supabase
      const { error } = await supabase
        .from('jobs')
        .update({ job_steps: updatedSteps })
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Update local state
      setJob({
        ...job,
        job_steps: updatedSteps
      });
      
      // Clear input
      setCustomerComment("");
      
      toast("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast("Unable to submit comment. Please try again later.");
    }
  };
  
  const calculateProgress = () => {
    if (!job?.job_steps || job.job_steps.length === 0) return 0;
    
    const completedSteps = job.job_steps.filter((step: any) => step.isCompleted).length;
    return Math.round((completedSteps / job.job_steps.length) * 100);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not scheduled";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4">
              <div className="h-20 bg-slate-200 rounded"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="text-gray-600">The job you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{job.title || "Job Progress"}</h1>
              <p className="text-gray-600">Job #: {job.job_number || jobId}</p>
            </div>
            
            <Badge variant="outline" className="text-lg">
              {calculateProgress()}% Complete
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-slate-50 p-3 rounded-md flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="font-medium">{formatDate(job.date)}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{job.status || "In Progress"}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full border-b rounded-none bg-transparent">
            <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
            <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
          </TabsList>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="mt-4 space-y-4">
            {job.job_steps?.map((step: any, index: number) => (
              <Collapsible 
                key={step.id}
                open={openStepId === step.id}
                onOpenChange={() => setOpenStepId(openStepId === step.id ? null : step.id)}
                className="border rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${step.isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                      `}
                    >
                      {index + 1}
                    </div>
                    <div className="font-medium">{step.title || `Step ${step.id}`}</div>
                    {step.isCompleted && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                  {openStepId === step.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="border-t">
                  <div className="p-4 space-y-4">
                    {/* Step notes */}
                    {step.notes && (
                      <div className="bg-slate-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-gray-600">{step.notes}</p>
                      </div>
                    )}
                    
                    {/* Step images */}
                    {step.images && step.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Photos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.images.map((image: any, imageIndex: number) => (
                            <div key={imageIndex} className="border rounded-lg overflow-hidden">
                              <div className="aspect-video bg-gray-100">
                                <img 
                                  src={image.url} 
                                  alt={`Step ${step.id} image ${imageIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {image.note && (
                                <div className="p-2 bg-slate-50">
                                  <p className="text-sm">{image.note}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Comments section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" /> 
                        Comments
                      </h4>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {step.comments && step.comments.length > 0 ? (
                          step.comments.map((comment: any) => (
                            <div 
                              key={comment.id} 
                              className={`p-3 rounded-lg ${comment.isCustomer ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border'}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  {comment.authorAvatar ? (
                                    <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                                  ) : (
                                    <AvatarFallback className={comment.isCustomer ? 'bg-blue-100' : 'bg-slate-200'}>
                                      {(comment.author || "U").charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="text-sm font-medium">{comment.author || "User"}</div>
                                <div className="text-xs text-gray-500 ml-auto">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            No comments yet
                          </div>
                        )}
                      </div>
                      
                      {/* Customer comment input */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add your comment or question..."
                          value={customerComment}
                          onChange={(e) => setCustomerComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button 
                          onClick={() => handleSubmitComment(step.id)}
                          disabled={!customerComment.trim()}
                          className="w-full sm:w-auto"
                        >
                          Send Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TabsContent>
          
          {/* Photos Tab */}
          <TabsContent value="photos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Job Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Collect all photos from all steps */}
                {job.job_steps?.some((step: any) => step.images && step.images.length > 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {job.job_steps
                      .flatMap((step: any) => 
                        (step.images || []).map((img: any) => ({
                          ...img,
                          stepId: step.id,
                          stepTitle: step.title || `Step ${step.id}`
                        }))
                      )
                      .map((image: any, idx: number) => (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                          <div className="aspect-video bg-gray-100">
                            <img 
                              src={image.url} 
                              alt={`Job image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2 bg-slate-50">
                            <p className="text-xs font-medium text-gray-500">
                              {image.stepTitle}
                            </p>
                            {image.note && <p className="text-sm mt-1">{image.note}</p>}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    No photos have been uploaded yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Messages Tab - Collect all comments in one place */}
          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  All Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.job_steps?.some((step: any) => step.comments && step.comments.length > 0) ? (
                    job.job_steps
                      .flatMap((step: any) => 
                        (step.comments || []).map((comment: any) => ({
                          ...comment,
                          stepId: step.id,
                          stepTitle: step.title || `Step ${step.id}`
                        }))
                      )
                      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((comment: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-lg ${comment.isCustomer ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border'}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              {comment.authorAvatar ? (
                                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                              ) : (
                                <AvatarFallback className={comment.isCustomer ? 'bg-blue-100' : 'bg-slate-200'}>
                                  {(comment.author || "U").charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="text-sm font-medium">{comment.author || "User"}</div>
                            <Badge variant="outline" className="ml-2">{comment.stepTitle}</Badge>
                            <div className="text-xs text-gray-500 ml-auto">
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      No messages yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
