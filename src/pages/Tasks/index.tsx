
import { AppLayout } from "@/components/ui/AppLayout";
import { TaskManager } from "@/components/tasks/TaskManager";

export default function Tasks() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <TaskManager />
      </div>
    </AppLayout>
  );
}
