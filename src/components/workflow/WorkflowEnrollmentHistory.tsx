import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCw, ArrowUpDown, History, Clock, UserCheck, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

interface ContactHistory {
  date: string;
  action: string;
  status: string;
  details: string;
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
  const [selectedContactForHistory, setSelectedContactForHistory] = useState<Contact | null>(null);
  const [selectedContactForDetails, setSelectedContactForDetails] = useState<Contact | null>(null);
  const [contactHistory, setContactHistory] = useState<ContactHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);

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

  // Mock contact history data - Replace with actual API call
  const fetchContactHistory = (contactId: string) => {
    // Simulate API call
    const mockHistory: ContactHistory[] = [
      {
        date: format(new Date(), "MMM dd, yyyy HH:mm:ss"),
        action: "Workflow Started",
        status: "Completed",
        details: "Contact entered the workflow"
      },
      {
        date: format(new Date(Date.now() - 24 * 60 * 60 * 1000), "MMM dd, yyyy HH:mm:ss"),
        action: "Email Sent",
        status: "Completed",
        details: "Welcome email sent to contact"
      },
      {
        date: format(new Date(Date.now() - 48 * 60 * 60 * 1000), "MMM dd, yyyy HH:mm:ss"),
        action: "Tag Added",
        status: "Completed",
        details: "Added to workflow via tag"
      }
    ];
    setContactHistory(mockHistory);
  };

  const handleViewHistory = (contact: Contact) => {
    setSelectedContactForHistory(contact);
    fetchContactHistory(contact.id);
    setIsHistoryOpen(true);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContactForDetails(contact);
    setIsContactDetailsOpen(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Header Section with enhanced styling */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 sticky top-0 z-10 shadow-sm flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Enrollment History</h2>
        <p className="text-sm text-gray-500 mt-1">
          View a history of all the Contacts that have entered this Workflow
        </p>
      </div>

      {/* Filters Section with enhanced styling */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Filters */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] border-gray-300 bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {startDate ? format(startDate, "PPP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] border-gray-300 bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {endDate ? format(endDate, "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Event Type Filter */}
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[180px] border-gray-300 bg-white">
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
            <SelectTrigger className="w-[180px] border-gray-300 bg-white">
              <SelectValue placeholder="Select Contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button 
            variant="outline" 
            className="border-gray-300 bg-white hover:bg-gray-50 text-gray-600"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setSelectedEvent("All Events");
              setSelectedContact("all");
            }}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Main content area with scroll */}
      <div className="flex-1 overflow-auto px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-4">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-900">Contact</div>
            <div className="text-sm font-semibold text-gray-900">Enrollment Reason</div>
            <div className="text-sm font-semibold text-gray-900">
              <div className="flex items-center gap-2">
                Date Enrolled
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">Current Action</div>
            <div className="text-sm font-semibold text-gray-900">Current Status</div>
            <div className="text-sm font-semibold text-gray-900">Next Execution</div>
            <div className="text-sm font-semibold text-gray-900">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {enrollments.map((record) => (
              <div key={record.id} className="grid grid-cols-7 gap-4 px-4 py-3 items-center hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium ${
                    record.contact.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {record.contact.initials}
                  </div>
                  <span className="font-medium text-gray-900">{record.contact.name}</span>
                </div>
                <div className="text-sm text-gray-600">{record.enrollmentReason}</div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {record.dateEnrolled}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{record.currentAction}</div>
                <div>
                  <Badge className={getStatusStyles(record.currentStatus)}>
                    {record.currentStatus}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {record.nextExecution || "Not Available"}
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <History className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View History</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <UserCheck className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Contact</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
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

      {/* Contact History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Contact History - {selectedContactForHistory?.name}</DialogTitle>
            <DialogDescription>
              Workflow actions and events history
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {contactHistory.map((history, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{history.action}</div>
                  <Badge variant={history.status === "Completed" ? "default" : "secondary"}>
                    {history.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{history.details}</div>
                <div className="text-xs text-muted-foreground">{history.date}</div>
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Contact Details Drawer */}
      <Drawer open={isContactDetailsOpen} onOpenChange={setIsContactDetailsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Contact Details</DrawerTitle>
            <DrawerDescription>
              Detailed information about {selectedContactForDetails?.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {selectedContactForDetails && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium ${
                    selectedContactForDetails.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {selectedContactForDetails.initials}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedContactForDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selectedContactForDetails.id}</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <Badge variant={selectedContactForDetails.status === 'active' ? "default" : "secondary"}>
                      {selectedContactForDetails.status.charAt(0).toUpperCase() + selectedContactForDetails.status.slice(1)}
                    </Badge>
                  </div>
                  {/* Add more contact details sections as needed */}
                </div>
              </>
            )}
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsContactDetailsOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
} 