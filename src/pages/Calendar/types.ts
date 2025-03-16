
import { Job as GlobalJob } from '@/types/job';

export interface Team {
  name: string;
  color: string;
}

// Export the Job interface from the global type to ensure consistency
export type Job = GlobalJob;
