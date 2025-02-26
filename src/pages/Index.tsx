
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";

export default function Index() {
  const [redTeamDate, setRedTeamDate] = useState<Date | undefined>(new Date());
  const [blueTeamDate, setBlueTeamDate] = useState<Date | undefined>(new Date());
  const [greenTeamDate, setGreenTeamDate] = useState<Date | undefined>(new Date());

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <CardDescription>Overview of your business performance</CardDescription>
          </CardHeader>
          <CardContent>
            <KeyStatistics />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Red Team Calendar</h2>
            </CardHeader>
            <CardContent>
              <TeamCalendar
                date={redTeamDate}
                setDate={setRedTeamDate}
                teamColor="red"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Blue Team Calendar</h2>
            </CardHeader>
            <CardContent>
              <TeamCalendar
                date={blueTeamDate}
                setDate={setBlueTeamDate}
                teamColor="blue"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Green Team Calendar</h2>
            </CardHeader>
            <CardContent>
              <TeamCalendar
                date={greenTeamDate}
                setDate={setGreenTeamDate}
                teamColor="green"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
