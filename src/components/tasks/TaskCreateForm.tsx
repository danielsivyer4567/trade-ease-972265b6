import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Upload } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
interface TeamMember {
  id: string;
  name: string;
  role: 'team_leader' | 'manager';
}
interface TaskCreateFormProps {
  teams: string[];
  teamMembers: TeamMember[];
  formData: {
    title: string;
    description: string;
    dueDate: string;
    assignedTeam: string;
    teamLeaderId: string;
    managerId: string;
    attachedFiles: string[];
  };
  onFormChange: (updates: Partial<TaskCreateFormProps['formData']>) => void;
  onFileUpload: (files: FileList) => void;
  onSubmit: () => void;
}
export function TaskCreateForm({
  teams,
  teamMembers,
  formData,
  onFormChange,
  onFileUpload,
  onSubmit
}: TaskCreateFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileUpload(event.target.files);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    if (files.length > 0) {
      onFileUpload(files as unknown as FileList);
    }
  };
  return <Card className="p-6 bg-slate-200">
      <form onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={formData.title} onChange={e => onFormChange({
          title: e.target.value
        })} placeholder="Enter task title" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={formData.description} onChange={e => onFormChange({
          description: e.target.value
        })} placeholder="Enter task description" />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <div className="relative">
            <Input id="dueDate" type="date" value={formData.dueDate} onChange={e => onFormChange({
            dueDate: e.target.value
          })} />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="team">Assigned Team</Label>
          <select id="team" className="w-full rounded-md border border-input bg-background px-3 py-2" value={formData.assignedTeam} onChange={e => onFormChange({
          assignedTeam: e.target.value
        })}>
            <option value="">Select a team</option>
            {teams.map(team => <option key={team} value={team}>{team}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="files">Attach Files</Label>
          <div className="mt-2">
            <label onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="cursor-pointer bg-slate-400">
              <div className={cn("flex items-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors duration-200", isDragging ? "bg-gray-100 border-gray-400" : "hover:bg-gray-50 border-gray-200")}>
                <Upload className="h-6 w-6 text-gray-400 bg-slate-200" />
                <span className="text-sm text-gray-600">
                  {isDragging ? "Drop files here..." : "Upload or drag files (Images and Videos)"}
                </span>
              </div>
              <input type="file" id="files" multiple className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          </div>
          {formData.attachedFiles.length > 0 && <div className="mt-2">
              <p className="text-sm text-gray-600">
                {formData.attachedFiles.length} file(s) attached
              </p>
            </div>}
        </div>

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </Card>;
}