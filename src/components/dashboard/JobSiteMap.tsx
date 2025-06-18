import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import SharedJobMap from "@/components/shared/SharedJobMap";

const JobSiteMap = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs data
  useEffect(() => {
    let isMounted = true;
    
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .limit(100); // Limit the number of jobs for better performance
          
        if (error) {
          console.error("Failed to fetch jobs:", error);
        } else if (isMounted) {
          setJobs(data || []);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchJobs();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleJobClick = useCallback((job: Job) => {
    navigate(`/jobs/${job.id}`);
  }, [navigate]);

  // Count jobs with locations
  const jobsWithLocations = React.useMemo(() => {
    return jobs.filter(job => 
      (job.location && job.location[0] && job.location[1]) || 
      (job.locations && job.locations.length > 0)
    ).length;
  }, [jobs]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Job Locations</h2>
        <div className="text-sm text-gray-500">
          {jobsWithLocations} jobs with locations
        </div>
      </div>
      <SharedJobMap 
        jobs={jobs}
        height="400px"
        onJobClick={handleJobClick}
      />
    </Card>
  );
};

export default JobSiteMap;
