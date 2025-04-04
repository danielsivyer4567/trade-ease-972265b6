
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Loader, MessageSquare, Camera, Calendar, MapPin, Clock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface JobStep {
  id: number;
  title: string;
  tasks: {
    id: string;
    text: string;
    isCompleted: boolean;
  }[];
  isCompleted: boolean;
  notes?: string;
  images?: {
    url: string;
    note: string;
  }[];
  comments?: {
    id: string;
    author: string;
    authorAvatar?: string;
    content: string;
    timestamp: string;
    isCustomer?: boolean;
  }[];
}

interface Job {
  id: string;
  title: string;
  customer: string;
  job_number: string;
  status: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  assigned_team?: string;
  date?: string;
  job_steps?: JobStep[];
}

const CustomerProgress = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('progress');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [canComment, setCanComment] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{name: string, url: string, date: string}[]>([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*, title, customer, job_number, status, address, city, state, date, description, assigned_team, job_steps')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setJob(data);
          
          // Find current step (first incomplete)
          if (data.job_steps && data.job_steps.length > 0) {
            const currentStepIndex = data.job_steps.findIndex(step => !step.isCompleted);
            if (currentStepIndex >= 0) {
              setCurrentStep(data.job_steps[currentStepIndex].id);
            } else {
              setCurrentStep(data.job_steps[0].id);
            }
          }
          
          // Fetch related images and documents
          fetchJobImages(data.id);
          fetchJobDocuments(data.id);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Could not load job information');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);
  
  const fetchJobImages = async (jobId: string) => {
    try {
      // In a real implementation, this would fetch from storage
      // For now using placeholder images as example
      setImages([
        '/placeholder.svg',
        '/placeholder.svg',
        '/placeholder.svg'
      ]);
    } catch (error) {
      console.error('Error fetching job images:', error);
    }
  };
  
  const fetchJobDocuments = async (jobId: string) => {
    try {
      // Mock documents for example
      setDocuments([
        {name: 'Job Contract.pdf', url: '#', date: '2023-12-01'},
        {name: 'Site Assessment.pdf', url: '#', date: '2023-12-05'},
        {name: 'Material Specs.pdf', url: '#', date: '2023-12-10'}
      ]);
    } catch (error) {
      console.error('Error fetching job documents:', error);
    }
  };
  
  const handleSubmitComment = async (stepId: number) => {
    if (!newComment.trim() || !id || !customerName) return;
    
    // Save comment to database
    try {
      // First get current job steps
      const { data: jobData } = await supabase
        .from('jobs')
        .select('job_steps')
        .eq('id', id)
        .single();
      
      if (!jobData || !jobData.job_steps) return;
      
      // Update the steps with the new comment
      const updatedSteps = jobData.job_steps.map((step: JobStep) => {
        if (step.id === stepId) {
          const newCommentObj = {
            id: Date.now().toString(),
            author: customerName,
            content: newComment,
            timestamp: new Date().toISOString(),
            isCustomer: true
          };
          
          return {
            ...step,
            comments: step.comments ? [...step.comments, newCommentObj] : [newCommentObj]
          };
        }
        return step;
      });
      
      // Save back to database
      const { error } = await supabase
        .from('jobs')
        .update({ job_steps: updatedSteps })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      if (job) {
        setJob({
          ...job,
          job_steps: updatedSteps
        });
      }
      
      setNewComment('');
      toast.success('Comment added successfully');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };
  
  const renderProgressBar = () => {
    if (!job || !job.job_steps || job.job_steps.length === 0) return null;
    
    const totalSteps = job.job_steps.length;
    const completedSteps = job.job_steps.filter(step => step.isCompleted).length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress: {completedSteps} of {totalSteps} steps completed</span>
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
  
  const handleAuthenticate = () => {
    if (customerEmail && customerName) {
      setCanComment(true);
      toast.success('You can now add comments to the progress');
    } else {
      toast.error('Please enter your name and email to continue');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading job progress...</p>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job progress you're looking for doesn't exist or may have been removed.</p>
          <p className="text-gray-500 text-sm">If you believe this is an error, please contact the company that provided this link.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title || `Job #${job.job_number}`}</h1>
              <p className="text-gray-500">Customer: {job.customer}</p>
            </div>
            <Badge variant="outline" className={
              job.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              job.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
              'bg-yellow-50 text-yellow-700 border-yellow-200'
            }>
              {job.status}
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {job.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-500">
                      {job.address}, {job.city}, {job.state}
                    </p>
                  </div>
                </div>
              )}
              
              {job.date && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Scheduled Date</p>
                    <p className="text-sm text-gray-500">{job.date}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {job.assigned_team && (
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Assigned Team</p>
                    <p className="text-sm text-gray-500">{job.assigned_team}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Job Number</p>
                  <p className="text-sm text-gray-500">{job.job_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            {renderProgressBar()}
            
            <div className="flex items-center space-x-2 overflow-x-auto py-4">
              {job.job_steps && job.job_steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-2
                    ${currentStep === step.id ? 'border-blue-500 shadow-md' : 'border-gray-200'} 
                    ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}
                  `}
                  onClick={() => setCurrentStep(step.id)}
                  title={step.title}
                >
                  {step.isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="mt-0">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {job.job_steps && job.job_steps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`border rounded-lg overflow-hidden
                      ${currentStep === step.id ? 'ring-2 ring-blue-500' : ''}
                      ${step.isCompleted ? 'bg-green-50' : 'bg-white'}
                    `}
                  >
                    <div className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center
                            ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                          `}
                        >
                          {step.isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs">{step.id}</span>}
                        </div>
                        <h3 className="font-medium">{step.title}</h3>
                      </div>
                      
                      {step.isCompleted ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {step.tasks && step.tasks.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Tasks</h4>
                          {step.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2">
                              <div 
                                className={`w-5 h-5 rounded-full flex items-center justify-center border
                                  ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-transparent'}
                                `}
                              >
                                {task.isCompleted && <Check className="h-3 w-3" />}
                              </div>
                              <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>
                                {task.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {step.notes && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="font-medium text-sm mb-1">Notes</h4>
                          <p className="text-sm text-gray-700">{step.notes}</p>
                        </div>
                      )}
                      
                      {step.images && step.images.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Images</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {step.images.map((img, index) => (
                              <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                  src={img.url} 
                                  alt={`Progress image ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Comments section within each step */}
                      <div className="pt-3 mt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <h4 className="font-medium text-sm">Comments</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {step.comments && step.comments.length > 0 ? (
                            step.comments.map((comment) => (
                              <div 
                                key={comment.id} 
                                className={`p-3 rounded-lg ${comment.isCustomer ? 'bg-blue-50 ml-6' : 'bg-gray-50 mr-6'}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    {comment.authorAvatar && (
                                      <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                                    )}
                                    <AvatarFallback>
                                      {comment.author.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{comment.author}</span>
                                  <span className="text-xs text-gray-500 ml-auto">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">No comments yet</p>
                          )}
                        </div>
                        
                        {/* Comment input form */}
                        {!canComment ? (
                          <div className="bg-gray-50 p-4 rounded-lg mt-3">
                            <h4 className="font-medium text-sm mb-2">Add Your Comment</h4>
                            <div className="space-y-2 mb-3">
                              <Input 
                                placeholder="Your name" 
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                              />
                              <Input 
                                placeholder="Your email" 
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleAuthenticate}>Authenticate</Button>
                          </div>
                        ) : (
                          <div className="mt-3 space-y-2">
                            <Textarea
                              placeholder="Add your comment here..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <Button 
                                onClick={() => handleSubmitComment(step.id)}
                                disabled={!newComment.trim()}
                              >
                                Send Comment
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="photos" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                {images.length > 0 ? (
                  <ImagesGrid images={images} title="Job Photos" />
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Photos Yet</h3>
                    <p className="text-gray-500">Photos will appear here as work progresses.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">Added on {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} download>
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-300">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents Yet</h3>
                    <p className="text-gray-500">Documents will appear here as they become available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <h3 className="font-medium mb-2">Send a message to the team</h3>
                    {!canComment ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 mb-3">
                          <Input 
                            placeholder="Your name" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                          <Input 
                            placeholder="Your email" 
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAuthenticate}>Authenticate</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Type your message here..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => handleSubmitComment(currentStep || 1)}
                            disabled={!newComment.trim()}
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Message History</h3>
                    <div className="space-y-3">
                      {job.job_steps && job.job_steps.flatMap(step => step.comments || []).length > 0 ? (
                        job.job_steps
                          .flatMap(step => (step.comments || []).map(comment => ({...comment, stepId: step.id})))
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((comment) => (
                            <div 
                              key={comment.id} 
                              className={`p-3 rounded-lg ${comment.isCustomer ? 'bg-blue-50 ml-6' : 'bg-gray-50 mr-6'}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  {comment.authorAvatar && (
                                    <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                                  )}
                                  <AvatarFallback>
                                    {comment.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{comment.author}</span>
                                <Badge variant="outline" className="text-xs">Step {comment.stepId}</Badge>
                                <span className="text-xs text-gray-500 ml-auto">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-center py-8 text-gray-500">No messages yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              This is a protected customer portal for tracking job progress.
            </p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Contact: (555) 123-4567</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerProgress;
