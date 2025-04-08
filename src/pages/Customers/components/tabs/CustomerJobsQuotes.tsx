
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clipboard } from "lucide-react";

interface CustomerJobsQuotesProps {
  jobHistory: Array<{
    job_id: string;
    title: string;
    job_number: string;
    date: string;
    status: string;
    amount?: number;
  }>;
  formatDate: (dateString: string) => string;
  onCreateJob?: (customerId: string) => void;
  onCreateQuote?: (customerId: string) => void;
  customerId: string;
}

export function CustomerJobsQuotes({ 
  jobHistory, 
  formatDate, 
  onCreateJob, 
  onCreateQuote,
  customerId 
}: CustomerJobsQuotesProps) {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-3">Jobs & Quotes History</h3>
      {jobHistory.length > 0 ? (
        <div className="space-y-3">
          {jobHistory.map(job => (
            <Card key={job.job_id} className="bg-slate-50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-gray-500">
                      {job.job_number} • {formatDate(job.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.amount && (
                      <span className="text-sm font-medium">
                        ${job.amount.toFixed(2)}
                      </span>
                    )}
                    <Badge variant="outline">{job.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No jobs or quotes yet</p>
          <div className="flex justify-center gap-2 mt-4">
            {onCreateQuote && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCreateQuote(customerId)}
              >
                <FileText className="h-4 w-4 mr-1" /> Create Quote
              </Button>
            )}
            {onCreateJob && (
              <Button 
                size="sm" 
                onClick={() => onCreateJob(customerId)}
              >
                <Clipboard className="h-4 w-4 mr-1" /> Create Job
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
