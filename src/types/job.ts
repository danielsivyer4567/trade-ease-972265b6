
export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced';
  date: string;
  location: [number, number];
  jobNumber: string;
  description?: string;
  assignedTeam?: string;
  assignedMemberId?: string;
}
