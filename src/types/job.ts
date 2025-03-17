
export interface Job {
  id: string;
  customer: string;
  type: string;
  status: 'ready' | 'in-progress' | 'to-invoice' | 'invoiced' | 'clean-required';
  date: string;
  location: [number, number];
  address?: string;
  jobNumber: string;
  title: string;
  description?: string;
  assignedTeam?: string;
  assignedMemberId?: string;
  date_undecided?: boolean; // Add this property
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
