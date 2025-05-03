import React from 'react';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EnrollmentHistory() {
  // TODO: Implement actual enrollment history data fetching
  const mockHistory = [
    {
      id: 1,
      workflowName: 'Customer Onboarding',
      enrolledAt: '2024-03-20',
      status: 'Active',
      enrolledBy: 'John Doe'
    },
    {
      id: 2,
      workflowName: 'Invoice Processing',
      enrolledAt: '2024-03-19',
      status: 'Completed',
      enrolledBy: 'Jane Smith'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <WorkflowNavigation />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workflow Enrollment History</h1>
        <p className="text-gray-500 mt-2">Track workflow enrollments and their status</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead>Enrolled At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrolled By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockHistory.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.workflowName}</TableCell>
              <TableCell>{new Date(entry.enrolledAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  entry.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {entry.status}
                </span>
              </TableCell>
              <TableCell>{entry.enrolledBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 