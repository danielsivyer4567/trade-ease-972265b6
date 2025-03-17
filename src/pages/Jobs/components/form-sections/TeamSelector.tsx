
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { TEAMS } from "../../constants/teams";

interface TeamSelectorProps {
  team: string;
  setTeam: (team: string) => void;
}

export function TeamSelector({ team, setTeam }: TeamSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="team" className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>Allocate Team</span>
      </Label>
      <Select value={team} onValueChange={setTeam}>
        <SelectTrigger>
          <SelectValue placeholder="Select team or TBA" />
        </SelectTrigger>
        <SelectContent>
          {TEAMS.map(team => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
