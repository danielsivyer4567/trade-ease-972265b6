import { Job } from '@/types/job';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end?: string; // ISO date string (optional for all-day events)
  allDay?: boolean;
  type: 'job' | 'team' | 'personal' | 'other';
  status?: string;
  teamColor?: string;
  location?: string;
  metadata?: Record<string, any>;
}

// Define the store state interface
interface CalendarSyncState {
  events: CalendarEvent[];
  lastSync: string | null;
  isLoading: boolean;
  
  // Actions
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, eventUpdates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  setEvents: (events: CalendarEvent[]) => void;
  syncWithJobs: (jobs: Job[]) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the store with persistence
export const useCalendarStore = create<CalendarSyncState>()(
  persist(
    (set, get) => ({
      events: [],
      lastSync: null,
      isLoading: false,
      
      addEvent: (event) => {
        set((state) => ({
          events: [...state.events, event],
          lastSync: new Date().toISOString(),
        }));
      },
      
      updateEvent: (id, eventUpdates) => {
        set((state) => ({
          events: state.events.map((event) => 
            event.id === id ? { ...event, ...eventUpdates } : event
          ),
          lastSync: new Date().toISOString(),
        }));
      },
      
      removeEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          lastSync: new Date().toISOString(),
        }));
      },
      
      setEvents: (events) => {
        set({
          events,
          lastSync: new Date().toISOString(),
        });
      },
      
      syncWithJobs: (jobs) => {
        // Convert jobs to calendar events
        const jobEvents = jobs.map((job) => {
          const event: CalendarEvent = {
            id: job.id,
            title: job.title,
            start: job.date,
            allDay: true,
            type: 'job',
            status: job.status,
            teamColor: job.assignedTeam?.toLowerCase().includes('red') ? 'red' : 
                      job.assignedTeam?.toLowerCase().includes('blue') ? 'blue' : 
                      job.assignedTeam?.toLowerCase().includes('green') ? 'green' : 'gray',
            location: job.address,
            metadata: {
              jobNumber: job.jobNumber,
              customerId: job.customer,
              jobType: job.type
            }
          };
          return event;
        });
        
        // Update existing events and add new ones
        const currentEvents = get().events;
        const jobIds = jobs.map(job => job.id);
        
        // Keep non-job events and update/add job events
        const updatedEvents = [
          ...currentEvents.filter(event => event.type !== 'job' || !jobIds.includes(event.id)),
          ...jobEvents
        ];
        
        set({
          events: updatedEvents,
          lastSync: new Date().toISOString(),
        });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      }
    }),
    {
      name: 'calendar-sync-storage',
      // Only store events and lastSync in localStorage, not the functions
      partialize: (state) => ({ 
        events: state.events,
        lastSync: state.lastSync
      }),
    }
  )
);

// Main Calendar Service for use throughout the app
export class CalendarSyncService {
  // Convert Job objects to calendar events
  static jobToCalendarEvent(job: Job): CalendarEvent {
    return {
      id: job.id,
      title: job.title,
      start: job.date,
      allDay: true,
      type: 'job',
      status: job.status,
      teamColor: job.assignedTeam?.toLowerCase().includes('red') ? 'red' : 
                job.assignedTeam?.toLowerCase().includes('blue') ? 'blue' : 
                job.assignedTeam?.toLowerCase().includes('green') ? 'green' : 'gray',
      location: job.address,
      metadata: {
        jobNumber: job.jobNumber,
        customerId: job.customer,
        jobType: job.type
      }
    };
  }
  
  // Sync calendars across the app with the latest job data
  static syncCalendars(jobs: Job[]) {
    const { syncWithJobs } = useCalendarStore.getState();
    syncWithJobs(jobs);
  }
  
  // Get all events for a specific date
  static getEventsForDate(date: Date): CalendarEvent[] {
    const { events } = useCalendarStore.getState();
    const dateString = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    return events.filter(event => {
      const eventDate = event.start.split('T')[0];
      return eventDate === dateString;
    });
  }
  
  // Get all events for a specific job
  static getEventsForJob(jobId: string): CalendarEvent[] {
    const { events } = useCalendarStore.getState();
    return events.filter(event => event.id === jobId && event.type === 'job');
  }
  
  // Get all events for a specific team
  static getEventsForTeam(teamColor: string): CalendarEvent[] {
    const { events } = useCalendarStore.getState();
    return events.filter(event => event.teamColor === teamColor);
  }
} 