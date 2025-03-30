
import React from 'react';
import { ClipboardList } from 'lucide-react';

interface CategoryInfoBannerProps {
  category: string;
}

const CategoryInfoBanner = ({ category }: CategoryInfoBannerProps) => {
  if (category !== 'forms') return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <ClipboardList className="h-8 w-8 text-blue-600 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-blue-800">Form Automations</h3>
          <p className="text-sm text-blue-700 mt-1">
            These automations are triggered by form submissions and scheduled events. They help automate your form distribution, 
            follow-ups, and data collection processes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfoBanner;
