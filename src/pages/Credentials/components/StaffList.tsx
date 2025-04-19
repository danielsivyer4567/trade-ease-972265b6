import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Placeholder data - replace with actual data fetching
const mockStaff = [
  { id: 'staff1', name: 'Alice Johnson', role: 'Employee', type: 'Site Manager' },
  { id: 'staff2', name: 'Bob Williams', role: 'Contractor', type: 'Electrician' },
  { id: 'staff3', name: 'Charlie Brown', role: 'Employee', type: 'Safety Officer' },
  { id: 'staff4', name: 'David Lee', role: 'Contractor', type: 'Plumber' },
];

export const StaffList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff & Contractors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockStaff.map((person) => (
          <div key={person.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{person.name}</p>
              <p className="text-sm text-gray-600">{person.type}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${person.role === 'Employee' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {person.role}
            </span>
          </div>
        ))}
        {/* Add Staff/Contractor Button Placeholder */}
        <div className="p-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer mt-2">
            <span className="text-gray-500">+ Add Person</span>
        </div>
      </CardContent>
    </Card>
  );
}; 