import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const Tab = ({ label, active, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 hover:text-blue-600 relative",
      active
        ? "border-blue-600 text-blue-600 shadow-sm"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:shadow-sm"
    )}
  >
    {label}
  </button>
);

export const CustomerTabs = () => {
  const [activeTab, setActiveTab] = React.useState('contacts');

  const tabs = [
    { id: 'contacts', label: 'Contacts' },
    { id: 'smart-lists', label: 'Smart Lists' },
    { id: 'bulk-actions', label: 'Bulk Actions' },
    { id: 'restore', label: 'Restore' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'companies', label: 'Companies' },
    { id: 'manage-smart-lists', label: 'Manage Smart Lists' },
  ];

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-3 shadow-sm">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      
      <Button variant="ghost" size="sm" className="p-2">
        <Settings className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
};