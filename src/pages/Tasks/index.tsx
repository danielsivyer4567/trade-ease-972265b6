
import { AppLayout } from "@/components/ui/AppLayout";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useState, useEffect } from "react";
import { TeamMember } from "@/components/tasks/types";

export default function Tasks() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Teams data
  const teams = ["Team Red", "Team Blue", "Team Green"];
  
  // Team members data (in a real app, this would be fetched from the database)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "John Smith", role: "team_leader" },
    { id: "2", name: "Sarah Johnson", role: "manager" },
    { id: "3", name: "Michael Brown", role: "team_leader" },
    { id: "4", name: "Emily Davis", role: "manager" },
  ]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <TaskManager teams={teams} teamMembers={teamMembers} />
      </div>
    </AppLayout>
  );
}
