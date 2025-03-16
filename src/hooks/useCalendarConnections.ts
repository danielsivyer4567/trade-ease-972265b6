
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarConnection, calendarService } from '@/integrations/calendar/CalendarService';
import { toast } from 'sonner';

export function useCalendarConnections() {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getUserAndConnections = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        loadConnections(data.user.id);
      }
    };

    getUserAndConnections();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          loadConnections(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setConnections([]);
          setIsConnected(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadConnections = async (uid: string) => {
    setIsLoading(true);
    try {
      const userConnections = await calendarService.getUserCalendarConnections(uid);
      setConnections(userConnections);
      setIsConnected(userConnections.length > 0);
    } catch (error) {
      console.error('Error loading calendar connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => {
    if (userId) {
      loadConnections(userId);
    }
  };

  const toggleSyncEnabled = async (connectionId: string, enabled: boolean) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await calendarService.updateCalendarConnection(connectionId, { syncEnabled: enabled });
      toast.success(enabled ? 'Calendar sync enabled' : 'Calendar sync disabled');
      refresh();
      return true;
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update calendar sync settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await calendarService.deleteCalendarConnection(connectionId);
      toast.success('Calendar disconnected successfully');
      refresh();
      return true;
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to disconnect calendar');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connections,
    isLoading,
    isConnected,
    userId,
    refresh,
    toggleSyncEnabled,
    removeConnection
  };
}
