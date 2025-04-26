
import type { Job } from '@/types/job';

export const mockJobs: Job[] = [
  {
    id: "1",
    customer: "John Smith",
    type: "Plumbing",
    status: "ready",
    date: "2024-03-15",
    location: [151.2093, -33.8688],
    jobNumber: "JOB-1234",
    title: "Water Heater Installation",
    description: "Install new water heater system",
    assignedTeam: "Red Team",
    boundaries: [
      [
        [151.2073, -33.8668],
        [151.2113, -33.8668],
        [151.2113, -33.8708],
        [151.2073, -33.8708],
        [151.2073, -33.8668]
      ]
    ]
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "JOB-5678",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team",
    boundaries: [
      [
        [151.2523, -33.8668],
        [151.2563, -33.8668],
        [151.2563, -33.8708],
        [151.2523, -33.8708],
        [151.2523, -33.8668]
      ]
    ]
  },
  {
    id: "3",
    customer: "Mike Brown",
    type: "Electrical",
    status: "to-invoice",
    date: "2024-03-13",
    location: [151.1943, -33.8788],
    jobNumber: "JOB-9012",
    title: "Electrical Panel Upgrade",
    description: "Upgrade main electrical panel",
    assignedTeam: "Green Team"
  }
];
