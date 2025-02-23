
export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced';
  date: string;
  location: [number, number];
  jobNumber: string;
  title?: string;
  description?: string;
  assignedTeam?: string;
  assignedMemberId?: string;
}

export interface JobTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  estimatedDuration: number;
}
