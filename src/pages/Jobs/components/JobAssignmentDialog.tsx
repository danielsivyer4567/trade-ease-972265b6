
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { useState, useEffect } from "react";
import { DateSelectionStep } from "./job-assignment/DateSelectionStep";
import { TeamSelectionStep } from "./job-assignment/TeamSelectionStep";

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
            <DateSelectionStep 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          ) : (
            <TeamSelectionStep 
              teams={teams}
              selectedTeam={selectedTeam}
              onTeamSelect={handleTeamSelect}
              selectedDate={selectedDate}
              onChangeDate={() => setStep('date')}
            />
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
