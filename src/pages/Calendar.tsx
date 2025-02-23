
import { AppLayout } from "@/components/ui/AppLayout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manager's Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full rounded-md border shadow"
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-zinc-950">Team Calendars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Red Team Calendar</h3>
              <TeamCalendar date={date} setDate={setDate} teamColor="red" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Blue Team Calendar</h3>
              <TeamCalendar date={date} setDate={setDate} teamColor="blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Green Team Calendar</h3>
              <TeamCalendar date={date} setDate={setDate} teamColor="green" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
