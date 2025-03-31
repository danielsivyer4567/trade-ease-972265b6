
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Users, Bell } from 'lucide-react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from '@/lib/utils';
import { setNotificationPanelState } from '@/components/ui/NotificationButton';

interface Team {
  id: string;
  name: string;
  members: number;
}

interface TeamManagementProps {
  selectedTeam: string | null;
  onTeamSelect: (teamId: string) => void;
}

export function TeamManagement({ selectedTeam, onTeamSelect }: TeamManagementProps) {
  const [teams, setTeams] = React.useState<Team[]>([
    { id: '1', name: 'Development', members: 5 },
    { id: '2', name: 'Marketing', members: 3 },
    { id: '3', name: 'Sales', members: 4 },
  ]);

  const [isCreatingTeam, setIsCreatingTeam] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState('');

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        members: 0
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setIsCreatingTeam(false);
      
      // Show the team notification panel when creating a new team
      setNotificationPanelState({ isOpen: true, isPinned: true });
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    if (selectedTeam === teamId) {
      onTeamSelect('');
    }
  };

  const showTeamNotifications = () => {
    setNotificationPanelState({ isOpen: true, isPinned: true });
  };

  const selectedTeamName = teams.find(t => t.id === selectedTeam)?.name || 'Select Team';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-[150px] justify-between"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{selectedTeamName}</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            className="w-[200px] rounded-md border bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
          >
            {teams.map((team) => (
              <DropdownMenu.Item
                key={team.id}
                className={cn(
                  "relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  "hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  selectedTeam === team.id && "bg-gray-100"
                )}
                onClick={() => onTeamSelect(team.id)}
              >
                <div className="flex items-center gap-2">
                  <span>{team.name}</span>
                  <span className="text-xs text-gray-500">({team.members})</span>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mr-1 hover:bg-blue-100 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      showTeamNotifications();
                    }}
                  >
                    <Bell className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeam(team.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
            {isCreatingTeam ? (
              <div className="p-1">
                <div className="flex items-center gap-1">
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Team name"
                    className="h-7 text-sm"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-7 px-2"
                    onClick={handleCreateTeam}
                    disabled={!newTeamName.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <DropdownMenu.Item
                className="relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                onClick={() => setIsCreatingTeam(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Create Team</span>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      
      <Button
        variant="outline"
        size="icon"
        onClick={showTeamNotifications}
        className="h-9 w-9"
      >
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  );
} 
