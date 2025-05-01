import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
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
import { RefreshCw, Clock, RotateCw } from "lucide-react";
import { WorkflowNavigation } from './components/WorkflowNavigation';

interface EnrollmentRecord {
  contact: {
    initials: string;
    name: string;
  };
  enrollmentReason: string;
  dateEnrolled: string;
  currentAction: string;
  currentStatus: string;
  nextExecution: string;
}

export default function WorkflowEnrollmentHistory() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedContact, setSelectedContact] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("10");

  // Sample data - replace with actual data fetching
  const enrollmentData: EnrollmentRecord[] = [
    {
      contact: { initials: "NS", name: "nikki scarrabelotti" },
      enrollmentReason: "Contact Tag - T...",
      dateEnrolled: "Apr 30th, 2:31:45 pm",
      currentAction: "Wait",
      currentStatus: "Finished",
      nextExecution: "Not Available"
    },
    {
      contact: { initials: "G", name: "gwen" },
      enrollmentReason: "Contact Tag - T...",
      dateEnrolled: "Apr 29th, 2:39:09 pm",
      currentAction: "Wait",
      currentStatus: "Finished",
      nextExecution: "Not Available"
    },
    {
      contact: { initials: "MH", name: "matt hundy" },
      enrollmentReason: "Contact Tag - T...",
      dateEnrolled: "Apr 29th, 2:21:27 pm",
      currentAction: "Wait",
      currentStatus: "Finished",
      nextExecution: "Not Available"
    }
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <WorkflowNavigation />
        
        <h1 className="text-2xl font-semibold mb-2">Enrollment History</h1>
        <p className="text-muted-foreground mb-6">
          View a history of all the Contacts that have entered this Workflow
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                className="w-40 px-3 py-2 rounded-md border"
                placeholder="Start Date"
                value={startDate ? format(startDate, 'MMM dd, yyyy') : ''}
                readOnly
              />
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border z-10"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-40 px-3 py-2 rounded-md border"
                placeholder="End Date"
                value={endDate ? format(endDate, 'MMM dd, yyyy') : ''}
                readOnly
              />
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border z-10"
              />
            </div>
          </div>

          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="tag-added">Tag Added</SelectItem>
              <SelectItem value="form-submitted">Form Submitted</SelectItem>
              <SelectItem value="manual">Manual Entry</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedContact} onValueChange={setSelectedContact}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Contact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              {enrollmentData.map((record, index) => (
                <SelectItem key={index} value={record.contact.name.toLowerCase().replace(/\s+/g, '-')}>
                  {record.contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="ml-auto">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Enrollment Reason</th>
                <th className="text-left p-4">Date Enrolled (AEST +10:00)</th>
                <th className="text-left p-4">Current Action</th>
                <th className="text-left p-4">Current Status</th>
                <th className="text-left p-4">Next Execution On (AEST +10:00)</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentData.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                        {record.contact.initials}
                      </div>
                      <span>{record.contact.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{record.enrollmentReason}</td>
                  <td className="p-4">{record.dateEnrolled}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {record.currentAction}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      {record.currentStatus}
                    </span>
                  </td>
                  <td className="p-4">{record.nextExecution}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t flex items-center justify-between">
            <div>Showing Page 1</div>
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 