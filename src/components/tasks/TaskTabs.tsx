
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCreateForm } from "./TaskCreateForm";
import { CompletedTasksList } from "./CompletedTasksList";
import { TaskList } from "./TaskList";
import { Task, TeamMember } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskTabsProps {
  teams: string[];
  newTask: {
    title: string;
    description: string;
    dueDate: string;
    assignedTeam: string;
    assignedManager: string;
    teamLeaderId: string;
    managerId: string;
    attachedFiles: string[];
  };
  onFormChange: (updates: Partial<TaskTabsProps['newTask']>) => void;
  onFileUpload: (files: FileList) => void;
  onAddTask: () => void;
  completedTasks: Task[];
  activeTasks: Task[];
  teamMembers: TeamMember[];
  onAcknowledge: (taskId: string, note: string) => void;
  onComplete: (taskId: string, note: string, images: string[]) => void;
}

export function TaskTabs({
  teams,
  newTask,
  onFormChange,
  onFileUpload,
  onAddTask,
  completedTasks,
  activeTasks,
  teamMembers,
  onAcknowledge,
  onComplete
}: TaskTabsProps) {
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="create" className="space-y-4">
      <TabsList className={`${isMobile ? 'flex flex-wrap gap-1' : ''}`}>
        <TabsTrigger value="create" className="bg-slate-300 hover:bg-slate-200">
          Create Task
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed Tasks
        </TabsTrigger>
        {teams.map(team => (
          <TabsTrigger key={team} value={team.toLowerCase().split(' ')[0]}>
            {isMobile ? team.split(' ')[0] : team}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <TaskCreateForm 
          teams={teams} 
          teamMembers={teamMembers} 
          formData={newTask} 
          onFormChange={onFormChange} 
          onFileUpload={onFileUpload} 
          onSubmit={onAddTask} 
        />
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        <CompletedTasksList tasks={completedTasks} />
      </TabsContent>

      {teams.map(team => (
        <TabsContent key={team} value={team.toLowerCase().split(' ')[0]} className="space-y-4">
          <TaskList 
            tasks={activeTasks} 
            teamName={team} 
            teamMembers={teamMembers} 
            onAcknowledge={onAcknowledge} 
            onComplete={onComplete} 
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
