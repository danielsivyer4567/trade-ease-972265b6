
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TaskCreateForm } from "@/components/tasks/TaskCreateForm";
import { TaskList } from "@/components/tasks/TaskList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";

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
  { id: '3', name: 'Mike Johnson', role: 'team_leader' },
  { id: '4', name: 'Sarah Wilson', role: 'manager' },
];

export default function TasksPage() {
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

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasks = tasks.filter(task => task.status !== 'completed');

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
      status: 'pending',
      attachedFiles: newTask.attachedFiles
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
      description: `New task has been created and assigned to ${task.assignedTeam}`
    });
  };

  const handleFileUpload = (files: FileList) => {
    const fileUrls = Array.from(files).map(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        return URL.createObjectURL(file);
      }
      return '';
    }).filter(url => url !== '');

    setNewTask(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...fileUrls]
    }));

    toast({
      title: "Files Attached",
      description: `${fileUrls.length} file(s) have been attached to the task`
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
            <ListTodo className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Task Card Management</h1>
          </div>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList>
            <TabsTrigger value="create">Create Task</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
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
              onFileUpload={handleFileUpload}
              onSubmit={handleAddTask}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedTasks.map((task, index) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{task.title}</CardTitle>
                        <CardDescription>Completed by {task.assignedTeam}</CardDescription>
                      </div>
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{task.description}</p>
                    {task.completionNote && (
                      <div className="mt-4">
                        <h4 className="font-medium">Completion Note:</h4>
                        <p className="text-gray-600">{task.completionNote}</p>
                      </div>
                    )}
                    {task.completionImages && task.completionImages.length > 0 && (
                      <div className="mt-4">
                        <ImagesGrid
                          images={task.completionImages}
                          title="Completion Images"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {teams.map(team => (
            <TabsContent 
              key={team} 
              value={team.toLowerCase().split(' ')[0]} 
              className="space-y-4"
            >
              <TaskList
                tasks={activeTasks}
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
