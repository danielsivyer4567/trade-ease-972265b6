import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ImagesGrid } from "./ImagesGrid";
import { TaskProgress } from "./TaskProgress";
import { TaskCompletion } from "./TaskCompletion";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { FileUpload } from "./FileUpload";
import { Textarea } from "@/components/ui/textarea";
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
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
  acknowledgmentNote?: string;
  progressNote?: string;
  progressFiles?: string[];
  completionNote?: string;
  completionFiles?: string[];
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
interface TaskImage {
  url: string;
  note: string;
}
export function TaskList({
  tasks,
  teamName,
  teamMembers,
  onAcknowledge,
  onComplete
}: TaskListProps) {
  const [progressNote, setProgressNote] = useState<string>("");
  const [progressFiles, setProgressFiles] = useState<string[]>([]);
  const [completionNote, setCompletionNote] = useState<string>("");
  const [completionFiles, setCompletionFiles] = useState<string[]>([]);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [taskImages, setTaskImages] = useState<{
    [key: string]: TaskImage[];
  }>({});
  const {
    toast
  } = useToast();
  const handleTaskImageUpload = (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const files = event.target.files;
    if (files) {
      const newImages: TaskImage[] = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        note: ''
      }));
      setTaskImages(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), ...newImages]
      }));
      toast({
        title: "Images Uploaded",
        description: `${newImages.length} image(s) have been uploaded to the task`
      });
    }
  };
  const handleImageNoteChange = (taskId: string, imageIndex: number, note: string) => {
    setTaskImages(prev => {
      const taskImagesCopy = [...(prev[taskId] || [])];
      taskImagesCopy[imageIndex] = {
        ...taskImagesCopy[imageIndex],
        note
      };
      return {
        ...prev,
        [taskId]: taskImagesCopy
      };
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isProgress: boolean) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => {
        const url = URL.createObjectURL(file);
        console.log(`Created URL for ${isProgress ? 'progress' : 'completion'} file:`, url);
        return url;
      });
      if (isProgress) {
        setProgressFiles(prev => {
          const newFiles = [...prev, ...fileUrls];
          console.log('Updated progress files:', newFiles);
          return newFiles;
        });
      } else {
        setCompletionFiles(prev => {
          const newFiles = [...prev, ...fileUrls];
          console.log('Updated completion files:', newFiles);
          return newFiles;
        });
      }
      toast({
        title: "Files Uploaded",
        description: `${fileUrls.length} file(s) have been uploaded successfully`
      });
    }
  };
  const handleAcknowledge = (taskId: string) => {
    onAcknowledge(taskId, "Task acknowledged by team");
    toast({
      title: "Task Acknowledged",
      description: "Dashboard manager has been notified"
    });
  };
  const handleInProgress = (taskId: string) => {
    if (progressNote.length > 500) {
      toast({
        title: "Error",
        description: "Progress note must be less than 500 characters",
        variant: "destructive"
      });
      return;
    }
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status === 'acknowledged') {
      task.status = 'in_progress';
      toast({
        title: "Task In Progress",
        description: "Status updated and team leader notified"
      });
    }
  };
  const handleComplete = (taskId: string) => {
    if (completionNote.length > 500) {
      toast({
        title: "Error",
        description: "Completion note must be less than 500 characters",
        variant: "destructive"
      });
      return;
    }
    onComplete(taskId, completionNote, completionFiles);
    setCompletionNote("");
    setCompletionFiles([]);
    toast({
      title: "Task Completed",
      description: "Dashboard manager and team leader have been notified"
    });
  };
  const isTaskInProgressOrCompleted = (task: Task) => {
    return task.status === 'in_progress' || task.status === 'completed';
  };
  return <div className="grid gap-4">
      {tasks.filter(task => task.assignedTeam === teamName).map((task, index) => <Collapsible key={task.id} open={openTaskId === task.id} onOpenChange={isOpen => setOpenTaskId(isOpen ? task.id : null)}>
            <Card>
              <CardHeader className="relative">
                <CollapsibleTrigger className="w-full text-left flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Task card #{index + 1}</span>
                      <CardTitle>{task.title}</CardTitle>
                    </div>
                    <CardDescription>Due by: {task.dueDate}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <TaskStatusBadge status={task.status} />
                    {openTaskId === task.id ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <p className="text-gray-700">{task.description}</p>

                  {task.attachedFiles && task.attachedFiles.length > 0 && <ImagesGrid images={task.attachedFiles} title="Attached Files" />}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Task Images</h4>
                      <FileUpload onFileUpload={e => handleTaskImageUpload(e, task.id)} label="Upload task images" />
                    </div>
                    
                    {taskImages[task.id]?.length > 0 && <div className="space-y-4">
                        {taskImages[task.id].map((image, index) => <div key={index} className="space-y-2">
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img src={image.url} alt={`Task image ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <Textarea placeholder="Add a note about this image..." value={image.note} onChange={e => handleImageNoteChange(task.id, index, e.target.value)} className="w-full min-h-[80px]" />
                          </div>)}
                      </div>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id={`acknowledge-${task.id}`} checked={task.status !== 'pending'} onCheckedChange={() => {
                if (task.status === 'pending') {
                  handleAcknowledge(task.id);
                }
              }} disabled={task.status !== 'pending'} />
                    <label htmlFor={`acknowledge-${task.id}`} className="move this box to acknowledge task to original task upload only\n">
                      Acknowledge Task
                    </label>
                  </div>

                  {task.status === 'acknowledged' && <TaskProgress taskId={task.id} onProgress={() => handleInProgress(task.id)} progressNote={progressNote} onProgressNoteChange={setProgressNote} onFileUpload={e => handleFileUpload(e, true)} progressFiles={progressFiles} inProgress={isTaskInProgressOrCompleted(task)} />}

                  {task.status === 'in_progress' && <TaskCompletion taskId={task.id} onComplete={() => handleComplete(task.id)} completionNote={completionNote} onCompletionNoteChange={setCompletionNote} onFileUpload={e => handleFileUpload(e, false)} completionFiles={completionFiles} />}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>)}
    </div>;
}