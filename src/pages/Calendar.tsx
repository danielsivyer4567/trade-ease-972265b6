
import { AppLayout } from "@/components/ui/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendarDays, Users, CalendarRange, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("month");
  const [showWeekends, setShowWeekends] = useState(true);
  const [showTeamEvents, setShowTeamEvents] = useState(true);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Calendar</h1>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your calendar view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>View Type</Label>
                  <Select value={view} onValueChange={setView}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Weekends</Label>
                  <Switch
                    checked={showWeekends}
                    onCheckedChange={setShowWeekends}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show Team Events</Label>
                  <Switch
                    checked={showTeamEvents}
                    onCheckedChange={setShowTeamEvents}
                  />
                </div>

                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team Calendar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mini Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="schedule" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="availability" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule View</CardTitle>
                  <CardDescription>
                    View and manage your calendar events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) =>
                      !showWeekends && [0, 6].includes(date.getDay())
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                  <CardDescription>
                    Set your working hours and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <Label>{day}</Label>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="9">
                              <SelectTrigger className="w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => i + 7).map((hour) => (
                                  <SelectItem key={hour} value={hour.toString()}>
                                    {hour}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>to</span>
                            <Select defaultValue="17">
                              <SelectTrigger className="w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => i + 13).map((hour) => (
                                  <SelectItem key={hour} value={hour.toString()}>
                                    {hour}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">Save Availability</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
