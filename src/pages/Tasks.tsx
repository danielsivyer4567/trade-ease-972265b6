
import { AppLayout } from "@/components/ui/AppLayout";
import { ListTodo, ArrowLeft } from "lucide-react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { TeamMember } from "@/components/tasks/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock data for teams
const teams = ['Red Team', 'Blue Team', 'Green Team'];

export default function TasksPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', role: 'team_leader' },
    { id: '2', name: 'Jane Smith', role: 'manager' },
    { id: '3', name: 'Mike Johnson', role: 'team_leader' },
    { id: '4', name: 'Sarah Wilson', role: 'manager' }
  ]);
  
  // Check if Supabase connection is established
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { count, error } = await supabase
          .from('task_cards')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection error:', error);
          toast({
            title: "Database Connection Error",
            description: "Could not connect to the database. Some features may not work correctly.",
            variant: "destructive"
          });
        } else {
          console.log('Supabase connected successfully. Task count:', count);
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
      }
    };
    
    checkSupabaseConnection();
  }, [toast]);
  
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <ListTodo className="h-8 w-8 text-gray-700 bg-slate-300" />
            <h1 className="text-3xl font-bold">Task Card Management</h1>
          </div>
        </div>

        <TaskManager teams={teams} teamMembers={teamMembers} />
      </div>
    </AppLayout>
  );
}
