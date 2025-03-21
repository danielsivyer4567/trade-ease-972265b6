
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface StairsResult {
  numberOfRisers: number;
  riserHeight: number;
  treadDepth: number;
  totalRun: number;
  stairAngle: number;
  headroom: number;
  isCompliant: boolean;
  complianceNotes: string[];
}

export const useStairsCalculator = () => {
  const [floorToFloorHeight, setFloorToFloorHeight] = useState<string>("2600");
  const [availableRun, setAvailableRun] = useState<string>("3000");
  const [treadThickness, setTreadThickness] = useState<string>("30");
  const [desiredRiserHeight, setDesiredRiserHeight] = useState<string>("180");
  const [buildingType, setBuildingType] = useState<string>("residential");
  const [stairsResult, setStairsResult] = useState<StairsResult | null>(null);
  
  const { toast } = useToast();

  const calculateStairs = () => {
    if (!floorToFloorHeight || !availableRun || !treadThickness) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Convert inputs to numbers
    const floorHeight = parseFloat(floorToFloorHeight);
    const run = parseFloat(availableRun);
    const treadThick = parseFloat(treadThickness);
    const targetRiserHeight = desiredRiserHeight ? parseFloat(desiredRiserHeight) : 180;

    // Calculate the optimal number of risers
    const idealRisers = Math.round(floorHeight / targetRiserHeight);
    
    // Calculate actual riser height
    const actualRiserHeight = floorHeight / idealRisers;
    
    // Calculate tread depth (going)
    const treadDepth = run / (idealRisers - 1);
    
    // Calculate stair angle
    const stairAngle = Math.atan(actualRiserHeight / treadDepth) * (180 / Math.PI);
    
    // Calculate headroom (simplified)
    const headroom = 2000; // A standard value as a placeholder
    
    // Check compliance (based on building codes)
    const isResidential = buildingType === "residential";
    const minRiser = isResidential ? 115 : 150;
    const maxRiser = isResidential ? 190 : 180;
    const minTread = isResidential ? 240 : 280;
    const maxAngle = isResidential ? 38 : 36;
    
    const isCompliant = (
      actualRiserHeight >= minRiser &&
      actualRiserHeight <= maxRiser &&
      treadDepth >= minTread &&
      stairAngle <= maxAngle
    );
    
    // Generate compliance notes
    const complianceNotes = [];
    if (actualRiserHeight < minRiser) {
      complianceNotes.push(`Riser height (${actualRiserHeight.toFixed(1)}mm) is below minimum (${minRiser}mm)`);
    }
    if (actualRiserHeight > maxRiser) {
      complianceNotes.push(`Riser height (${actualRiserHeight.toFixed(1)}mm) exceeds maximum (${maxRiser}mm)`);
    }
    if (treadDepth < minTread) {
      complianceNotes.push(`Tread depth (${treadDepth.toFixed(1)}mm) is below minimum (${minTread}mm)`);
    }
    if (stairAngle > maxAngle) {
      complianceNotes.push(`Stair angle (${stairAngle.toFixed(1)}°) exceeds maximum (${maxAngle}°)`);
    }
    
    // Set the result
    setStairsResult({
      numberOfRisers: idealRisers,
      riserHeight: actualRiserHeight,
      treadDepth: treadDepth,
      totalRun: run,
      stairAngle: stairAngle,
      headroom: headroom,
      isCompliant: isCompliant,
      complianceNotes: complianceNotes
    });
    
    toast({
      title: "Calculation Complete",
      description: isCompliant 
        ? "Stair design meets building code requirements" 
        : "Warning: Stair design does not meet all requirements",
      variant: isCompliant ? "default" : "destructive",
    });
  };

  return {
    floorToFloorHeight,
    setFloorToFloorHeight,
    availableRun,
    setAvailableRun,
    treadThickness,
    setTreadThickness,
    desiredRiserHeight,
    setDesiredRiserHeight,
    buildingType,
    setBuildingType,
    stairsResult,
    calculateStairs
  };
};
