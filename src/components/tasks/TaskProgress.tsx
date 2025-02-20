
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { ImagesGrid } from "./ImagesGrid";

interface TaskProgressProps {
  taskId: string;
  onProgress: () => void;
  progressNote: string;
  onProgressNoteChange: (value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  progressFiles: string[];
  inProgress: boolean;
}

export function TaskProgress({
  taskId,
  onProgress,
  progressNote,
  onProgressNoteChange,
  onFileUpload,
  progressFiles,
  inProgress,
}: TaskProgressProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`progress-${taskId}`}
          checked={inProgress}
          onCheckedChange={onProgress}
        />
        <label htmlFor={`progress-${taskId}`}>
          Mark as In Progress
        </label>
      </div>

      <Textarea
        placeholder="Add progress notes (max 500 characters)..."
        value={progressNote}
        onChange={(e) => onProgressNoteChange(e.target.value)}
        maxLength={500}
        className="w-full"
      />

      <div className="flex gap-2">
        <FileUpload
          onFileUpload={onFileUpload}
          label="Upload progress files"
        />
      </div>

      <ImagesGrid
        images={progressFiles}
        title="Progress Files"
      />
    </div>
  );
}
