
import { AppLayout } from "@/components/ui/AppLayout";
import { ListTodo } from "lucide-react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { TeamMember } from "@/components/tasks/types";

// Mock data
const teams = ['Red Team', 'Blue Team', 'Green Team'];
const teamMembers: TeamMember[] = [{
  id: '1',
  name: 'John Doe',
  role: 'team_leader'
}, {
  id: '2',
  name: 'Jane Smith',
  role: 'manager'
}, {
  id: '3',
  name: 'Mike Johnson',
  role: 'team_leader'
}, {
  id: '4',
  name: 'Sarah Wilson',
  role: 'manager'
}];

export default function TasksPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-[240px] mx-[70px] py-[3px] my-0">
            <ListTodo className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Task Card Management</h1>
          </div>
        </div>

        <TaskManager 
          teams={teams} 
          teamMembers={teamMembers} 
        />
      </div>
    </AppLayout>
  );
}
