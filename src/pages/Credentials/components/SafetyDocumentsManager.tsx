import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Placeholder data - replace with actual data fetching
const mockDocuments = [
  { id: 'doc1', name: 'SWMS - Working at Heights', type: 'SWMS', version: '1.2', date: '2024-01-15' },
  { id: 'doc2', name: 'JSA - Electrical Panel Work', type: 'JSA', version: '1.0', date: '2024-02-01' },
  { id: 'doc3', name: 'Site Induction Checklist', type: 'Checklist', version: '2.0', date: '2023-11-20' },
  { id: 'doc4', name: 'SWMS - Excavation', type: 'SWMS', version: '1.5', date: '2024-03-10' },
];

export const SafetyDocumentsManager = () => {
  return (
    <Card className="bg-slate-50 border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Safety Documents Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold mb-2 text-slate-600">Available Documents</h3>
            {mockDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="p-3 border border-slate-300 rounded bg-white shadow-xs cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-blue-50 transition-all"
            >
                <p className="font-medium text-slate-800">{doc.name}</p>
                <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>Type: {doc.type} | Ver: {doc.version}</span>
                <span>Date: {doc.date}</span>
                </div>
            </div>
            ))}
        </div>

        {/* Placeholder for document upload section - styled */}
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-100 mt-6 hover:border-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
          <p className="text-slate-500 text-center">
            + Upload New Document (SWMS, JSA, etc.)
          </p>
          {/* Potential future location for <DocumentUploader /> */}
        </div>
      </CardContent>
    </Card>
  );
}; 