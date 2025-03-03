
import { useState } from "react";
import { Task, TeamMember } from "./types";
import { useToast } from "@/hooks/use-toast";
import { TaskTabs } from "./TaskTabs";

interface TaskManagerProps {
  initialTasks?: Task[];
  teams: string[];
  teamMembers: TeamMember[];
}

export function TaskManager({ initialTasks = [], teams, teamMembers }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
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
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'acknowledged',
      acknowledgmentNote: note
    } : task));
    
    toast({
      title: "Task Acknowledged",
      description: "Task has been marked as acknowledged"
    });
  };
  
  const handleTaskCompletion = (taskId: string, note: string, images: string[]) => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'completed',
      completionNote: note,
      completionImages: images
    } : task));
    
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed"
    });
  };
  
  return (
    <TaskTabs
      teams={teams}
      newTask={newTask}
      onFormChange={updates => setNewTask({...newTask, ...updates})}
      onFileUpload={handleFileUpload}
      onAddTask={handleAddTask}
      completedTasks={completedTasks}
      activeTasks={activeTasks}
      teamMembers={teamMembers}
      onAcknowledge={handleTaskAcknowledgment}
      onComplete={handleTaskCompletion}
    />
  );
}
