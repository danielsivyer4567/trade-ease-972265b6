
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";
import { CalendarConnection } from "./CalendarService";

export async function syncJobsToCalendars(
  jobs: Job[],
  connections: CalendarConnection[],
  userId: string
) {
  if (!connections.length || !jobs.length || !userId) {
    return { success: false, message: 'Nothing to sync' };
  }
  
  try {
    const enabledConnections = connections.filter(conn => conn.syncEnabled);
    if (!enabledConnections.length) {
      return { success: false, message: 'No enabled calendar connections' };
    }
    
    // For each connection, sync all jobs
    const results = await Promise.all(
      enabledConnections.map(async (connection) => {
        // Prepare events data for the sync function
        const events = jobs.map(job => {
          const jobDate = new Date(job.date);
          // Default end time is 2 hours after start
          const endDate = new Date(jobDate);
          endDate.setHours(endDate.getHours() + 2);
          
          return {
            id: job.id,
            title: job.title || `Job #${job.jobNumber}`,
            description: job.description || `Customer: ${job.customer}`,
            location: job.location ? `${job.location[1]},${job.location[0]}` : '',
            start: jobDate.toISOString(),
            end: endDate.toISOString()
          };
        });
        
        // Call the edge function to sync events
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) {
          throw new Error('No authenticated session');
        }
        
        // Use the supabase edge function
        const { data, error } = await supabase.functions.invoke('sync-calendar-events', {
          body: {
            connectionId: connection.id,
            events
          }
        });
        
        if (error) {
          console.error('Error from sync function:', error);
          return {
            connectionId: connection.id,
            provider: connection.provider,
            success: false,
            error: error.message
          };
        }
        
        return {
          connectionId: connection.id,
          provider: connection.provider,
          success: true,
          results: data.results
        };
      })
    );
    
    const allSuccessful = results.every(result => result.success);
    
    if (allSuccessful) {
      toast.success('All jobs synced to your calendars');
    } else {
      const failedCount = results.filter(result => !result.success).length;
      toast.warning(`${failedCount} out of ${results.length} calendars failed to sync`);
    }
    
    return { success: allSuccessful, results };
  } catch (error) {
    console.error('Error syncing jobs to calendars:', error);
    toast.error('Failed to sync jobs to calendars');
    return { success: false, error: error.message };
  }
}

export async function syncSingleJobToCalendars(
  job: Job,
  connections: CalendarConnection[],
  userId: string
) {
  return syncJobsToCalendars([job], connections, userId);
}
