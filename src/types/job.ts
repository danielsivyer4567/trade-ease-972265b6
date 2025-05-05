export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced';
  date: string;
  location: [number, number];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  jobNumber: string;
  title: string;
  description?: string;
  assignedTeam?: string;
  assignedMemberId?: string;
  date_undecided?: boolean;
  job_steps?: JobStep[];
  boundaries?: Array<Array<[number, number]>>; // Array of polygon coordinates
}

export interface JobStep {
  id: number;
  title: string;
  tasks: string[];
  isCompleted: boolean;
}

export interface JobTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  estimatedDuration: number;
  price: number;
  materials?: string[];
  category?: string;
  images?: string[];
  rateType?: 'hourly' | 'squareMeter' | 'linearMeter';
  rates?: {
    hourly: number;
    squareMeter: number;
    linearMeter: number;
    materialsMarkup: number;
  };
}
