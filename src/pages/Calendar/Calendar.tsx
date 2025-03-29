
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, RefreshCw } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTeam, setActiveTeam] = useState<string>("red");

  const teams = [
    { name: "Team Red", color: "red" },
    { name: "Team Blue", color: "blue" },
    { name: "Team Green", color: "green" },
  ];
  
  const handlePrevMonth = () => {
    if (date) {
      const prevMonth = new Date(date);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setDate(prevMonth);
    }
  };

  const handleNextMonth = () => {
    if (date) {
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDate(nextMonth);
    }
  };

  const handleToday = () => {
    setDate(new Date());
  };

  return (
    <BaseLayout>
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Team Calendar</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {teams.map((team) => (
            <Card 
              key={team.color}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                activeTeam === team.color ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setActiveTeam(team.color)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${team.color}-500`}></div>
                  {team.name}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Sync Calendars
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <TeamCalendar 
              date={date} 
              setDate={setDate} 
              teamColor={activeTeam}
              assignedJobs={[]}
            />
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default Calendar;
