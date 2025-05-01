import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Clock, RotateCw } from "lucide-react";
import { format } from "date-fns";

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

export function EnrollmentHistory() {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

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
    // Add more sample records as needed
  ];

  return (
    <div className="p-6">
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
              className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border"
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
              className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border"
            />
          </div>
        </div>

        <Select defaultValue="all-events">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-events">All Events</SelectItem>
            {/* Add more event options */}
          </SelectContent>
        </Select>

        <Select defaultValue="select-contact">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Contact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select-contact">Select Contact</SelectItem>
            {/* Add contact options */}
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
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
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
            <Select defaultValue="10">
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
  );
} 