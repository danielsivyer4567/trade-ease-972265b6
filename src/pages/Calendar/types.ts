
export interface Team {
  name: string;
  color: string;
}

export interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  date: string;
  location: [number, number];
  jobNumber: string;
  title: string;
  description: string;
  assignedTeam: string;
}
