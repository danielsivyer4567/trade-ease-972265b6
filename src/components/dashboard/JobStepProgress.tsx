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
  return <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {/* Fullscreen toggle button */}
      <div className="absolute top-2 right-2 z-10">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={toggleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Horizontal step progress bar at the top */}
      <div className="mb-8 px-2">
        <div className="flex justify-between items-center">
          {jobSteps.map(step => <div key={`step-indicator-${step.id}`} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer 
                  ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} 
                  border-2 border-white`} onClick={() => handleStepCompletion(step.id)}>
                {step.isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="h-0.5 w-16 bg-gray-200 absolute -z-10" style={{
            display: step.id === jobSteps.length ? 'none' : 'block'
          }}></div>
            </div>)}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left sidebar with detailed steps */}
        <div className="md:w-1/3 border rounded-lg overflow-hidden shadow-sm">
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {jobSteps.map(step => <div key={step.id} className={`border-b last:border-b-0 transition-colors ${step.isCompleted ? 'bg-green-50' : 'bg-white'}`}>
                <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-start" onClick={() => handleStepCompletion(step.id)}>
                  <div className="flex-shrink-0 mt-0.5">
                    {savingStepId === step.id ? <Loader className="h-5 w-5 animate-spin text-blue-500" /> : <Checkbox id={`step-${step.id}`} checked={step.isCompleted} className={step.isCompleted ? "bg-green-500 text-white border-green-500" : ""} onCheckedChange={() => handleStepCompletion(step.id)} />}
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className={`font-bold ${step.isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                      {step.title}
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {step.tasks.map(task => <li key={task.id} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {savingTaskId === task.id ? <Loader className="h-4 w-4 animate-spin text-blue-500" /> : <Checkbox id={task.id} checked={task.isCompleted} className={`h-4 w-4 ${task.isCompleted ? "bg-green-500 text-white border-green-500" : ""}`} onCheckedChange={() => handleTaskCompletion(step.id, task.id)} />}
                          </div>
                          <label htmlFor={task.id} className="">
                            {task.text}
                          </label>
                        </li>)}
                    </ul>
                  </div>
                  <div className="flex-shrink-0">
                    {step.isCompleted && <Check className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        
        {/* Right side map placeholder */}
        <div className="md:w-2/3 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="relative aspect-[16/9]">
            <img src="/lovable-uploads/30179ed7-1923-4ddf-8af0-c40f3280552e.png" alt="Job Map" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-white bg-opacity-75 px-3 py-1 rounded-md text-sm font-medium">
              Basic Maintenance
            </div>
          </div>
          
          {/* Progress summary at the bottom */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Overall Progress</h3>
              <div className="text-sm text-gray-500">
                {completedSteps} of {jobSteps.length} steps complete ({Math.round(progressPercentage)}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-in-out" style={{
              width: `${progressPercentage}%`
            }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};