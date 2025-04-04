
import React, { useState, useEffect } from 'react';
import { Check, Loader, Maximize2, MessageSquare, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface JobStep {
  id: number;
  title: string;
  tasks: {
    id: string;
    text: string;
    isCompleted: boolean;
  }[];
  isCompleted: boolean;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  taskId: string;
  tags: string[];
}

export const JobStepProgress = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    toast: uiToast
  } = useToast();
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [jobDetails, setJobDetails] = useState<{assignedTeam?: string, teamColor?: string}>({});
  const [loading, setLoading] = useState(false);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [savingStepId, setSavingStepId] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [tag, setTag] = useState("");
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
  const [customerNotificationsEnabled, setCustomerNotificationsEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  useEffect(() => {
    // Get existing job steps from database if available
    const fetchJobSteps = async () => {
      if (id) {
        setLoading(true);
        const {
          data,
          error
        } = await supabase
          .from('jobs')
          .select('job_steps, assigned_team')
          .eq('id', id)
          .single();

        if (data) {
          // Get assigned team info
          setJobDetails({
            assignedTeam: data.assigned_team,
            teamColor: getTeamColor(data.assigned_team)
          });
          
          if (data.job_steps && !error) {
            // Ensure each task has an id and isCompleted property
            const formattedSteps = data.job_steps.map((step: any) => ({
              ...step,
              tasks: step.tasks.map((task: string, index: number) => ({
                id: `${step.id}-${index}`,
                text: task,
                isCompleted: false
              }))
            }));
            setJobSteps(formattedSteps);
            
            // Find current step (first incomplete)
            const currentStepIndex = formattedSteps.findIndex((s: JobStep) => !s.isCompleted);
            if (currentStepIndex >= 0) {
              setCurrentStep(formattedSteps[currentStepIndex].id);
            } else {
              setCurrentStep(formattedSteps[0]?.id || null);
            }
          } else {
            createDefaultSteps();
          }
        } else {
          createDefaultSteps();
        }
        setLoading(false);
      }
    };
    
    fetchJobSteps();
  }, [id]);
  
  const getTeamColor = (teamName?: string) => {
    if (!teamName) return "bg-gray-400"; // Default color
    
    // Map team names to colors
    const teamColors: Record<string, string> = {
      "Team A": "bg-blue-500",
      "Team B": "bg-green-500",
      "Team C": "bg-purple-500",
      "Team D": "bg-orange-500",
      "Team E": "bg-pink-500"
    };
    
    return teamColors[teamName] || "bg-gray-400";
  };

  const createDefaultSteps = () => {
    // Create default job steps
    const defaultSteps = [{
      id: 1,
      title: 'step 1-',
      tasks: [{
        id: '1-0',
        text: '-schedule job date',
        isCompleted: false
      }, {
        id: '1-1',
        text: '-allocate staff',
        isCompleted: false
      }],
      isCompleted: false
    }, {
      id: 2,
      title: 'step 2-',
      tasks: [{
        id: '2-0',
        text: '-order materials',
        isCompleted: false
      }, {
        id: '2-1',
        text: '-fill out job details',
        isCompleted: false
      }, {
        id: '2-2',
        text: '- management sign off',
        isCompleted: false
      }],
      isCompleted: false
    }, {
      id: 3,
      title: 'step 3-',
      tasks: [{
        id: '3-0',
        text: '-start job',
        isCompleted: false
      }, {
        id: '3-1',
        text: '-inductions',
        isCompleted: false
      }, {
        id: '3-2',
        text: '-material count check',
        isCompleted: false
      }],
      isCompleted: false
    }, {
      id: 4,
      title: 'step 4-',
      tasks: [{
        id: '4-0',
        text: '- complete job',
        isCompleted: false
      }, {
        id: '4-1',
        text: '- do quality check',
        isCompleted: false
      }, {
        id: '4-2',
        text: '- site clean up',
        isCompleted: false
      }, {
        id: '4-3',
        text: '- add any variations',
        isCompleted: false
      }],
      isCompleted: false
    }, {
      id: 5,
      title: 'step5-',
      tasks: [{
        id: '5-0',
        text: '- verify customer is happy',
        isCompleted: false
      }, {
        id: '5-1',
        text: '- customer to sign job is complete as per contract',
        isCompleted: false
      }, {
        id: '5-2',
        text: '-take pics and double check all documents.',
        isCompleted: false
      }, {
        id: '5-3',
        text: '-send invoices with variations',
        isCompleted: false
      }],
      isCompleted: false
    }, {
      id: 6,
      title: 'step 6',
      tasks: [{
        id: '6-0',
        text: '- mark invoices paid to finalise job',
        isCompleted: false
      }, {
        id: '6-1',
        text: '-automaticly sync to xero',
        isCompleted: false
      }],
      isCompleted: false
    }];
    
    setJobSteps(defaultSteps);
    setCurrentStep(1);
  };
  
  const saveJobSteps = async (updatedSteps: JobStep[]) => {
    if (id) {
      const {
        error
      } = await supabase.from('jobs').update({
        job_steps: updatedSteps
      }).eq('id', id);
      if (error) {
        uiToast({
          title: "Error saving progress",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // If customer notifications are enabled, send a notification
      if (customerNotificationsEnabled) {
        // This would normally connect to a notification service
        console.log("Sending customer notification about step update");
        // In a real implementation, you would call an API to send the notification
      }
      
      return true;
    }
    return false;
  };
  
  const handleTaskCompletion = async (stepId: number, taskId: string) => {
    setSavingTaskId(taskId);
    const updatedSteps = jobSteps.map(step => {
      if (step.id === stepId) {
        const updatedTasks = step.tasks.map(task => task.id === taskId ? {
          ...task,
          isCompleted: !task.isCompleted
        } : task);

        // Check if all tasks are completed
        const allTasksCompleted = updatedTasks.every(task => task.isCompleted);
        return {
          ...step,
          tasks: updatedTasks,
          isCompleted: allTasksCompleted
        };
      }
      return step;
    });
    setJobSteps(updatedSteps);
    
    // Update current step if needed
    updateCurrentStep(updatedSteps);
    
    const saved = await saveJobSteps(updatedSteps);
    if (saved) {
      const task = updatedSteps.find(s => s.id === stepId)?.tasks.find(t => t.id === taskId);
      uiToast({
        title: task?.isCompleted ? "Task completed" : "Task reopened",
        description: `Task has been ${task?.isCompleted ? 'marked as complete' : 'reopened'}.`
      });
    }
    setSavingTaskId(null);
  };
  
  const handleStepCompletion = async (stepId: number) => {
    setSavingStepId(stepId);
    const stepToUpdate = jobSteps.find(step => step.id === stepId);
    const newCompletionState = !stepToUpdate?.isCompleted;
    const updatedSteps = jobSteps.map(step => step.id === stepId ? {
      ...step,
      isCompleted: newCompletionState,
      tasks: step.tasks.map(task => ({
        ...task,
        isCompleted: newCompletionState
      }))
    } : step);
    
    setJobSteps(updatedSteps);
    
    // Update current step
    updateCurrentStep(updatedSteps);
    
    const saved = await saveJobSteps(updatedSteps);
    if (saved) {
      const completedStep = updatedSteps.find(s => s.id === stepId);
      uiToast({
        title: completedStep?.isCompleted ? "Step completed" : "Step reopened",
        description: `${completedStep?.title} has been ${completedStep?.isCompleted ? 'marked as complete' : 'reopened'}.`
      });
    }
    setSavingStepId(null);
  };
  
  const updateCurrentStep = (steps: JobStep[]) => {
    // Find the first incomplete step
    const firstIncompleteIndex = steps.findIndex(step => !step.isCompleted);
    if (firstIncompleteIndex >= 0) {
      setCurrentStep(steps[firstIncompleteIndex].id);
    } else if (steps.length > 0) {
      // If all steps complete, stay on the last one
      setCurrentStep(steps[steps.length - 1].id);
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Open comment dialog for a specific task
  const openCommentDialog = (taskId: string) => {
    setCurrentTaskId(taskId);
    setCommentDialogOpen(true);
    setComment("");
    setTag("");
  };
  
  // Add a comment with optional tag
  const addComment = () => {
    if (!currentTaskId || !comment.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      author: "Current User", // In a real app, this would be the logged-in user
      createdAt: new Date().toISOString(),
      taskId: currentTaskId,
      tags: tag ? [tag] : []
    };
    
    setComments(prev => ({
      ...prev,
      [currentTaskId]: [...(prev[currentTaskId] || []), newComment]
    }));
    
    toast.success("Comment added successfully");
    setCommentDialogOpen(false);
    setComment("");
    setTag("");
  };
  
  // Generate and share a progress link
  const shareProgressLink = () => {
    const progressLink = `${window.location.origin}/progress/${id}`;
    navigator.clipboard.writeText(progressLink);
    toast.success("Progress link copied to clipboard");
    setShareLinkDialogOpen(false);
    
    // In a real app, you might want to save this link or send it directly to the customer
  };
  
  // Toggle customer notifications
  const toggleCustomerNotifications = () => {
    setCustomerNotificationsEnabled(!customerNotificationsEnabled);
    toast.success(`Customer notifications ${!customerNotificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  // Visual progress indicator showing how many steps are complete
  const completedSteps = jobSteps.filter(step => step.isCompleted).length;
  const progressPercentage = jobSteps.length > 0 ? (completedSteps / jobSteps.length) * 100 : 0;
  
  if (loading) {
    return <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-500">Loading job progress...</span>
      </div>;
  }
  
  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Job Progress</h2>
          <div className="bg-slate-100 rounded-full h-8 px-3 flex items-center">
            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}% Complete</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShareLinkDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Step indicators showing current progress with team color */}
      <div className="flex items-center space-x-3 mb-6 overflow-x-auto py-2">
        {jobSteps.map((step) => (
          <div
            key={step.id}
            onClick={() => handleStepCompletion(step.id)}
            className={`flex-shrink-0 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center
              ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} 
              ${currentStep === step.id ? `border-2 border-${jobDetails.teamColor?.replace('bg-', '')} shadow-md` : 'border-2 border-white'}
            `}
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
      
      {/* Display team indicator if a team is assigned */}
      {jobDetails.assignedTeam && (
        <div className="flex items-center mb-4 bg-white p-2 rounded-lg shadow-sm">
          <div className={`w-4 h-4 rounded-full ${jobDetails.teamColor} mr-2`}></div>
          <span className="text-sm">This job is assigned to: <span className="font-medium">{jobDetails.assignedTeam}</span></span>
        </div>
      )}
      
      <div className="space-y-6 mb-6">
        {jobSteps.map((step) => (
          <div key={step.id} className={`border rounded-lg overflow-hidden
            ${currentStep === step.id ? `ring-2 ring-${jobDetails.teamColor?.replace('bg-', '')}` : ''}
          `}>
            <div 
              className={`p-3 flex justify-between items-center cursor-pointer ${
                step.isCompleted ? 'bg-green-50 border-green-200' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={step.isCompleted} 
                  onCheckedChange={() => handleStepCompletion(step.id)}
                  disabled={savingStepId === step.id}
                  className={step.isCompleted ? 'bg-green-500 text-white border-green-500' : ''}
                />
                <h3 className="font-medium">{step.title}</h3>
              </div>
              
              <div className="text-sm text-gray-500">
                {step.tasks.filter(t => t.isCompleted).length}/{step.tasks.length} tasks
              </div>
            </div>
            
            <div className="p-3 space-y-2 bg-white">
              {step.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={task.isCompleted} 
                      onCheckedChange={() => handleTaskCompletion(step.id, task.id)}
                      disabled={savingTaskId === task.id}
                      className={task.isCompleted ? 'bg-green-500 text-white border-green-500' : ''}
                    />
                    <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>{task.text}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openCommentDialog(task.id)}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {comments[task.id]?.length ? comments[task.id].length : 0}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment or Tag</DialogTitle>
            <DialogDescription>
              Add a comment to this task. You can also tag team members or the customer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <Textarea 
              placeholder="Enter your comment here..." 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              className="min-h-[100px]"
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Tag someone (optional)</p>
              <Input 
                placeholder="@manager, @worker, @customer" 
                value={tag} 
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button onClick={addComment} disabled={!comment.trim()}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Progress Link Dialog */}
      <Dialog open={shareLinkDialogOpen} onOpenChange={setShareLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Progress with Customer</DialogTitle>
            <DialogDescription>
              Generate a link that lets your customer view the current job progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enable-notifications" 
                checked={customerNotificationsEnabled}
                onCheckedChange={() => toggleCustomerNotifications()}
              />
              <label htmlFor="enable-notifications" className="text-sm">
                Send notifications when progress updates
              </label>
            </div>
            
            <Input 
              value={`${window.location.origin}/progress/${id}`}
              readOnly
              className="font-mono text-sm"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={shareProgressLink}>Copy Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
