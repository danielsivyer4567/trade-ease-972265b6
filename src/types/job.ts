export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced' | 'completed';
  date: string;
  location?: [number, number]; // Keep for backward compatibility
  locations?: Array<{
    coordinates: [number, number];
    address?: string;
    label?: string;
  }>;
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
  documents?: Array<{
    name: string;
    url: string;
    size?: number;
    type?: string;
    lastModified?: number;
  }>;
  documentationNotes?: string;
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
