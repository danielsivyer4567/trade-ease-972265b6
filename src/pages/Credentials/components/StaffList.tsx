import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Mock data with compliance status
const mockStaff = [
  { id: 'staff1', name: 'Alice Johnson', role: 'Employee', type: 'Site Manager', status: 'Compliant' },
  { id: 'staff2', name: 'Bob Williams', role: 'Contractor', type: 'Electrician', status: 'Incomplete' },
  { id: 'staff3', name: 'Charlie Brown', role: 'Employee', type: 'Safety Officer', status: 'Compliant' },
  { id: 'staff4', name: 'David Lee', role: 'Contractor', type: 'Plumber', status: 'Pending' },
];

// Helper to get status color (can be shared or defined locally)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Compliant': return 'bg-green-500';
    case 'Incomplete': return 'bg-red-500';
    case 'Pending': return 'bg-yellow-400';
    default: return 'bg-gray-400';
  }
};

export const StaffList = () => {
  return (
    // Added subtle background and border
    <Card className="bg-slate-50 border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-700">Staff & Contractors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockStaff.map((person) => (
           // Styling for drop target indication on hover
          <div 
            key={person.id} 
            className="p-3 border border-slate-300 rounded bg-white shadow-xs hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center">
                {/* Status Indicator Dot */}
                <span 
                  title={`Status: ${person.status}`}
                  className={`w-3 h-3 rounded-full ${getStatusColor(person.status)} flex-shrink-0 mr-3`}
                />
                <div>
                    <p className="font-medium text-slate-800">{person.name}</p>
                    <p className="text-sm text-slate-500">{person.type}</p>
                </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${person.role === 'Employee' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {person.role}
            </span>
          </div>
        ))}
        {/* Add Staff/Contractor Button Placeholder - styled */}
        <div className="p-3 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-400 cursor-pointer mt-3 transition-colors">
            <span>+ Add Person</span>
        </div>
      </CardContent>
    </Card>
  );
}; 