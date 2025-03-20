
import { useState, useEffect } from "react";
import { Task, TeamMember } from "./types";
import { useToast } from "@/hooks/use-toast";
import { TaskTabs } from "./TaskTabs";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Fetch tasks from Supabase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');
          
        if (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: "Error Loading Tasks",
            description: "Could not load tasks. Please try again later.",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Transform Supabase data to match our Task interface
          const formattedTasks: Task[] = data.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            assignedTeam: task.assigned_team,
            status: task.status,
            teamLeaderId: task.team_leader_id,
            managerId: task.manager_id,
            assignedManager: task.assigned_manager || '',
            attachedFiles: task.attached_files ? JSON.parse(task.attached_files) : []
          }));
          
          setTasks(formattedTasks);
        }
      } catch (err) {
        console.error('Error in fetchTasks:', err);
      }
    };
    
    fetchTasks();
  }, [toast]);
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTeam) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create the local task object
    const taskId = crypto.randomUUID();
    const task: Task = {
      id: taskId,
      ...newTask,
      status: 'pending',
      attachedFiles: newTask.attachedFiles
    };
    
    // Add to local state immediately for responsive UI
    setTasks([...tasks, task]);
    
    // Reset the form
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
    
    // Save to Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: taskId,
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          assigned_team: task.assignedTeam,
          team_leader_id: task.teamLeaderId || null,
          manager_id: task.managerId || null,
          attached_files: JSON.stringify(task.attachedFiles),
          status: 'pending'
        });
        
      if (error) {
        console.error('Error saving task:', error);
        toast({
          title: "Error Saving Task",
          description: "Task was created locally but could not be saved to the database.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Task Added",
        description: `New task has been created and assigned to ${task.assignedTeam}`
      });
    } catch (err) {
      console.error('Error in handleAddTask:', err);
      toast({
        title: "Error Saving Task",
        description: "An unexpected error occurred. Task was created locally but may not be saved.",
        variant: "destructive"
      });
    }
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
  
  const handleTaskAcknowledgment = async (taskId: string, note: string) => {
    // Update local state
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'acknowledged',
      acknowledgmentNote: note
    } : task));
    
    // Update in Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'acknowledged',
          acknowledgment_note: note,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error Updating Task",
          description: "Task was acknowledged locally but could not be updated in the database.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Task Acknowledged",
        description: "Task has been marked as acknowledged"
      });
    } catch (err) {
      console.error('Error in handleTaskAcknowledgment:', err);
    }
  };
  
  const handleTaskCompletion = async (taskId: string, note: string, images: string[]) => {
    // Update local state
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'completed',
      completionNote: note,
      completionImages: images
    } : task));
    
    // Update in Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completion_note: note,
          completion_images: JSON.stringify(images),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) {
        console.error('Error completing task:', error);
        toast({
          title: "Error Completing Task",
          description: "Task was marked as completed locally but could not be updated in the database.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Task Completed",
        description: "Task has been marked as completed"
      });
    } catch (err) {
      console.error('Error in handleTaskCompletion:', err);
    }
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
