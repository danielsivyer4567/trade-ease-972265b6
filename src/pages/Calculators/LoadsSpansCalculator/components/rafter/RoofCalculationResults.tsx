
import React from "react";
import { RoofSection } from "../../types/rafterRoof";

interface RoofCalculationResultsProps {
  sections: RoofSection[];
  totalArea: number;
}

export const RoofCalculationResults: React.FC<RoofCalculationResultsProps> = ({
  sections,
  totalArea
}) => {
  if (totalArea <= 0) return null;
  
  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
      <h3 className="font-medium text-amber-800">Results:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <p className="text-sm font-medium text-gray-500">Section Areas:</p>
          <ul className="list-disc list-inside">
            {sections.map((section, index) => (
              <li key={index} className="text-sm">
                Section {index + 1}: {section.area.toFixed(2)} m²
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center bg-white rounded-md p-4 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">
            Total Area: {totalArea.toFixed(2)} m²
          </p>
        </div>
      </div>
    </div>
  );
};
