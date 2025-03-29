
import React, { useEffect, useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, CheckCircle, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCalendarConnections } from '@/hooks/useCalendarConnections';
import { toast } from 'sonner';
import { GoogleCalendarCard } from '@/components/integrations/GoogleCalendarCard';

export default function CalendarSync() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { connections, isLoading, refresh } = useCalendarConnections();
  
  const platform = searchParams.get('platform');
  const team = searchParams.get('team');
  const action = searchParams.get('action');
  
  const [syncStatus, setSyncStatus] = useState<'pending' | 'syncing' | 'complete' | 'failed'>('pending');
  
  useEffect(() => {
    if (platform && team && action === 'sync') {
      handleSync();
    }
  }, [platform, team, action]);
  
  const handleSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // In a real implementation, we would fetch events and sync them
      // For demo purposes, we'll simulate a sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus('complete');
      toast.success(`Successfully synced ${platform} calendar with ${team}`);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      setSyncStatus('failed');
      toast.error('Failed to sync calendar');
    }
  };
  
  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-md border border-gray-300"
            onClick={() => navigate('/calendar')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Calendar Synchronization</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Connections</CardTitle>
                <CardDescription>
                  Connect and manage your external calendar services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <GoogleCalendarCard />
                
                {isLoading ? (
                  <div className="py-4 text-center">Loading connections...</div>
                ) : connections.length > 0 ? (
                  <div className="space-y-4">
                    {connections.map(conn => (
                      <Card key={conn.id} className="bg-white">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">
                              {conn.provider.charAt(0).toUpperCase() + conn.provider.slice(1)} Calendar
                            </CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => navigate('/calendar')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardFooter className="py-3 flex justify-between">
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/calendar')}
                          >
                            Manage
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No calendar connections yet
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>
                  Configure how your calendars are synchronized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Auto-sync frequency</h3>
                      <p className="text-sm text-gray-500">How often calendars are automatically synchronized</p>
                    </div>
                    <select className="border rounded p-1 text-sm">
                      <option>Every 15 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Every hour</option>
                      <option>Every 2 hours</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-way sync</h3>
                      <p className="text-sm text-gray-500">Sync events in both directions</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {platform && team && (
              <Card>
                <CardHeader>
                  <CardTitle>Sync Status</CardTitle>
                  <CardDescription>
                    {platform} calendar sync with {team}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {syncStatus === 'pending' && (
                      <div className="text-center py-4">
                        <p className="mb-4">Ready to synchronize calendars</p>
                        <Button onClick={handleSync}>Start Sync</Button>
                      </div>
                    )}
                    
                    {syncStatus === 'syncing' && (
                      <div className="text-center py-4">
                        <div className="animate-pulse mb-4">
                          <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <p>Synchronizing calendars...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                      </div>
                    )}
                    
                    {syncStatus === 'complete' && (
                      <div className="text-center py-4">
                        <div className="mb-4">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        </div>
                        <p className="text-green-700 font-medium">Sync completed successfully!</p>
                        <p className="text-sm text-gray-500 mt-2">Calendars are now up to date</p>
                        
                        <div className="mt-6 space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate('/calendar')}
                          >
                            Return to Calendar
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {syncStatus === 'failed' && (
                      <div className="text-center py-4">
                        <div className="mb-4">
                          <X className="h-12 w-12 text-red-500 mx-auto" />
                        </div>
                        <p className="text-red-700 font-medium">Sync failed</p>
                        <p className="text-sm text-gray-500 mt-2">There was an error synchronizing calendars</p>
                        
                        <div className="mt-6 space-y-2">
                          <Button onClick={handleSync}>Retry</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Team Calendars</CardTitle>
                <CardDescription>
                  View and manage each team's calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      variant="outline"
                      className="flex flex-col items-center justify-center py-6"
                      onClick={() => navigate('/calendar/team/red')}
                    >
                      <div className="h-3 w-3 rounded-full bg-red-500 mb-2"></div>
                      Team Red
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex flex-col items-center justify-center py-6"
                      onClick={() => navigate('/calendar/team/blue')}
                    >
                      <div className="h-3 w-3 rounded-full bg-blue-500 mb-2"></div>
                      Team Blue
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex flex-col items-center justify-center py-6"
                      onClick={() => navigate('/calendar/team/green')}
                    >
                      <div className="h-3 w-3 rounded-full bg-green-500 mb-2"></div>
                      Team Green
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
