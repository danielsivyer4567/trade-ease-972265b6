
export interface Job {
  id: string;
  jobNumber?: string;
  title?: string;
  customer: string;
  type: string;
  status: "ready" | "in-progress" | "to-invoice" | "invoiced";
  date: string;
  location: [number, number];
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
