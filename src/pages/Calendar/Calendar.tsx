
import React, { useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { useCalendarState } from './hooks/useCalendarState';
import { CalendarHeader } from './components/CalendarHeader';
import { Card } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamCalendarGrid } from './components/TeamCalendarGrid';
import { PlusCircle, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarIntegrationDialog } from './components/CalendarIntegrationDialog';
import { teamLinks } from '@/components/ui/sidebar/constants';

export default function Calendar() {
  const { date, setDate } = useCalendarState();
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  const params = useParams();
  const teamColor = params.teamColor || 'red';
  
  const handleIntegrate = (provider: string) => {
    toast({
      title: "Calendar Integration",
      description: `Connected to ${provider} successfully`,
    });
    setIsIntegrationDialogOpen(false);
  };

  return (
    <BaseLayout>
      <div className="container py-6 space-y-6">
        <CalendarHeader 
          date={date} 
          setDate={setDate}
          onIntegrateClick={() => setIsIntegrationDialogOpen(true)}
        />
        
        <Tabs defaultValue="team-view" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="team-view">Team View</TabsTrigger>
              <TabsTrigger value="month-view">Month View</TabsTrigger>
              <TabsTrigger value="week-view">Week View</TabsTrigger>
              <TabsTrigger value="day-view">Day View</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsIntegrationDialogOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Integrations
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>

          <TabsContent value="team-view" className="mt-4">
            <TeamCalendarGrid />
          </TabsContent>
          
          <TabsContent value="month-view" className="mt-4">
            <Card className="p-0 overflow-hidden">
              <TeamCalendar 
                date={date} 
                setDate={setDate} 
                teamColor={teamColor} 
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="week-view">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Week View Coming Soon</h3>
              <p>This feature is currently under development.</p>
            </Card>
          </TabsContent>

          <TabsContent value="day-view">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Day View Coming Soon</h3>
              <p>This feature is currently under development.</p>
            </Card>
          </TabsContent>
        </Tabs>
        
        <CalendarIntegrationDialog
          open={isIntegrationDialogOpen}
          onOpenChange={setIsIntegrationDialogOpen}
          onIntegrate={handleIntegrate}
        />
      </div>
    </BaseLayout>
  );
}
