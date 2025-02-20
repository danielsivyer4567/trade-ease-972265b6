
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, CirclePlay, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
  completionNote?: string;
  completionImages?: string[];
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
  const [completionNote, setCompletionNote] = useState<string>("");
  const [completionFiles, setCompletionFiles] = useState<string[]>([]);
  const [taskInProgress, setTaskInProgress] = useState<string | null>(null);
  const [progressNote, setProgressNote] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setCompletionFiles(prev => [...prev, ...fileUrls]);
    }
  };

  const handleAcknowledge = (taskId: string) => {
    onAcknowledge(taskId, "Task acknowledged by team");
  };

  const handleInProgress = (taskId: string) => {
    setTaskInProgress(taskId);
    setProgressNote("");
  };

  const handleComplete = (taskId: string) => {
    if (completionNote.length > 500) {
      alert("Completion note must be less than 500 characters");
      return;
    }
    onComplete(taskId, completionNote, completionFiles);
    setCompletionNote("");
    setCompletionFiles([]);
    setProgressNote("");
  };

  return (
    <div className="grid gap-4">
      {tasks
        .filter(task => task.assignedTeam === teamName)
        .map(task => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
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
            <CardContent className="space-y-4">
              <p className="text-gray-700">{task.description}</p>
              
              {task.attachedFiles && task.attachedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {task.attachedFiles.map((file, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={file} 
                        alt={`Attachment ${index + 1}`} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'placeholder.svg';
                          target.className = 'w-16 h-16 mx-auto mt-4';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Acknowledgment Checkbox */}
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

                {/* In Progress Checkbox */}
                {task.status === 'acknowledged' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`progress-${task.id}`}
                      checked={task.status === 'in_progress'}
                      onCheckedChange={() => handleInProgress(task.id)}
                    />
                    <label htmlFor={`progress-${task.id}`}>
                      Mark as In Progress
                    </label>
                  </div>
                )}

                {/* Completion Section */}
                {task.status === 'in_progress' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`complete-${task.id}`}
                        checked={task.status === 'completed'}
                        onCheckedChange={() => handleComplete(task.id)}
                      />
                      <label htmlFor={`complete-${task.id}`}>
                        Mark as Complete
                      </label>
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
                          onChange={(e) => handleFileUpload(e, task.id)}
                          accept="image/*,video/*"
                        />
                      </label>
                    </div>

                    {completionFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
