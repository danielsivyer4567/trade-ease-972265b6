import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import the new SimpleJobDetail component
import { SimpleJobDetail } from './components/SimpleJobDetail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Job } from '@/types/job';

function JobsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setJob(data);
        } else {
          // If not found in Supabase, use sample data
          setJob({
            id: id || '1',
            title: 'Electrical Repair',
            customer: 'jackson ryan',
            jobNumber: 'JOB-001',
            type: 'Electrical',
            status: 'invoiced',
            date: '2023-03-20',
            location: [151.2093, -33.8688] as [number, number],
            address: '123 Main St, Sydney NSW',
            city: 'Sydney',
            state: 'NSW',
            zipCode: '2000',
            assignedTeam: 'Team Alpha',
            job_steps: [
              { id: 1, title: 'Initial Assessment', tasks: [], isCompleted: true },
              { id: 2, title: 'Quote Provided', tasks: [], isCompleted: true },
              { id: 3, title: 'Installation', tasks: [], isCompleted: true },
              { id: 4, title: 'Testing', tasks: [], isCompleted: true },
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </div>
      
      {/* Use our new SimpleJobDetail component */}
      <SimpleJobDetail job={job} />
    </div>
  );
}

export default JobsDetailPage; 