import React from 'react';
import { Card } from '@/components/ui/card';
interface DocumentSummaryProps {
  documentCount: {
    insurance: number;
    general: number;
    jobRelated: number;
  };
  teamColor: string;
}
export function DocumentSummary({
  documentCount,
  teamColor
}: DocumentSummaryProps) {
  return <Card className="p-4 bg-slate-200">
      <h3 className="text-lg font-semibold mb-3 text-zinc-950">Document Summary</h3>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Insurance Documents</h4>
          <p className={`text-2xl font-bold text-${teamColor}-600`}>{documentCount.insurance}</p>
          <p className="text-sm text-gray-500">documents uploaded</p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
          <p className={`text-2xl font-bold text-${teamColor}-600`}>{documentCount.general}</p>
          <p className="text-sm text-gray-500">documents uploaded</p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Job Related Documents</h4>
          <p className={`text-2xl font-bold text-${teamColor}-600`}>{documentCount.jobRelated}</p>
          <p className="text-sm text-gray-500">documents uploaded</p>
        </div>
      </div>
    </Card>;
}