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
    <Card>
      <CardHeader>
        <CardTitle>Safety Documents Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold mb-2">Available Documents</h3>
            {mockDocuments.map((doc) => (
            <div key={doc.id} className="p-2 border rounded bg-white shadow-sm cursor-grab"> {/* Added cursor-grab */}
                <p className="font-medium">{doc.name}</p>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Type: {doc.type} | Ver: {doc.version}</span>
                <span>Date: {doc.date}</span>
                </div>
            </div>
            ))}
        </div>

        {/* Placeholder for document upload section */}
        <div className="p-6 border rounded-lg bg-gray-50 mt-4">
          <p className="text-gray-500 text-center">
            Upload new documents (SWMS, JSA, Licenses, Insurance, etc.) here.
          </p>
          {/* Potential future location for <DocumentUploader /> */}
        </div>
      </CardContent>
    </Card>
  );
}; 