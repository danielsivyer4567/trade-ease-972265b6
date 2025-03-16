
import { supabase } from "@/integrations/supabase/client";

export type CalendarProvider = 'google' | 'apple' | 'outlook' | 'other';

export interface CalendarConnection {
  id: string;
  provider: CalendarProvider;
  providerId?: string;
  calendarId?: string;
  syncEnabled: boolean;
  createdAt: Date;
}

export const calendarService = {
  // Get user's calendar connections
  async getUserCalendarConnections(userId: string): Promise<CalendarConnection[]> {
    const { data, error } = await supabase
      .from('user_calendar_connections')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching calendar connections:', error);
      return [];
    }
    
    return (data || []).map(connection => ({
      id: connection.id,
      provider: connection.provider as CalendarProvider,
      providerId: connection.provider_id,
      calendarId: connection.calendar_id,
      syncEnabled: connection.sync_enabled,
      createdAt: new Date(connection.created_at)
    }));
  },
  
  // Create a new calendar connection
  async createCalendarConnection(userId: string, provider: CalendarProvider, accessToken: string, refreshToken?: string, providerId?: string, calendarId?: string) {
    const { data, error } = await supabase
      .from('user_calendar_connections')
      .insert({
        user_id: userId,
        provider,
        provider_id: providerId,
        access_token: accessToken,
        refresh_token: refreshToken,
        calendar_id: calendarId,
        token_expires_at: new Date(Date.now() + 3600 * 1000) // Default 1 hour expiry
      })
      .select();
      
    if (error) {
      console.error('Error creating calendar connection:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Update a calendar connection
  async updateCalendarConnection(connectionId: string, updates: Partial<Omit<CalendarConnection, 'id' | 'createdAt'>>) {
    const { data, error } = await supabase
      .from('user_calendar_connections')
      .update({
        provider: updates.provider,
        provider_id: updates.providerId,
        calendar_id: updates.calendarId,
        sync_enabled: updates.syncEnabled,
        updated_at: new Date()
      })
      .eq('id', connectionId)
      .select();
      
    if (error) {
      console.error('Error updating calendar connection:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Delete a calendar connection
  async deleteCalendarConnection(connectionId: string) {
    const { error } = await supabase
      .from('user_calendar_connections')
      .delete()
      .eq('id', connectionId);
      
    if (error) {
      console.error('Error deleting calendar connection:', error);
      throw error;
    }
    
    return true;
  },
  
  // Record a calendar sync event
  async recordSyncEvent(userId: string, connectionId: string, eventData: {
    tradeEventId: string;
    providerEventId?: string;
    title: string;
    start: Date;
    end: Date;
  }) {
    const { data, error } = await supabase
      .from('calendar_sync_events')
      .insert({
        user_id: userId,
        connection_id: connectionId,
        trade_event_id: eventData.tradeEventId,
        provider_event_id: eventData.providerEventId,
        event_title: eventData.title,
        event_start: eventData.start,
        event_end: eventData.end
      })
      .select();
      
    if (error) {
      console.error('Error recording sync event:', error);
      throw error;
    }
    
    return data[0];
  }
};
