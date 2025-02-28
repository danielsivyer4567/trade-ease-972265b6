
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TeamCalendar } from '@/components/team/TeamCalendar';

export default function TeamNew() {
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("purple");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const availableColors = [
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Pink", value: "pink" },
    { name: "Teal", value: "teal" },
    { name: "Yellow", value: "yellow" },
    { name: "Indigo", value: "indigo" },
    { name: "Rose", value: "rose" }
  ];

  const handleCreateTeam = () => {
    if (!teamName) {
      toast.error("Please enter a team name");
      return;
    }

    toast.success(`Team "${teamName}" has been created!`);
    // In a real application, you would save the team to the database here
    // and then navigate to the newly created team page
    
    // For now, we'll just navigate back to the calendar page
    navigate("/calendar");
  };

  return (
    <AppLayout>
      <div className="space-y-8 p-6">
        <h1 className="text-2xl font-bold">Create New Team</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Configure your new team's information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input 
                id="team-name"
                placeholder="Enter team name" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full bg-${color.value}-500 flex items-center justify-center border-2 ${
                      teamColor === color.value ? `border-${color.value}-700` : "border-transparent"
                    }`}
                    onClick={() => setTeamColor(color.value)}
                    aria-label={`Select ${color.name} color`}
                  >
                    {teamColor === color.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              className={`bg-${teamColor}-500 hover:bg-${teamColor}-600 mt-4`}
              onClick={handleCreateTeam}
            >
              Create Team
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Calendar Preview</CardTitle>
            <CardDescription>
              See how your team calendar will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamCalendar 
              date={date}
              setDate={setDate}
              teamColor={teamColor}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              You can add team members after creating the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-500">
                No team members yet. Create the team first to add members.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
