
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { JobStep } from '@/types/job';

interface JobStepIndicatorsProps {
  jobId: string;
}

export const JobStepIndicators: React.FC<JobStepIndicatorsProps> = ({ jobId }) => {
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchJobSteps = async () => {
      if (jobId) {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('job_steps')
          .eq('id', jobId)
          .single();

        if (data && data.job_steps && !error) {
          setJobSteps(data.job_steps);
        } else {
          // Default steps if not found in database
          setJobSteps([
            { id: 1, title: 'step 1', tasks: [], isCompleted: false },
            { id: 2, title: 'step 2', tasks: [], isCompleted: false },
            { id: 3, title: 'step 3', tasks: [], isCompleted: false },
            { id: 4, title: 'step 4', tasks: [], isCompleted: false },
            { id: 5, title: 'step 5', tasks: [], isCompleted: false },
            { id: 6, title: 'step 6', tasks: [], isCompleted: false },
          ]);
        }
        setLoading(false);
      }
    };

    fetchJobSteps();
  }, [jobId]);

  if (loading) {
    return <div className="flex items-center space-x-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-5 h-5 rounded-full bg-gray-200 animate-pulse"></div>
      ))}
    </div>;
  }

  // Only show 6 steps max
  const visibleSteps = jobSteps.slice(0, 6);
  
  return (
    <div className="flex items-center space-x-1">
      {visibleSteps.map((step) => (
        <div 
          key={step.id}
          className={`w-6 h-6 rounded-full flex items-center justify-center
            ${step.isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700'} 
            border-2 border-white`}
          title={step.title}
        >
          {step.isCompleted ? (
            <Check className="h-3 w-3" />
          ) : (
            <span className="text-xs">{step.id}</span>
          )}
        </div>
      ))}
    </div>
  );
};
