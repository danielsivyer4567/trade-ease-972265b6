
export interface Job {
  id: string;
  customer: string;
  type: string;
  status: string;
  date: string;
  location: [number, number]; // Explicitly typed as tuple
}
