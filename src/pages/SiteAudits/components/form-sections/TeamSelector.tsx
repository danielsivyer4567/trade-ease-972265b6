
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, CalendarDays } from "lucide-react";
import { teams } from "../../constants/teams";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CalendarDays className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Jobs will appear on the team's calendar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select value={team} onValueChange={setTeam}>
        <SelectTrigger>
          <SelectValue placeholder="Select team or TBA" />
        </SelectTrigger>
        <SelectContent>
          {teams.map(team => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
