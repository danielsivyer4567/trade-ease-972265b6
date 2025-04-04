
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Copy, Send, Link, Mail, RefreshCw, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CustomerProgressLink } from "@/pages/Customers/components/CustomerProgressLink";

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isCustomer?: boolean;
}

interface JobCustomerConversationsTabProps {
  jobId: string;
  customerName: string;
}

export const JobCustomerConversationsTab: React.FC<JobCustomerConversationsTabProps> = ({ 
  jobId,
  customerName 
}) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  
  useEffect(() => {
    // Fetch customer ID from the job's customer name
    const fetchCustomerId = async () => {
      if (!customerName) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .eq('name', customerName)
          .single();
          
        if (error) throw error;
        
        if (data?.id) {
          setCustomerId(data.id);
        }
      } catch (error) {
        console.error('Error fetching customer ID:', error);
      }
    };
    
    const fetchComments = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        
        // Fetch job data including comments stored in job_steps
        const { data, error } = await supabase
          .from('jobs')
          .select('job_steps')
          .eq('id', jobId)
          .single();
          
        if (error) throw error;
        
        if (data?.job_steps) {
          // Extract all comments from all steps
          const allComments: Comment[] = data.job_steps
            .flatMap((step: any) => step.comments || [])
            .sort((a: Comment, b: Comment) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            
          setComments(allComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        uiToast({
          title: 'Error',
          description: 'Failed to load conversation history',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerId();
    fetchComments();
  }, [jobId, customerName, uiToast]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !jobId) return;
    
    try {
      // First get current job steps
      const { data: jobData } = await supabase
        .from('jobs')
        .select('job_steps')
        .eq('id', jobId)
        .single();
      
      if (!jobData || !jobData.job_steps) return;
      
      // Create new comment
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Project Manager', // Or get from authenticated user
        content: newMessage,
        timestamp: new Date().toISOString(),
        isCustomer: false
      };
      
      // Find the current step (first incomplete one) or use the first step
      const currentStepIndex = jobData.job_steps.findIndex((step: any) => !step.isCompleted);
      const stepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
      
      // Update the steps with the new comment
      const updatedSteps = [...jobData.job_steps];
      const step = updatedSteps[stepIndex];
      
      updatedSteps[stepIndex] = {
        ...step,
        comments: step.comments ? [...step.comments, newComment] : [newComment]
      };
      
      // Save back to database
      const { error } = await supabase
        .from('jobs')
        .update({ job_steps: updatedSteps })
        .eq('id', jobId);
      
      if (error) throw error;
      
      // Update local state
      setComments([...comments, newComment]);
      setNewMessage('');
      
      toast.success('Message sent successfully');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  const handleCopyLink = () => {
    const progressLink = `${window.location.origin}/progress/${jobId}`;
    navigator.clipboard.writeText(progressLink);
    
    toast.success('Progress link copied to clipboard');
  };
  
  const handleSendEmail = () => {
    const progressLink = `${window.location.origin}/progress/${jobId}`;
    // In a real implementation, this would send an email through an API
    // For now, just simulate with a toast
    
    toast.success('Email with progress link sent to customer');
  };
  
  const refreshComments = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('job_steps')
        .eq('id', jobId)
        .single();
        
      if (error) throw error;
      
      if (data?.job_steps) {
        const allComments: Comment[] = data.job_steps
          .flatMap((step: any) => step.comments || [])
          .sort((a: Comment, b: Comment) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
        setComments(allComments);
      }
      
      toast.success('Conversation refreshed');
    } catch (error) {
      console.error('Error refreshing comments:', error);
      toast.error('Failed to refresh conversation');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Customer progress link */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {customerId ? (
              <CustomerProgressLink customerId={customerId} />
            ) : (
              <div className="p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  Customer ID not found. To generate a progress link, make sure this job is associated with a valid customer.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Customer conversation */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Conversation</CardTitle>
            <Button variant="outline" size="sm" onClick={refreshComments}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Messages</h3>
                {comments.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    Scroll to Latest
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md p-3 h-[400px] overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className={`flex ${comment.isCustomer ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            comment.isCustomer 
                              ? 'bg-white border' 
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              {comment.authorAvatar && (
                                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                              )}
                              <AvatarFallback className="text-xs">
                                {comment.author.split(' ').map(name => name[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{comment.author}</span>
                            {comment.isCustomer && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                                Customer
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <span className="text-xs text-gray-500 mt-1 block text-right">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="mb-2">No messages yet</p>
                    <p className="text-sm">Start the conversation by sending a message below</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex mb-3 gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1">
                  <Link className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSendEmail} className="gap-1">
                  <Mail className="h-4 w-4" />
                  <span>Email Link</span>
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  className="self-end"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
