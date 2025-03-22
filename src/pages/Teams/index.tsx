import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Users, UserPlus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Team {
  id: string;
  name: string;
  members: number;
  description?: string;
}

export default function Teams() {
  const [teams, setTeams] = React.useState<Team[]>([
    { 
      id: '1', 
      name: 'Development', 
      members: 5,
      description: 'Core development team'
    },
    { 
      id: '2', 
      name: 'Marketing', 
      members: 3,
      description: 'Marketing and communications'
    },
    { 
      id: '3', 
      name: 'Sales', 
      members: 4,
      description: 'Sales and customer relations'
    },
  ]);

  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState('');
  const [newTeamDescription, setNewTeamDescription] = React.useState('');

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        members: 0,
        description: newTeamDescription.trim()
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamDescription('');
      setIsCreatingTeam(false);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-106px)] flex flex-col mx-auto max-w-[1200px]">
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
              <p className="text-muted-foreground">
                Manage your teams and team members
              </p>
            </div>
            <Button
              onClick={() => setIsCreatingTeam(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isCreatingTeam && (
              <Card className="p-4 flex flex-col gap-4 border-dashed">
                <div className="space-y-4">
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Team name"
                    className="text-lg font-medium"
                    autoFocus
                  />
                  <Input
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Team description (optional)"
                  />
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="default"
                    onClick={handleCreateTeam}
                    disabled={!newTeamName.trim()}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsCreatingTeam(false);
                      setNewTeamName('');
                      setNewTeamDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}
            
            {teams.map((team) => (
              <Card key={team.id} className="p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {team.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{team.members} members</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => {
                      // Handle adding members
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Members
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      // Handle team settings
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 