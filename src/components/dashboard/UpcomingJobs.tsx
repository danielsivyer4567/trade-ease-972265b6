import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

const UpcomingJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) {
          console.error("Failed to fetch jobs:", error);
        } else {
          // Sort jobs by date (assuming date is in YYYY-MM-DD format)
          const sortedJobs = [...(data || [])].sort((a, b) => 
            a.date && b.date ? a.date.localeCompare(b.date) : 0
          );
          setJobs(sortedJobs);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Display only real jobs from the database
  const jobsToShow = jobs.slice(0, 5); // Show at most 5 jobs
  
  return (
    <Card className="p-6 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-green-500" />
          Upcoming Jobs
        </h2>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => navigate("/jobs")} 
          className="bg-primary hover:bg-primary/90"
        >
          View All Jobs
        </Button>
      </div>
      
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 border-r-2 rounded-full mx-auto mb-2"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobsToShow.map(job => {
            const locationCount = job.locations?.length || 0;
            
            return (
              <div 
                key={job.id} 
                className="border-b pb-2 hover:bg-slate-100 p-2 -mx-2 rounded cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex justify-between">
                  <p className="font-medium">{job.title}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100">
                    {job.status === 'ready' && 'Scheduled'}
                    {job.status === 'in-progress' && 'In Progress'}
                    {job.status === 'to-invoice' && 'To Invoice'}
                    {job.status === 'invoiced' && 'Invoiced'}
                  </span>
                </div>
                <p className="text-sm">{job.customer}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {job.date || 'Not scheduled'}
                  </p>
                  {locationCount > 0 && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {locationCount > 1 ? `${locationCount} locations` : '1 location'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          
          {jobsToShow.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming jobs found</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/jobs/new")} 
                className="mt-2"
              >
                Create a Job
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default UpcomingJobs;