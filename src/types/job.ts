
export interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  date: string;
  location: [number, number]; // Explicitly typed as tuple
}

export interface JobTemplate {
  id: string;
  title: string;
  estimatedDuration: string;
  materials: string[];
  price: string;
  description?: string;
  category?: string;
}
