
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTeam: string;
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
  acknowledgmentNote?: string;
  completionNote?: string;
  completionImages?: string[];
  attachedFiles?: string[];
  teamLeaderId?: string;
  managerId?: string;
  assignedManager: string;
  progressNote?: string;
  progressFiles?: string[];
  assignedMemberId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'team_leader' | 'manager';
}
