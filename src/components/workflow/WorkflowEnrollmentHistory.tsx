import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCw, ArrowUpDown, History, Clock, UserCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  status: 'active' | 'completed' | 'failed' | 'pending';
}

interface EnrollmentRecord {
  id: string;
  contact: Contact;
  enrollmentReason: string;
  dateEnrolled: string;
  currentAction: string;
  currentStatus: 'Finished' | 'In Progress' | 'Failed' | 'Pending';
  nextExecution: string | null;
}

export function WorkflowEnrollmentHistory() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [selectedContact, setSelectedContact] = useState("");
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Enhanced status colors and styles
  const getStatusStyles = (status: string) => {
    const styles = {
      Finished: "bg-green-100 text-green-800 border-green-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Failed: "bg-red-100 text-red-800 border-red-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockEnrollments: EnrollmentRecord[] = [
      {
        id: "1",
        contact: { id: "bs1", name: "Brad Scherf", initials: "BS", status: 'active' },
        enrollmentReason: "Contact stopb...",
        dateEnrolled: "Apr 30th, 5:35:15 pm",
        currentAction: "Remove From...",
        currentStatus: "Finished",
        nextExecution: null
      },
      {
        id: "2",
        contact: { id: "wr1", name: "Will Ross", initials: "WR", status: 'active' },
        enrollmentReason: "Contact stopb...",
        dateEnrolled: "Apr 30th, 3:52:26 pm",
        currentAction: "Remove From...",
        currentStatus: "Finished",
        nextExecution: null
      }
    ];
    setEnrollments(mockEnrollments);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Enrollment History</h2>
        <p className="text-muted-foreground">
          View a history of all the Contacts that have entered this Workflow
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4">
        {/* Date Range Picker */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Event Type Filter */}
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Events">All Events</SelectItem>
            <SelectItem value="Enrollment">Enrollment</SelectItem>
            <SelectItem value="Completion">Completion</SelectItem>
            <SelectItem value="Failure">Failure</SelectItem>
          </SelectContent>
        </Select>

        {/* Contact Filter */}
        <Select value={selectedContact} onValueChange={setSelectedContact}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Contact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Contacts</SelectItem>
            {/* Add contact options dynamically */}
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        <Button variant="outline" onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
          setSelectedEvent("All Events");
          setSelectedContact("");
        }}>
          <RotateCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Enrollment Table */}
      <ScrollArea className="h-[calc(100vh-400px)] rounded-md border">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="sticky top-0 bg-background border-b">
            <div className="grid grid-cols-7 gap-4 px-4 py-3 font-medium text-sm">
              <div>Contact</div>
              <div>Enrollment Reason</div>
              <div className="flex items-center gap-2">
                Date Enrolled
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
              <div>Current Action</div>
              <div>Current Status</div>
              <div>Next Execution</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {enrollments.map((record) => (
              <div key={record.id} className="grid grid-cols-7 gap-4 px-4 py-3 items-center hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium ${
                    record.contact.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {record.contact.initials}
                  </div>
                  <span className="font-medium">{record.contact.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{record.enrollmentReason}</div>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {record.dateEnrolled}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{record.currentAction}</div>
                <div>
                  <Badge className={getStatusStyles(record.currentStatus)}>
                    {record.currentStatus}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {record.nextExecution || "Not Available"}
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <History className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View History</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Contact</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, enrollments.length)} of {enrollments.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page * itemsPerPage >= enrollments.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 