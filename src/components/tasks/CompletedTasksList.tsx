
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ImagesGrid } from "./ImagesGrid";
import { Task } from "./types";

interface CompletedTasksListProps {
  tasks: Task[];
}

export function CompletedTasksList({ tasks }: CompletedTasksListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>Completed by {task.assignedTeam}</CardDescription>
              </div>
              <TaskStatusBadge status={task.status} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{task.description}</p>
            {task.completionNote && (
              <div className="mt-4">
                <h4 className="font-medium">Completion Note:</h4>
                <p className="text-gray-600">{task.completionNote}</p>
              </div>
            )}
            {task.completionImages && task.completionImages.length > 0 && (
              <div className="mt-4">
                <ImagesGrid images={task.completionImages} title="Completion Images" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
