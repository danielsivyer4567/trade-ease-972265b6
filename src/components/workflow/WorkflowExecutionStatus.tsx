import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { WorkflowService } from '@/services/WorkflowService';
import { toast } from 'sonner';

interface WorkflowExecutionStatusProps {
  executionId: string;
  onComplete: () => void;
}

type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';

interface ExecutionState {
  status: ExecutionStatus;
  progress: number;
  currentStep: string;
  error?: string;
}

export function WorkflowExecutionStatus({ executionId, onComplete }: WorkflowExecutionStatusProps) {
  const [state, setState] = useState<ExecutionState>({
    status: 'pending',
    progress: 0,
    currentStep: 'Initializing...'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const { success, data, error } = await WorkflowService.getExecutionStatus(executionId);
        if (!success) throw error;

        setState({
          status: data.status,
          progress: data.progress,
          currentStep: data.currentStep,
          error: data.error
        });

        if (data.status === 'completed' || data.status === 'failed') {
          onComplete();
          if (data.status === 'completed') {
            toast.success('Workflow execution completed successfully');
          } else {
            toast.error('Workflow execution failed');
          }
        }
      } catch (error) {
        console.error('Failed to fetch execution status:', error);
        toast.error('Failed to fetch execution status');
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [executionId, onComplete]);

  const getStatusIcon = () => {
    switch (state.status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3 className="font-semibold">Workflow Execution</h3>
          </div>
          <Badge className={getStatusColor()}>
            {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{state.progress}%</span>
          </div>
          <Progress value={state.progress} />
        </div>

        <div className="text-sm">
          <span className="font-medium">Current Step:</span>{' '}
          <span className="text-gray-600">{state.currentStep}</span>
        </div>

        {state.error && (
          <div className="text-sm text-red-500">
            <span className="font-medium">Error:</span> {state.error}
          </div>
        )}
      </div>
    </Card>
  );
} 