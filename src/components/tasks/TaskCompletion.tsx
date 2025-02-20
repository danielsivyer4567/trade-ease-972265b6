
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tag } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { ImagesGrid } from "./ImagesGrid";
import { useToast } from "@/hooks/use-toast";

interface TaskCompletionProps {
  taskId: string;
  onComplete: () => void;
  completionNote: string;
  onCompletionNoteChange: (value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  completionFiles: string[];
}

export function TaskCompletion({
  taskId,
  onComplete,
  completionNote,
  onCompletionNoteChange,
  onFileUpload,
  completionFiles,
}: TaskCompletionProps) {
  const { toast } = useToast();

  return (
    <div className="space-y-6 border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`complete-${taskId}`}
          checked={false}
          onCheckedChange={onComplete}
        />
        <label htmlFor={`complete-${taskId}`}>
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

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Completion Notes</h4>
          <Textarea
            placeholder="Add completion notes (max 500 characters)..."
            value={completionNote}
            onChange={(e) => onCompletionNoteChange(e.target.value)}
            maxLength={500}
            className="w-full"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Upload Completion Evidence</h4>
          <div className="grid gap-4">
            <FileUpload
              onFileUpload={onFileUpload}
              label="Upload completion photos"
            />
            {completionFiles.length > 0 && (
              <ImagesGrid
                images={completionFiles}
                title="Completion Photos"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
