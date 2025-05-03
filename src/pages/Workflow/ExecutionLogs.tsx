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
import { Badge } from "@/components/ui/badge";

export default function ExecutionLogs() {
  // TODO: Implement actual execution logs data fetching
  const mockLogs = [
    {
      id: 1,
      workflowName: 'Customer Onboarding',
      executedAt: '2024-03-20T10:30:00',
      status: 'Completed',
      duration: '2m 30s',
      triggeredBy: 'System'
    },
    {
      id: 2,
      workflowName: 'Invoice Processing',
      executedAt: '2024-03-20T09:15:00',
      status: 'Failed',
      duration: '45s',
      triggeredBy: 'John Doe'
    },
    {
      id: 3,
      workflowName: 'Data Sync',
      executedAt: '2024-03-20T08:00:00',
      status: 'Running',
      duration: '5m',
      triggeredBy: 'Schedule'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <WorkflowNavigation />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workflow Execution Logs</h1>
        <p className="text-gray-500 mt-2">Monitor and track workflow executions</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead>Executed At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Triggered By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.workflowName}</TableCell>
              <TableCell>{new Date(log.executedAt).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(log.status)}`}>
                  {log.status}
                </span>
              </TableCell>
              <TableCell>{log.duration}</TableCell>
              <TableCell>{log.triggeredBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 