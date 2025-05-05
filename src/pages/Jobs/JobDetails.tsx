import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobData } from './hooks/useJobData';
import { JobDetail } from './components/JobDetail';
import { Card, CardContent } from '@/components/ui/card';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, loading, error } = useJobData(id);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/jobs')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground">{error || 'Job not found'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <JobDetail job={job} />;
}
