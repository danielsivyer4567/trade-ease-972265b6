
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRafterRoofCalculator } from "./hooks/useRafterRoofCalculator";
import { RoofSectionInputs } from "./components/rafter/RoofSectionInputs";
import { RoofVisualization } from "./components/rafter/RoofVisualization";
import { RoofCalculationResults } from "./components/rafter/RoofCalculationResults";
import { ViewMode } from "./types/rafterRoof";

interface RafterRoofCalculatorProps {}

export const RafterRoofCalculator: React.FC<RafterRoofCalculatorProps> = () => {
  const {
    sections,
    totalArea,
    addSection,
    removeSection,
    updateSection,
    calculateTotalArea,
    setTotalArea
  } = useRafterRoofCalculator();
  
  const [viewMode, setViewMode] = useState<ViewMode>("stack");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Rafter Roof Area Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Add sections of your rafter roof to calculate the total area. Enter the height and length of each section.
          </p>
          
          <RoofSectionInputs
            sections={sections}
            updateSection={updateSection}
            removeSection={removeSection}
            addSection={addSection}
            calculateTotalArea={calculateTotalArea}
          />
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Roof Visualization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoofVisualization
            sections={sections}
            totalArea={totalArea}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <RoofCalculationResults
            sections={sections}
            totalArea={totalArea}
          />
        </CardContent>
      </Card>
    </>
  );
};
