
import React from "react";

interface TabContentsProps {
  tabId: string;
}

export const TabContents = ({ tabId }: TabContentsProps) => {
  // For now, we'll return placeholder content
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{tabId.charAt(0).toUpperCase() + tabId.slice(1)} Calculator</h2>
      <p className="text-gray-500">
        This calculator will be implemented soon. It will provide accurate measurements for {tabId} calculations
        based on Australian building standards.
      </p>
    </div>
  );
};
