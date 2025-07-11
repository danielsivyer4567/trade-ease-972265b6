import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { syncSingleJobToCalendars } from "@/integrations/calendar/syncEvents";
import { CalendarConnection } from "@/integrations/calendar/CalendarService";
import { supabase } from "@/integrations/supabase/client";

export function useJobFormSubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calendarConnections, setCalendarConnections] = useState<CalendarConnection[]>([]);

  useEffect(() => {
    const fetchCalendarConnections = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data } = await supabase
            .from("user_calendar_connections")
            .select("*")
            .eq("user_id", session.session.user.id);

          if (data) {
            setCalendarConnections(
              data.map((conn) => ({
                id: conn.id,
                provider: conn.provider,
                providerId: conn.provider_id,
                calendarId: conn.calendar_id,
                syncEnabled: conn.sync_enabled,
                createdAt: new Date(conn.created_at),
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching calendar connections:", error);
      }
    };

    fetchCalendarConnections();
  }, []);

  const validateJobForm = (
    jobNumber: string,
    title: string,
    customer: string,
    type: string,
    date: string,
    dateUndecided: boolean
  ) => {
    if (!jobNumber || !title || !customer || !type || (!date && !dateUndecided)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const prepareJobData = (
    jobNumber: string,
    title: string,
    customer: string,
    description: string,
    type: string,
    date: string,
    dateUndecided: boolean,
    team: string,
    location: [number, number],
    address: string = "",
    city: string = "",
    state: string = "",
    zipCode: string = ""
  ) => {
    return {
      job_number: jobNumber,
      title,
      customer,
      description,
      type,
      date: dateUndecided ? null : date,
      date_undecided: dateUndecided,
      status: "ready",
      location,
      assigned_team: team !== "tba" ? team : null,
      address,
      city,
      state,
      zipCode,
    };
  };

  const handleSuccessfulSubmit = async (jobData: any) => {
    toast({
      title: "Job Created",
      description: `Job has been created successfully`,
    });

    if (jobData.assigned_team && jobData.date && !jobData.date_undecided) {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user && calendarConnections.length > 0) {
          const jobForCalendar = {
            id: jobData.id,
            jobNumber: jobData.job_number,
            title: jobData.title,
            customer: jobData.customer,
            type: jobData.type,
            date: jobData.date,
            description: jobData.description,
            location: jobData.location,
            status: jobData.status,
            assignedTeam: jobData.assigned_team,
          };

          await syncSingleJobToCalendars(
            jobForCalendar,
            calendarConnections,
            session.session.user.id
          );

          toast({
            title: "Calendar Updated",
            description: "Job has been added to team calendar",
          });
        }
      } catch (error) {
        console.error("Error syncing to calendar:", error);
      }
    }

    navigate("/jobs");
  };

  return {
    validateJobForm,
    prepareJobData,
    handleSuccessfulSubmit,
  };
}
