import React, { useState, useEffect } from 'react';
import { Check, Loader, Maximize2, Minimize2, MessageSquare, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

const defaultSteps: JobStep[] = [{
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
}];

export const JobStepProgress = () => {
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  const [jobSteps, setJobSteps] = useState<JobStep[]>(defaultSteps);
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchJobSteps = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('job_steps, assigned_team')
          .eq('id', id)
          .single();

        if (data && !error) {
          setJobDetails({
            assignedTeam: data.assigned_team,
            teamColor: getTeamColor(data.assigned_team)
          });
          
          if (data.job_steps) {
            const formattedSteps = data.job_steps.map((step: any) => ({
              ...step,
              tasks: step.tasks.map((task: string, index: number) => ({
                id: `${step.id}-${index}`,
                text: task,
                isCompleted: false
              }))
            }));
            setJobSteps(formattedSteps);
            
            const currentStepIndex = formattedSteps.findIndex((s: JobStep) => !s.isCompleted);
            setCurrentStep(currentStepIndex >= 0 ? formattedSteps[currentStepIndex].id : formattedSteps[0]?.id || null);
          }
        }
      } catch (err) {
        console.error('Error fetching job steps:', err);
        toast.error('Failed to load job steps');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobSteps();
  }, [id]);
  
  const getTeamColor = (teamName?: string) => {
    if (!teamName) return "bg-gray-400";
    
    const teamColors: Record<string, string> = {
      "Team A": "bg-blue-500",
      "Team B": "bg-green-500",
      "Team C": "bg-purple-500",
      "Team D": "bg-orange-500",
      "Team E": "bg-pink-500"
    };
    
    return teamColors[teamName] || "bg-gray-400";
  };

  const saveJobSteps = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ job_steps: jobSteps })
        .eq('id', id);

      if (error) throw error;
      toast.success('Progress saved successfully');
    } catch (err) {
      console.error('Error saving job steps:', err);
      toast.error('Failed to save progress');
    }
  };

  const handleTaskCompletion = async (stepId: number, taskId: string, isCompleted: boolean) => {
    setSavingTaskId(taskId);
    try {
      const updatedSteps = jobSteps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            tasks: step.tasks.map(task => 
              task.id === taskId ? { ...task, isCompleted } : task
            )
          };
        }
        return step;
      });
      
      setJobSteps(updatedSteps);
      await saveJobSteps();
    } finally {
      setSavingTaskId(null);
    }
  };

  const handleStepCompletion = async (stepId: number, isCompleted: boolean) => {
    setSavingStepId(stepId);
    try {
      const updatedSteps = jobSteps.map(step => 
        step.id === stepId ? { ...step, isCompleted } : step
      );
      
      setJobSteps(updatedSteps);
      await saveJobSteps();
      
      if (isCompleted) {
        const nextStep = jobSteps.find(s => s.id > stepId && !s.isCompleted);
        if (nextStep) setCurrentStep(nextStep.id);
      }
    } finally {
      setSavingStepId(null);
    }
  };

  const handleAddComment = async () => {
    if (!currentTaskId || !comment.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Current User', // Replace with actual user
      createdAt: new Date().toISOString(),
      taskId: currentTaskId,
      tags: tag ? [tag] : []
    };

    setComments(prev => ({
      ...prev,
      [currentTaskId]: [...(prev[currentTaskId] || []), newComment]
    }));

    setComment('');
    setTag('');
    setCommentDialogOpen(false);
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const toggleExpanded = () => setIsExpanded(prev => !prev);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Job Progress</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleExpanded}
          >
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShareLinkDialogOpen(true)}
          >
            <Share2 />
          </Button>
        </div>
      </div>

      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          {jobSteps.map((step) => (
            <div
              key={step.id}
              className={`mb-4 p-4 rounded-lg border ${
                currentStep === step.id ? jobDetails.teamColor || 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={step.isCompleted}
                    onCheckedChange={(checked) => handleStepCompletion(step.id, checked as boolean)}
                    disabled={!!savingStepId}
                  />
                  <h3 className="font-medium">{step.title}</h3>
                </div>
                {savingStepId === step.id && <Loader className="animate-spin" />}
              </div>

              <div className="ml-6">
                {step.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={(checked) => handleTaskCompletion(step.id, task.id, checked as boolean)}
                        disabled={!!savingTaskId}
                      />
                      <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>
                        {task.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {savingTaskId === task.id && <Loader className="animate-spin" />}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentTaskId(task.id);
                          setCommentDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comments[task.id]?.length > 0 && (
                          <span className="ml-1">{comments[task.id].length}</span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to track progress or note important information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
            />
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag (optional)"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareLinkDialogOpen} onOpenChange={setShareLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Progress</DialogTitle>
            <DialogDescription>
              Share the job progress with stakeholders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={customerNotificationsEnabled}
                onCheckedChange={(checked) => setCustomerNotificationsEnabled(checked as boolean)}
              />
              <label htmlFor="notifications">Enable customer notifications</label>
            </div>
            <Input
              readOnly
              value={`${window.location.origin}/jobs/${id}/progress`}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShareLinkDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
