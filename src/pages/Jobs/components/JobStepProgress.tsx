
import React, { useState, useEffect } from 'react';
import { Check, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface JobStep {
  id: number;
  title: string;
  tasks: string[];
  isCompleted: boolean;
}

export const JobStepProgress = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [jobSteps, setJobSteps] = useState<JobStep[]>([
    {
      id: 1,
      title: 'step 1-',
      tasks: ['-schedule job date', '-allocate staff'],
      isCompleted: false
    },
    {
      id: 2,
      title: 'step 2-',
      tasks: ['-order materials', '-fill out job details', '- management sign off'],
      isCompleted: false
    },
    {
      id: 3,
      title: 'step 3-',
      tasks: ['-start job', '-inductions', '-material count check'],
      isCompleted: false
    },
    {
      id: 4,
      title: 'step 4-',
      tasks: ['- complete job', '- do quality check', '- site clean up', '- add any variations'],
      isCompleted: false
    },
    {
      id: 5,
      title: 'step5-',
      tasks: ['- verify customer is happy', '- customer to sign job is complete as per contract', '-take pics and double check all documents.', '-send invoices with variations'],
      isCompleted: false
    },
    {
      id: 6,
      title: 'step 6',
      tasks: ['- mark invoices paid to finalise job', '-automaticly sync to xero'],
      isCompleted: false
    }
  ]);

  useEffect(() => {
    // Get existing job steps from database if available
    const fetchJobSteps = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('jobs')
          .select('job_steps')
          .eq('id', id)
          .single();

        if (data && data.job_steps && !error) {
          setJobSteps(data.job_steps);
        }
      }
    };

    fetchJobSteps();
  }, [id]);

  const handleStepCompletion = async (stepId: number) => {
    const updatedSteps = jobSteps.map(step => 
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    );
    
    setJobSteps(updatedSteps);
    
    if (id) {
      const { error } = await supabase
        .from('jobs')
        .update({ job_steps: updatedSteps })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error saving progress",
          description: error.message
        });
      } else {
        const completedStep = updatedSteps.find(s => s.id === stepId);
        toast({
          title: completedStep?.isCompleted ? "Step completed" : "Step reopened",
          description: `${completedStep?.title} has been ${completedStep?.isCompleted ? 'marked as complete' : 'reopened'}.`
        });
      }
    }
  };

  // Visual progress indicator showing how many steps are complete
  const completedSteps = jobSteps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / jobSteps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Job Progress</h3>
        <div className="text-sm text-gray-500">
          {completedSteps} of {jobSteps.length} steps complete
        </div>
      </div>
      
      <div className="space-y-2">
        {jobSteps.map((step, index) => (
          <div 
            key={step.id} 
            className={`border rounded-lg p-4 transition-colors ${
              step.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                    step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                  onClick={() => handleStepCompletion(step.id)}
                >
                  {step.isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <h4 className={`font-bold text-lg ${step.isCompleted ? 'text-green-700' : ''}`}>
                  {step.title}
                </h4>
              </div>
              <button 
                onClick={() => handleStepCompletion(step.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  step.isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {step.isCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
            
            <div className="mt-2 pl-11 space-y-1">
              {step.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex items-start">
                  <span 
                    className={`mr-2 ${step.isCompleted ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
