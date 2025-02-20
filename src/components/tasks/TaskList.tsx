
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTeam: string;
  status: 'pending' | 'acknowledged' | 'completed';
  acknowledgmentNote?: string;
  completionNote?: string;
  completionImages?: string[];
  assignedManager: string;
}

interface TaskListProps {
  tasks: Task[];
  teamName: string;
  onAcknowledge: (taskId: string, note: string) => void;
  onComplete: (taskId: string, note: string, images: string[]) => void;
}

export function TaskList({ tasks, teamName, onAcknowledge, onComplete }: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks
        .filter(task => task.assignedTeam === teamName)
        .map(task => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{task.title}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              <CardDescription>Due by: {task.dueDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{task.description}</p>
              {task.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => onAcknowledge(task.id, "Task received and understood")}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Acknowledge Task
                </Button>
              )}
              {task.status === 'acknowledged' && (
                <Button
                  onClick={() => onComplete(task.id, "Task completed successfully", [])}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
