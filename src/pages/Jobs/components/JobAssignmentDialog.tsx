
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Users, CalendarDays } from "lucide-react";
import { Job } from "@/types/job";

interface Team {
  id: string;
  name: string;
  color: string;
}

interface JobAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJob: Job | null;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onAssign: () => void;
  teams: Team[];
}

export function JobAssignmentDialog({
  isOpen,
  onOpenChange,
  selectedJob,
  selectedTeam,
  setSelectedTeam,
  selectedDate,
  setSelectedDate,
  onAssign,
  teams,
}: JobAssignmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Job {selectedJob?.jobNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select Date
            </label>
            <div className="border rounded-md p-2 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md w-full"
                initialFocus
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Select Team
            </label>
            <div className="grid grid-cols-3 gap-2">
              {teams.map(team => (
                <Button
                  key={team.id}
                  variant={selectedTeam === team.id ? "default" : "outline"}
                  className="flex items-center justify-center"
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <Users className={`h-4 w-4 mr-2 ${team.color}`} />
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAssign}>
            Assign Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
