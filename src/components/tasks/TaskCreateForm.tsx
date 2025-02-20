
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedTeam: string;
  assignedManager: string;
}

interface TaskCreateFormProps {
  teams: string[];
  formData: TaskFormData;
  onFormChange: (updates: Partial<TaskFormData>) => void;
  onSubmit: () => void;
}

export function TaskCreateForm({ teams, formData, onFormChange, onSubmit }: TaskCreateFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
        <CardDescription>Assign a new task to a team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Task Description"
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => onFormChange({ dueDate: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.assignedTeam}
            onChange={(e) => onFormChange({ assignedTeam: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        <Button onClick={onSubmit} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </CardContent>
    </Card>
  );
}
