
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { useCalendarState } from './hooks/useCalendarState';
import { CalendarHeader } from './components/CalendarHeader';
import { TeamCalendarGrid } from './components/TeamCalendarGrid';
import { CalendarIntegrationDialog } from './components/CalendarIntegrationDialog';

export default function Calendar() {
  const {
    teams,
    integrationDialogOpen,
    setIntegrationDialogOpen,
    handleJobAssign,
    handleCalendarIntegration,
    redirectToCalendarProvider,
    handleAddTeam
  } = useCalendarState();

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fadeIn p-4 md:p-6 py-[126px]">
        <CalendarHeader 
          onCalendarIntegration={handleCalendarIntegration}
          onAddTeam={handleAddTeam}
        />
        
        <TeamCalendarGrid 
          teams={teams}
          onJobAssign={handleJobAssign}
        />
      </div>

      <CalendarIntegrationDialog 
        open={integrationDialogOpen}
        onOpenChange={setIntegrationDialogOpen}
        onProviderSelect={redirectToCalendarProvider}
      />
    </AppLayout>
  );
}
