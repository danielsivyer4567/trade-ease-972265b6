
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
          .from('task_cards')
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
            attachedFiles: task.attached_files ? task.attached_files : [],
            acknowledgmentNote: task.acknowledgment_note,
            completionNote: task.completion_note,
            completionImages: task.completion_images,
            progressNote: task.progress_note,
            progressFiles: task.progress_files
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
    
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('task_cards')
        .insert({
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.dueDate,
          assigned_team: newTask.assignedTeam,
          team_leader_id: newTask.teamLeaderId || null,
          manager_id: newTask.managerId || null,
          assigned_manager: newTask.assignedManager || null,
          attached_files: newTask.attachedFiles,
          status: 'pending'
        })
        .select();
        
      if (error) {
        console.error('Error saving task:', error);
        toast({
          title: "Error Saving Task",
          description: "Task could not be saved to the database.",
          variant: "destructive"
        });
        return;
      }
      
      // Add to local state with the new ID from Supabase
      if (data && data.length > 0) {
        const newTaskWithId: Task = {
          id: data[0].id,
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          assignedTeam: newTask.assignedTeam,
          assignedManager: newTask.assignedManager || '',
          teamLeaderId: newTask.teamLeaderId,
          managerId: newTask.managerId,
          status: 'pending',
          attachedFiles: newTask.attachedFiles
        };
        
        setTasks([...tasks, newTaskWithId]);
      }
      
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
      
      toast({
        title: "Task Added",
        description: `New task has been created and assigned to ${newTask.assignedTeam}`
      });
    } catch (err) {
      console.error('Error in handleAddTask:', err);
      toast({
        title: "Error Saving Task",
        description: "An unexpected error occurred. Please try again.",
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
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('task_cards')
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
          description: "Task could not be acknowledged. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTasks(tasks.map(task => task.id === taskId ? {
        ...task,
        status: 'acknowledged',
        acknowledgmentNote: note
      } : task));
      
      toast({
        title: "Task Acknowledged",
        description: "Task has been marked as acknowledged"
      });
    } catch (err) {
      console.error('Error in handleTaskAcknowledgment:', err);
    }
  };
  
  const handleTaskProgress = async (taskId: string, note: string, files: string[]) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('task_cards')
        .update({ 
          status: 'in_progress',
          progress_note: note,
          progress_files: files,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) {
        console.error('Error updating task progress:', error);
        toast({
          title: "Error Updating Task",
          description: "Task progress could not be saved. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setTasks(tasks.map(task => task.id === taskId ? {
        ...task,
        status: 'in_progress',
        progressNote: note,
        progressFiles: files
      } : task));
      
      toast({
        title: "Task In Progress",
        description: "Task has been marked as in progress"
      });
    } catch (err) {
      console.error('Error in handleTaskProgress:', err);
    }
  };
  
  const handleTaskCompletion = async (taskId: string, note: string, images: string[]) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('task_cards')
        .update({ 
          status: 'completed',
          completion_note: note,
          completion_images: images,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) {
        console.error('Error completing task:', error);
        toast({
          title: "Error Completing Task",
          description: "Task could not be marked as completed. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
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
      onProgress={handleTaskProgress}
      onComplete={handleTaskCompletion}
    />
  );
}
