
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatDate } from "../utils/dateUtils";
import { ExpenseReport } from "../types";
import { Loader2, Download, FileText, Search, Calendar } from 'lucide-react';

// Sample data for demonstration
const sampleReports: ExpenseReport[] = [
  {
    id: '1',
    name: 'Q1 Expense Report',
    dateRange: {
      start: '2023-01-01',
      end: '2023-03-31',
    },
    totalAmount: 4250.75,
    expenseCount: 28,
    createdAt: '2023-04-02',
    status: 'approved',
    expenses: ['1', '2', '3'],
  },
  // ... more sample reports
];

const ExpenseReports = () => {
  const [reports] = useState<ExpenseReport[]>(sampleReports);
  // Changed from string to a valid type
  const [period, setPeriod] = useState<"month" | "week" | "quarter" | "year">("quarter");
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Expense Reports</span>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Create Report</span>
            </Button>
          </CardTitle>
          <CardDescription>Generate and download expense reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Search by name or ID..." className="pl-8" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Select value={period} onValueChange={(value: "month" | "week" | "quarter" | "year") => setPeriod(value)}>
                <SelectTrigger id="period" className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <DateRangePicker align="start" className="w-[280px]" />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>${report.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{report.expenseCount}</TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          report.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : report.status === 'draft' 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseReports;
