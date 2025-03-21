
import { AppLayout } from '@/components/ui/AppLayout';

interface JobLoadingStateProps {
  isError?: boolean;
}

export const JobLoadingState = ({ isError = false }: JobLoadingStateProps) => {
  return (
    <AppLayout>
      <div className="container-responsive mx-auto p-8">
        <div className="text-center">
          {isError 
            ? "Job not found. Please try again." 
            : "Loading job details..."}
        </div>
      </div>
    </AppLayout>
  );
};
