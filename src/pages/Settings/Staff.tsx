import React from 'react';
import { Users } from 'lucide-react';
import SettingsPageTemplate from './SettingsPageTemplate';

export default function StaffPage() {
  return (
    <SettingsPageTemplate 
      title="Staff Management" 
      icon={<Users className="h-7 w-7 text-gray-700" />}
    >
      <div className="max-w-3xl">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
          <p className="text-gray-600 mb-6">
            Manage all staff members across your organization
          </p>
          
          {/* Staff management interface will go here */}
          <div className="bg-gray-100 p-4 rounded-md">
            <p>Staff management interface is being implemented.</p>
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
} 