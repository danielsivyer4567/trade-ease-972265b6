import React, { useState, useEffect } from 'react';
import { Check, Loader, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
export const JobStepProgress = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    toast
  } = useToast();
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [savingStepId, setSavingStepId] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    // Get existing job steps from database if available
    const fetchJobSteps = async () => {
      if (id) {
        setLoading(true);
        const {
          data,
          error
        } = await supabase.from('jobs').select('job_steps').eq('id', id).single();
        if (data && data.job_steps && !error) {
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
        } else {
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
        }
        setLoading(false);
      }
    };
    fetchJobSteps();
  }, [id]);
  const saveJobSteps = async (updatedSteps: JobStep[]) => {
    if (id) {
      const {
        error
      } = await supabase.from('jobs').update({
        job_steps: updatedSteps
      }).eq('id', id);
      if (error) {
        toast({
          title: "Error saving progress",
          description: error.message,
          variant: "destructive"
        });
        return false;
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
    const saved = await saveJobSteps(updatedSteps);
    if (saved) {
      const task = updatedSteps.find(s => s.id === stepId)?.tasks.find(t => t.id === taskId);
      toast({
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
    const saved = await saveJobSteps(updatedSteps);
    if (saved) {
      const completedStep = updatedSteps.find(s => s.id === stepId);
      toast({
        title: completedStep?.isCompleted ? "Step completed" : "Step reopened",
        description: `${completedStep?.title} has been ${completedStep?.isCompleted ? 'marked as complete' : 'reopened'}.`
      });
    }
    setSavingStepId(null);
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Visual progress indicator showing how many steps are complete
  const completedSteps = jobSteps.filter(step => step.isCompleted).length;
  const progressPercentage = jobSteps.length > 0 ? completedSteps / jobSteps.length * 100 : 0;
  if (loading) {
    return <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-500">Loading job progress...</span>
      </div>;
  }
  return;
};