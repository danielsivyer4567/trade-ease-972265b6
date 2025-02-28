
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { cn } from "@/lib/utils";

export default function TeamNew() {
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("purple");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const availableColors = [
    { name: "Purple", value: "purple", bgClass: "bg-purple-500", borderClass: "border-purple-700", hoverClass: "bg-purple-600" },
    { name: "Orange", value: "orange", bgClass: "bg-orange-500", borderClass: "border-orange-700", hoverClass: "bg-orange-600" },
    { name: "Pink", value: "pink", bgClass: "bg-pink-500", borderClass: "border-pink-700", hoverClass: "bg-pink-600" },
    { name: "Teal", value: "teal", bgClass: "bg-teal-500", borderClass: "border-teal-700", hoverClass: "bg-teal-600" },
    { name: "Yellow", value: "yellow", bgClass: "bg-yellow-500", borderClass: "border-yellow-700", hoverClass: "bg-yellow-600" },
    { name: "Indigo", value: "indigo", bgClass: "bg-indigo-500", borderClass: "border-indigo-700", hoverClass: "bg-indigo-600" },
    { name: "Rose", value: "rose", bgClass: "bg-rose-500", borderClass: "border-rose-700", hoverClass: "bg-rose-600" }
  ];

  const handleCreateTeam = () => {
    if (!teamName) {
      toast.error("Please enter a team name");
      return;
    }

    // Create team object
    const newTeam = {
      name: teamName,
      color: teamColor
    };

    // Save to localStorage for the Calendar component to pick up
    localStorage.setItem('newTeam', JSON.stringify(newTeam));
    
    toast.success(`Team "${teamName}" has been created!`);
    
    // Navigate back to calendar
    navigate("/calendar");
  };

  // Find the selected color object
  const selectedColor = availableColors.find(color => color.value === teamColor) || availableColors[0];

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
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      color.bgClass,
                      teamColor === color.value ? color.borderClass : "border-transparent"
                    )}
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
              className={cn("mt-4", selectedColor.bgClass, "hover:" + selectedColor.hoverClass, "text-white")}
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
