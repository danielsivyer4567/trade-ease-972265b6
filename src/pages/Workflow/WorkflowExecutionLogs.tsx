import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { RefreshCw, Activity, AlertCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ExecutionLog {
  id: string;
  workflowName: string;
  status: 'success' | 'error' | 'running';
  startTime: string;
  endTime: string;
  duration: string;
  triggeredBy: string;
  details?: string;
}

export default function WorkflowExecutionLogs() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedWorkflow, setSelectedWorkflow] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sample data - replace with actual data fetching
  const executionLogs: ExecutionLog[] = [
    {
      id: "1",
      workflowName: "Customer Onboarding",
      status: "success",
      startTime: "May 1st, 10:15:30 am",
      endTime: "May 1st, 10:16:45 am",
      duration: "1m 15s",
      triggeredBy: "System",
      details: "Successfully completed customer onboarding workflow:\n" +
        "- Created customer profile\n" +
        "- Sent welcome email\n" +
        "- Assigned onboarding tasks\n" +
        "- Updated CRM records\n" +
        "- Generated customer portal access"
    },
    {
      id: "2",
      workflowName: "Quote Follow-up",
      status: "error",
      startTime: "May 1st, 9:30:00 am",
      endTime: "May 1st, 9:30:05 am",
      duration: "5s",
      triggeredBy: "Manual",
      details: "Failed to send follow-up email:\n" +
        "- Error: Invalid recipient address\n" +
        "- Attempted to send to: john.doe@example\n" +
        "- Workflow step: Email Notification\n" +
        "- Retry scheduled for: May 1st, 10:30:00 am"
    },
    {
      id: "3",
      workflowName: "Job Completion",
      status: "running",
      startTime: "May 1st, 8:00:00 am",
      endTime: "-",
      duration: "Running",
      triggeredBy: "Schedule",
      details: "Currently processing job completion workflow:\n" +
        "- Step 1/5: Verifying job details ✓\n" +
        "- Step 2/5: Processing final invoice ✓\n" +
        "- Step 3/5: Sending customer survey (In Progress)\n" +
        "- Step 4/5: Updating job status (Pending)\n" +
        "- Step 5/5: Archiving project files (Pending)"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'running':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (log: ExecutionLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const filteredLogs = executionLogs.filter(log => {
    if (selectedStatus !== "all" && log.status !== selectedStatus) return false;
    if (selectedWorkflow !== "all" && log.workflowName.toLowerCase().replace(/\s+/g, '-') !== selectedWorkflow) return false;
    return true;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Execution Logs</h1>
        <p className="text-muted-foreground text-sm">
          View and monitor the execution history of your workflows
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal border-gray-300">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  {startDate ? format(startDate, "PPP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="rounded-md border border-gray-200"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal border-gray-300">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  {endDate ? format(endDate, "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="rounded-md border border-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue>
                {selectedStatus === "all" ? "All Status" : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="running">Running</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue>
                {selectedWorkflow === "all" ? "All Workflows" : 
                  executionLogs.find(log => log.workflowName.toLowerCase().replace(/\s+/g, '-') === selectedWorkflow)?.workflowName || 
                  "All Workflows"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {executionLogs.map((log) => (
                <SelectItem 
                  key={log.id} 
                  value={log.workflowName.toLowerCase().replace(/\s+/g, '-')}
                >
                  {log.workflowName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="icon" 
            className="ml-auto border-gray-300 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="min-w-[800px]">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-7 gap-4 px-4 py-3 font-semibold text-sm text-gray-700">
                <div>Workflow</div>
                <div>Status</div>
                <div>Start Time</div>
                <div>End Time</div>
                <div>Duration</div>
                <div>Triggered By</div>
                <div>Actions</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-7 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{log.workflowName}</span>
                  </div>
                  <div>
                    <Badge className={`${getStatusColor(log.status)} font-medium`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{log.startTime}</div>
                  <div className="text-sm text-gray-600">{log.endTime}</div>
                  <div className="text-sm text-gray-600">{log.duration}</div>
                  <div className="text-sm text-gray-600">{log.triggeredBy}</div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                      className="hover:bg-gray-100"
                    >
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[70px] border-gray-300">
              <SelectValue>{itemsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-gray-300"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage * itemsPerPage >= filteredLogs.length}
            className="border-gray-300"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Execution Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              Detailed information about the workflow execution
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Workflow</div>
                  <div className="text-sm text-gray-600">{selectedLog.workflowName}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Status</div>
                  <Badge className={`${getStatusColor(selectedLog.status)} font-medium`}>
                    {selectedLog.status.charAt(0).toUpperCase() + selectedLog.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Start Time</div>
                  <div className="text-sm text-gray-600">{selectedLog.startTime}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">End Time</div>
                  <div className="text-sm text-gray-600">{selectedLog.endTime}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Duration</div>
                  <div className="text-sm text-gray-600">{selectedLog.duration}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Triggered By</div>
                  <div className="text-sm text-gray-600">{selectedLog.triggeredBy}</div>
                </div>
              </div>
              {selectedLog.details && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 mb-2">Details</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{selectedLog.details}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 