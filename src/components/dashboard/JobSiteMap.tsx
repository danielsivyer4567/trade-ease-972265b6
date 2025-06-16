import React, { useState, useEffect } from "react";
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
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) {
          console.error("Failed to fetch jobs:", error);
        } else {
          setJobs(data || []);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Job Locations</h2>
        <div className="text-sm text-gray-500">
          {jobs.filter(job => 
            (job.location && job.location[0] && job.location[1]) || 
            (job.locations && job.locations.length > 0)
          ).length} jobs with locations
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
