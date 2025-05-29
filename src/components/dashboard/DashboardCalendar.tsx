import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { useCalendarStore, CalendarSyncService } from '@/services/CalendarSyncService';

interface DashboardCalendarProps {
  miniView?: boolean;
  jobId?: string;
  initialDate?: Date;
  jobs?: Job[];
}

export function DashboardCalendar({ 
  miniView = false, 
  jobId, 
  initialDate = new Date(),
  jobs = []
}: DashboardCalendarProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(initialDate);
  const [activeTab, setActiveTab] = useState('calendar');
  const { events, isLoading, syncWithJobs } = useCalendarStore();
  
  // Sync jobs whenever they change
  useEffect(() => {
    if (jobs.length > 0) {
      syncWithJobs(jobs);
    }
  }, [jobs, syncWithJobs]);
  
  const handleNewEvent = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}/edit`);
    } else {
      navigate('/jobs/new');
    }
  };
  
  const handleNavigateToFullCalendar = () => {
    navigate('/calendar');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
            Today
          </Button>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger 
                value="calendar" 
                className="text-xs md:text-sm py-1 px-2"
                data-state={activeTab === 'calendar' ? 'active' : 'inactive'}
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="text-xs md:text-sm py-1 px-2"
                data-state={activeTab === 'week' ? 'active' : 'inactive'}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="day" 
                className="text-xs md:text-sm py-1 px-2"
                data-state={activeTab === 'day' ? 'active' : 'inactive'}
              >
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              const prevMonth = new Date(date);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setDate(prevMonth);
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-lg font-medium">
              {format(date, 'MMMM yyyy')}
            </span>
            
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              const nextMonth = new Date(date);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setDate(nextMonth);
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button size="sm" onClick={handleNewEvent}>
            <PlusCircle className="h-4 w-4 mr-1" />
            New Event
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="calendar" className="mt-0">
          <div className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-muted-foreground">Loading calendar...</p>
              </div>
            ) : (
              <TeamCalendar 
                date={date} 
                setDate={setDate} 
                teamColor="blue"
                assignedJobs={jobs}
                miniView={miniView}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="mt-0 p-4">
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Week view coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="day" className="mt-0 p-4">
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Day view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 