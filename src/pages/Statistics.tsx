
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { TaskCreateForm } from "@/components/tasks/TaskCreateForm";
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

const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', role: 'team_leader' },
  { id: '2', name: 'Jane Smith', role: 'manager' },
];

export default function StatisticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTeam: '',
    assignedManager: '',
    teamLeaderId: '',
    managerId: '',
    attachedFiles: [] as string[]
  });
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTeam) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      status: 'pending'
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignedTeam: '',
      assignedManager: '',
      teamLeaderId: '',
      managerId: '',
      attachedFiles: []
    });

    toast({
      title: "Task Added",
      description: "New task has been created successfully"
    });
  };

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
            <BarChart className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Business Statistics & Team Tasks</h1>
          </div>
        </div>

        <KeyStatistics />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Team Tasks</h2>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList>
              <TabsTrigger value="create">Create Task</TabsTrigger>
              {teams.map(team => (
                <TabsTrigger key={team} value={team.toLowerCase().split(' ')[0]}>
                  {team}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <TaskCreateForm
                teams={teams}
                teamMembers={teamMembers}
                formData={newTask}
                onFormChange={(updates) => setNewTask({ ...newTask, ...updates })}
                onFileUpload={(files) => {
                  const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
                  setNewTask(prev => ({
                    ...prev,
                    attachedFiles: [...prev.attachedFiles, ...fileUrls]
                  }));
                }}
                onSubmit={handleAddTask}
              />
            </TabsContent>

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
      </div>
    </AppLayout>
  );
}
