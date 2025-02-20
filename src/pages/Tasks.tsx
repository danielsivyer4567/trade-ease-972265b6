
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskList } from "@/components/tasks/TaskList";

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
  attachedFiles?: string[];
  teamLeaderId?: string;
  managerId?: string;
  assignedManager: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: 'team_leader' | 'manager';
}

const teams = ['Red Team', 'Blue Team', 'Green Team'];

// Simulated team members data - in a real app, this would come from your backend
const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', role: 'team_leader' },
  { id: '2', name: 'Jane Smith', role: 'manager' },
  { id: '3', name: 'Mike Johnson', role: 'team_leader' },
  { id: '4', name: 'Sarah Wilson', role: 'manager' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleTaskAcknowledgment = (taskId: string, note: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'acknowledged', acknowledgmentNote: note }
        : task
    ));
    toast({
      title: "Task Acknowledged",
      description: "Task has been marked as acknowledged"
    });
  };

  const handleTaskCompletion = (taskId: string, note: string, images: string[]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completionNote: note, completionImages: images }
        : task
    ));
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed"
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Team Task Management</h1>
          </div>
        </div>

        <Tabs defaultValue={teams[0].toLowerCase().split(' ')[0]} className="space-y-4">
          <TabsList>
            {teams.map(team => (
              <TabsTrigger key={team} value={team.toLowerCase().split(' ')[0]}>
                {team}
              </TabsTrigger>
            ))}
          </TabsList>

          {teams.map(team => (
            <TabsContent 
              key={team} 
              value={team.toLowerCase().split(' ')[0]} 
              className="space-y-4"
            >
              <TaskList
                tasks={tasks}
                teamName={team}
                teamMembers={teamMembers}
                onAcknowledge={handleTaskAcknowledgment}
                onComplete={handleTaskCompletion}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
