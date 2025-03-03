
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCreateForm } from "./TaskCreateForm";
import { CompletedTasksList } from "./CompletedTasksList";
import { TaskList } from "./TaskList";
import { Task, TeamMember } from "./types";

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
  return (
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
