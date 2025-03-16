
import { Job as GlobalJob } from '@/types/job';

export interface Team {
  name: string;
  color: string;
}

// Export the Job type directly from the global type for consistency
export type { GlobalJob as Job };
