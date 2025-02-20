
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: 'team_leader' | 'manager';
}

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
  teamLeaderId?: string;
  managerId?: string;
  attachedFiles?: string[];
}

interface TaskListProps {
  tasks: Task[];
  teamName: string;
  teamMembers: TeamMember[];
  onAcknowledge: (taskId: string, note: string) => void;
  onComplete: (taskId: string, note: string, images: string[]) => void;
}

export function TaskList({ tasks, teamName, teamMembers, onAcknowledge, onComplete }: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks
        .filter(task => task.assignedTeam === teamName)
        .map(task => {
          const teamLeader = teamMembers.find(m => m.id === task.teamLeaderId);
          const manager = teamMembers.find(m => m.id === task.managerId);
          
          return (
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
                <CardDescription>
                  Due by: {task.dueDate}
                  {teamLeader && <div>Team Leader: {teamLeader.name}</div>}
                  {manager && <div>Manager: {manager.name}</div>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{task.description}</p>
                {task.attachedFiles && task.attachedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {task.attachedFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={file} 
                          alt={`Attachment ${index + 1}`} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'placeholder.svg'; // Fallback image
                            target.className = 'w-16 h-16 mx-auto mt-4';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
          );
        })}
    </div>
  );
}
