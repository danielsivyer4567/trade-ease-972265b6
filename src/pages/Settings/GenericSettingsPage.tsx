
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsPageTemplate from "./SettingsPageTemplate";

export default function GenericSettingsPage() {
  const { settingType } = useParams();
  const navigate = useNavigate();
  
  // Convert route parameter to title format (e.g., "time-sheets" to "Time Sheets")
  const formatTitle = (str: string) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const title = settingType ? formatTitle(settingType) : "Settings";

  return (
    <SettingsPageTemplate 
      title={title} 
      icon={<Settings className="h-7 w-7 text-gray-700" />}
    >
      <div className="max-w-3xl">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="text-yellow-700">
            This settings page is currently under development. Check back soon for updates!
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{title} Configuration</h2>
          <p className="text-gray-600">
            This feature will allow you to configure {title.toLowerCase()} settings for your Trade App.
          </p>
          
          <div className="mt-8">
            <Button onClick={() => navigate('/settings')}>
              Return to Settings
            </Button>
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
}
