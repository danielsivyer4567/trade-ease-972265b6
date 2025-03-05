
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Users, CalendarDays, Check } from "lucide-react";
import { Job } from "@/types/job";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

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
  const [step, setStep] = useState<'date' | 'team'>('date');
  
  // Reset step when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('date');
    }
  }, [isOpen]);

  // Move to team selection after date is selected
  useEffect(() => {
    if (selectedDate && step === 'date') {
      setStep('team');
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep('team');
    }
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleAssign = () => {
    onAssign();
    setStep('date');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border-2 shadow-xl">
        <DialogHeader className="bg-background">
          <DialogTitle>Assign Job {selectedJob?.jobNumber}</DialogTitle>
          <DialogDescription>
            {step === 'date' ? 
              "First, select a date for this job" : 
              "Now, select a team to assign this job"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 bg-background">
          {step === 'date' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="text-base">Select Date</span>
              </label>
              <div className="border-2 rounded-lg p-3 shadow-md bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="mx-auto pointer-events-auto"
                  initialFocus
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-base">Select Team</span>
                </label>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{selectedDate?.toLocaleDateString()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-6 p-0 text-blue-600"
                    onClick={() => setStep('date')}
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
                    onClick={() => handleTeamSelect(team.id)}
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
          )}
        </div>
        
        <DialogFooter className="bg-background pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === 'team' && (
            <Button 
              onClick={handleAssign}
              disabled={!selectedDate || !selectedTeam}
            >
              Assign Job
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
