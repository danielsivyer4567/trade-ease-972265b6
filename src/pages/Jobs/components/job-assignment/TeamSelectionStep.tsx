
import { Users, CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface Team {
  id: string;
  name: string;
  color: string;
}

interface TeamSelectionStepProps {
  teams: Team[];
  selectedTeam: string;
  onTeamSelect: (teamId: string) => void;
  selectedDate: Date | undefined;
  onChangeDate: () => void;
}

export function TeamSelectionStep({
  teams,
  selectedTeam,
  onTeamSelect,
  selectedDate,
  onChangeDate
}: TeamSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-base">Select Team</span>
        </label>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>{selectedDate ? format(selectedDate, 'd MMM') : ""}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-1 h-6 p-0 text-blue-600"
            onClick={onChangeDate}
          >
            Change
          </Button>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="grid grid-cols-1 gap-2">
        {teams.map(team => (
          <Button
            key={team.id}
            variant={selectedTeam === team.id ? "default" : "outline"}
            className={`flex items-center justify-between p-4 h-auto ${
              selectedTeam === team.id ? "border-2 border-primary" : ""
            }`}
            onClick={() => onTeamSelect(team.id)}
          >
            <div className="flex items-center">
              <Users className={`h-5 w-5 mr-3 ${team.color}`} />
              <span className="text-base">{team.name}</span>
            </div>
            {selectedTeam === team.id && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
