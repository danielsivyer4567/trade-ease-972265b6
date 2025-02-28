
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
import { Search, X } from 'lucide-react';

export default function TeamNew() {
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("purple");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [teamLeader] = useState({
    name: "Paul Finch",
    role: "Team Leader",
    email: "paul.finch@example.com",
    avatar: "https://randomuser.me/api/portraits/men/72.jpg"
  });
  const navigate = useNavigate();

  // Sample team members for search functionality
  const [availableMembers] = useState([
    { id: 1, name: "John Smith", role: "Technician", email: "john.smith@example.com" },
    { id: 2, name: "Sarah Johnson", role: "Electrician", email: "sarah.johnson@example.com" },
    { id: 3, name: "Mike Williams", role: "Plumber", email: "mike.williams@example.com" },
    { id: 4, name: "Lisa Brown", role: "HVAC Specialist", email: "lisa.brown@example.com" },
    { id: 5, name: "Robert Davis", role: "Carpenter", email: "robert.davis@example.com" },
  ]);

  const [selectedMembers, setSelectedMembers] = useState<typeof availableMembers>([]);

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

  const handleAddMember = (member: typeof availableMembers[0]) => {
    if (!selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      toast.success(`${member.name} has been added to the team`);
      setSearchTerm("");
    }
  };

  const handleRemoveMember = (id: number) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== id));
  };

  const filteredMembers = availableMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedMembers.some(m => m.id === member.id)
  );

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
              Add members to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Team Leader Section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Team Leader</h3>
                <div className="flex items-center p-3 rounded-md border bg-gray-50">
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={teamLeader.avatar} 
                      alt={teamLeader.name} 
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{teamLeader.name}</p>
                    <p className="text-sm text-gray-500">{teamLeader.role}</p>
                  </div>
                </div>
              </div>

              {/* Search for team members */}
              <div className="space-y-2">
                <Label htmlFor="search-members">Add Team Members</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search-members"
                    placeholder="Search for team members..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                {/* Search results */}
                {searchTerm && (
                  <div className="mt-1 border rounded-md divide-y max-h-48 overflow-y-auto">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => (
                        <div 
                          key={member.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          onClick={() => handleAddMember(member)}
                        >
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                          <Button size="sm" variant="ghost" className={selectedColor.bgClass + " text-white"}>
                            Add
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">No members found</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected team members */}
              <div>
                <h3 className="text-sm font-medium mb-2">Team Members</h3>
                {selectedMembers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-2 border rounded-md bg-gray-50">
                    No team members selected. Search to add members.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
