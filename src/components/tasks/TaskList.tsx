
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, CirclePlay, Upload, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

export function TaskList({ tasks, teamName, teamMembers, onAcknowledge, onComplete }: TaskListProps) {
  const [progressNote, setProgressNote] = useState<string>("");
  const [progressFiles, setProgressFiles] = useState<string[]>([]);
  const [completionNote, setCompletionNote] = useState<string>("");
  const [completionFiles, setCompletionFiles] = useState<string[]>([]);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isProgress: boolean) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      if (isProgress) {
        setProgressFiles(prev => [...prev, ...fileUrls]);
      } else {
        setCompletionFiles(prev => [...prev, ...fileUrls]);
      }
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
    toast({
      title: "Task In Progress",
      description: "Status updated and team leader notified"
    });
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

  return (
    <div className="grid gap-4">
      {tasks
        .filter(task => task.assignedTeam === teamName)
        .map(task => (
          <Collapsible
            key={task.id}
            open={openTaskId === task.id}
            onOpenChange={(isOpen) => setOpenTaskId(isOpen ? task.id : null)}
          >
            <Card>
              <CardHeader className="relative">
                <CollapsibleTrigger className="absolute right-4 top-4">
                  {openTaskId === task.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </CollapsibleTrigger>
                <div className="flex justify-between items-start pr-8">
                  <CardTitle>{task.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                    task.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
                <CardDescription>Due by: {task.dueDate}</CardDescription>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <p className="text-gray-700">{task.description}</p>
                  
                  {/* Acknowledgment Section */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`acknowledge-${task.id}`}
                      checked={task.status !== 'pending'}
                      onCheckedChange={() => {
                        if (task.status === 'pending') {
                          handleAcknowledge(task.id);
                        }
                      }}
                      disabled={task.status !== 'pending'}
                    />
                    <label htmlFor={`acknowledge-${task.id}`}>
                      Acknowledge Task
                    </label>
                  </div>

                  {/* In Progress Section */}
                  {task.status === 'acknowledged' && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`progress-${task.id}`}
                          checked={false}
                          onCheckedChange={() => handleInProgress(task.id)}
                        />
                        <label htmlFor={`progress-${task.id}`}>
                          Mark as In Progress
                        </label>
                      </div>

                      <Textarea
                        placeholder="Add progress notes (max 500 characters)..."
                        value={progressNote}
                        onChange={(e) => setProgressNote(e.target.value)}
                        maxLength={500}
                        className="w-full"
                      />

                      <div className="flex gap-2">
                        <label className="flex-1">
                          <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Upload className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload progress files</span>
                          </div>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, true)}
                            accept="image/*,video/*"
                          />
                        </label>
                      </div>

                      {progressFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {progressFiles.map((file, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={file} 
                                alt={`Progress file ${index + 1}`} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completion Section */}
                  {task.status === 'in_progress' && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`complete-${task.id}`}
                          checked={false}
                          onCheckedChange={() => handleComplete(task.id)}
                        />
                        <label htmlFor={`complete-${task.id}`}>
                          Mark as Complete
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            toast({
                              title: "Team Leader Tagged",
                              description: "Team leader has been notified of task completion"
                            });
                          }}
                        >
                          <Tag className="h-4 w-4 mr-1" />
                          Tag Team Leader
                        </Button>
                      </div>

                      <Textarea
                        placeholder="Add completion notes (max 500 characters)..."
                        value={completionNote}
                        onChange={(e) => setCompletionNote(e.target.value)}
                        maxLength={500}
                        className="w-full"
                      />

                      <div className="flex gap-2">
                        <label className="flex-1">
                          <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Upload className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload completion files</span>
                          </div>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, false)}
                            accept="image/*,video/*"
                          />
                        </label>
                      </div>

                      {completionFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {completionFiles.map((file, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={file} 
                                alt={`Completion file ${index + 1}`} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
    </div>
  );
}
