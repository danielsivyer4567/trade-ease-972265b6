
import React from "react";
import { FileText, Package, Calendar, Users, Laptop } from "lucide-react";

interface JobDetailsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function JobDetailsTabs({ activeTab, setActiveTab }: JobDetailsTabsProps) {
  const tabs = [
    { id: "details", label: "Details", icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: "resources", label: "Parts & Labour", icon: <Users className="w-4 h-4 mr-2" /> },
    { id: "stock", label: "Stock", icon: <Package className="w-4 h-4 mr-2" /> },
    { id: "schedule", label: "Schedule", icon: <Calendar className="w-4 h-4 mr-2" /> },
    { id: "assets", label: "Customer Assets", icon: <Laptop className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="border-b bg-gray-100">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
