
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FilePlus, Download, Eye } from "lucide-react";

interface CustomerFormsProps {
  customerId: string;
}

interface FormData {
  id: string;
  name: string;
  type: string;
  dateSubmitted: string;
  status: 'completed' | 'pending' | 'expired';
}

export function CustomerForms({ customerId }: CustomerFormsProps) {
  // Sample data - in a real app, fetch from your database
  const forms: FormData[] = [
    {
      id: '1',
      name: 'Customer Information Form',
      type: 'onboarding',
      dateSubmitted: '2024-04-10T09:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Project Requirements',
      type: 'project',
      dateSubmitted: '2024-04-15T14:20:00Z',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Post-Service Feedback',
      type: 'feedback',
      dateSubmitted: '',
      status: 'pending'
    }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not submitted';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Customer Forms</h3>
        <Button size="sm" className="flex items-center gap-1">
          <FilePlus className="h-4 w-4" />
          <span>Send New Form</span>
        </Button>
      </div>
      
      {forms.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell className="capitalize">{form.type}</TableCell>
                    <TableCell>{formatDate(form.dateSubmitted)}</TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {form.status === 'completed' && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {form.status === 'pending' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileCheck className="h-4 w-4" />
                            <span>Send Reminder</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-10">
          <FileCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium mb-1">No Forms Yet</h3>
          <p className="text-sm text-gray-500 mb-4">This customer hasn't been sent any forms yet</p>
          <Button size="sm" className="flex items-center gap-1 mx-auto">
            <FilePlus className="h-4 w-4" />
            <span>Send First Form</span>
          </Button>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
        <h4 className="font-medium text-blue-800 mb-1">Form Management</h4>
        <p className="text-sm text-blue-600">
          Keep track of all customer forms in one place. Send new forms, view submissions, and keep your customer records organized.
        </p>
      </div>
    </div>
  );
}
