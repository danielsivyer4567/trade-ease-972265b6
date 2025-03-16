
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { CalendarConnection, CalendarProvider, calendarService } from '@/integrations/calendar/CalendarService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CalendarSyncPopoverProps {
  assignedJobs: Job[];
  date: Date | undefined;
}

export const CalendarSyncPopover: React.FC<CalendarSyncPopoverProps> = ({ 
  assignedJobs,
  date
}) => {
  const [syncPopoverOpen, setSyncPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'connections'>('export');
  const [userConnections, setUserConnections] = useState<CalendarConnection[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CalendarProvider | null>(null);

  // Fetch user and their calendar connections
  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        loadUserConnections(data.user.id);
      }
    };
    
    fetchUserData();
  }, []);

  const loadUserConnections = async (uid: string) => {
    setIsLoading(true);
    try {
      const connections = await calendarService.getUserCalendarConnections(uid);
      setUserConnections(connections);
      setConnected(connections.length > 0);
    } catch (error) {
      console.error('Error loading user connections:', error);
      toast.error('Failed to load calendar connections');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarLink = (platform: 'google' | 'apple' | 'outlook') => {
    const events = assignedJobs.map(job => {
      const jobDate = new Date(job.date);
      const endDate = new Date(jobDate);
      endDate.setHours(endDate.getHours() + 2);
      
      return {
        title: job.title,
        description: job.description || `Job #${job.jobNumber}`,
        location: job.location ? `${job.location[1]},${job.location[0]}` : '',
        startDate: jobDate,
        endDate: endDate
      };
    });

    if (events.length === 0 && date) {
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 1);
      
      events.push({
        title: 'Team Schedule',
        description: 'Sync your team schedule',
        location: '',
        startDate: date,
        endDate: endDate
      });
    }

    if (events.length > 0) {
      const event = events[0];
      
      switch(platform) {
        case 'google':
          return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${format(event.startDate, 'yyyyMMdd')}T${format(event.startDate, 'HHmmss')}/${format(event.endDate, 'yyyyMMdd')}T${format(event.endDate, 'HHmmss')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
          
        case 'apple':
          return `webcal://calendar.google.com/calendar/ical/${encodeURIComponent('example@example.com')}/public/basic.ics`;
          
        case 'outlook':
          return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${format(event.startDate, 'yyyy-MM-dd')}T${format(event.startDate, 'HH:mm:ss')}&enddt=${format(event.endDate, 'yyyy-MM-dd')}T${format(event.endDate, 'HH:mm:ss')}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
          
        default:
          return '#';
      }
    }
    
    return '#';
  };

  const exportCalendar = (format: string) => {
    switch(format) {
      case 'ics':
        downloadICSFile();
        toast.success("Calendar has been exported as .ics file");
        break;
        
      case 'google':
      case 'apple':
      case 'outlook':
        if (userConnections.some(conn => conn.provider === format)) {
          syncToConnectedCalendar(format as CalendarProvider);
        } else {
          setSelectedProvider(format as CalendarProvider);
          setAuthDialogOpen(true);
        }
        break;
        
      default:
        toast.error("Unknown calendar format");
    }
    
    setSyncPopoverOpen(false);
  };

  const handleAuthDialogClose = async (proceed: boolean) => {
    setAuthDialogOpen(false);
    
    if (proceed && selectedProvider && userId) {
      try {
        setIsLoading(true);
        
        // Simulate OAuth flow with a mock token for demo
        const mockToken = `mock_token_${Date.now()}`;
        
        await calendarService.createCalendarConnection(
          userId,
          selectedProvider,
          mockToken,
          'mock_refresh_token',
          `provider_${Date.now()}`,
          `calendar_${Date.now()}`
        );
        
        toast.success(`Connected to ${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} Calendar`);
        loadUserConnections(userId);
        
        // After connecting, sync the events
        syncToConnectedCalendar(selectedProvider);
      } catch (error) {
        console.error('Error connecting calendar:', error);
        toast.error('Failed to connect calendar');
      } finally {
        setIsLoading(false);
      }
    }
    
    setSelectedProvider(null);
  };

  const syncToConnectedCalendar = async (provider: CalendarProvider) => {
    if (!userId) return;
    
    const connection = userConnections.find(conn => conn.provider === provider);
    if (!connection) return;
    
    setIsLoading(true);
    try {
      // Record sync events for each job
      for (const job of assignedJobs) {
        const jobDate = new Date(job.date);
        const endDate = new Date(jobDate);
        endDate.setHours(endDate.getHours() + 2);
        
        await calendarService.recordSyncEvent(userId, connection.id, {
          tradeEventId: job.id,
          providerEventId: `provider_event_${Date.now()}`,
          title: job.title || `Job #${job.jobNumber}`,
          start: jobDate,
          end: endDate
        });
      }
      
      // Simulate successful sync
      toast.success(`Events synced to ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`);
    } catch (error) {
      console.error('Error syncing events:', error);
      toast.error('Failed to sync events to calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConnectionSync = async (connectionId: string, enabled: boolean) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await calendarService.updateCalendarConnection(connectionId, { syncEnabled: enabled });
      toast.success(enabled ? 'Calendar sync enabled' : 'Calendar sync disabled');
      loadUserConnections(userId);
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update calendar sync settings');
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async (connectionId: string, providerName: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await calendarService.deleteCalendarConnection(connectionId);
      toast.success(`Disconnected from ${providerName} Calendar`);
      loadUserConnections(userId);
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to disconnect calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadICSFile = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tradeboard//TeamCalendar//EN'
    ];

    assignedJobs.forEach(job => {
      const jobDate = new Date(job.date);
      const endDate = new Date(jobDate);
      endDate.setHours(endDate.getHours() + 2);
      
      icsContent = [
        ...icsContent,
        'BEGIN:VEVENT',
        `UID:${job.id}@tradeboard.com`,
        `DTSTAMP:${format(new Date(), 'yyyyMMdd')}T${format(new Date(), 'HHmmss')}Z`,
        `DTSTART:${format(jobDate, 'yyyyMMdd')}T${format(jobDate, 'HHmmss')}Z`,
        `DTEND:${format(endDate, 'yyyyMMdd')}T${format(endDate, 'HHmmss')}Z`,
        `SUMMARY:${job.title || `Job #${job.jobNumber}`}`,
        `DESCRIPTION:${job.description || ''}`,
        'END:VEVENT'
      ];
    });
    
    icsContent.push('END:VCALENDAR');
    
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProviderIcon = (provider: string) => {
    switch(provider) {
      case 'google':
        return <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="h-4 w-4" />;
      case 'apple':
        return <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/IOS_Calendar_Icon.png" alt="Apple Calendar" className="h-4 w-4" />;
      case 'outlook':
        return <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Microsoft Outlook" className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Popover open={syncPopoverOpen} onOpenChange={setSyncPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-slate-400 hover:bg-slate-500 py-[2px] my-0 mx-0 px-3">
            <CalendarIcon className="h-4 w-4" />
            <span>{connected ? 'Manage Calendar' : 'Sync Calendar'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <Tabs defaultValue="export" value={activeTab} onValueChange={(val) => setActiveTab(val as 'export' | 'connections')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-2 pt-2">
              <h4 className="font-medium mb-1">Export Calendar</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start w-full" 
                onClick={() => exportCalendar('google')}
                disabled={isLoading}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="h-4 w-4 mr-2" />
                Add to Google Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start w-full" 
                onClick={() => exportCalendar('apple')}
                disabled={isLoading}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/IOS_Calendar_Icon.png" alt="Apple Calendar" className="h-4 w-4 mr-2" />
                Add to iPhone Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start w-full" 
                onClick={() => exportCalendar('outlook')}
                disabled={isLoading}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Microsoft Outlook" className="h-4 w-4 mr-2" />
                Add to Outlook
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start w-full" 
                onClick={() => exportCalendar('ics')}
                disabled={isLoading}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Download .ics File
              </Button>
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-3 pt-2">
              <h4 className="font-medium mb-1">Connected Calendars</h4>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : userConnections.length > 0 ? (
                <div className="space-y-2">
                  {userConnections.map(connection => (
                    <div key={connection.id} className="flex items-center justify-between border rounded p-2">
                      <div className="flex items-center gap-2">
                        {getProviderIcon(connection.provider)}
                        <span className="text-sm font-medium">{connection.provider.charAt(0).toUpperCase() + connection.provider.slice(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={connection.syncEnabled} 
                          onCheckedChange={(checked) => toggleConnectionSync(connection.id, checked)}
                          disabled={isLoading}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeConnection(connection.id, connection.provider)}
                          disabled={isLoading}
                        >
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 mb-2">No calendars connected yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab('export')}
                  >
                    Connect a Calendar
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
      
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProvider && getProviderIcon(selectedProvider)}
              Connect to {selectedProvider?.charAt(0).toUpperCase()}{selectedProvider?.slice(1)} Calendar
            </DialogTitle>
            <DialogDescription>
              Allow TradeEase to access your calendar for event synchronization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm leading-relaxed text-gray-600 mb-4">
              TradeEase will be able to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">View your calendars</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">Create events on your calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm">Sync TradeEase jobs to your calendar</span>
              </li>
            </ul>
          </div>
          
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => handleAuthDialogClose(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => handleAuthDialogClose(true)} disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect Calendar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
