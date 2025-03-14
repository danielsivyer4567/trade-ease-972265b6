
import { useState } from "react";

export interface StairsCalculatorResult {
  numberOfRisers: number;
  numberOfTreads: number;
  riserHeight: number;
  treadDepth: number;
  totalRun: number;
  stairAngle: number;
  stringerLength: number;
  recommendations: string[];
}

export const useStairsCalculator = () => {
  const [totalRise, setTotalRise] = useState<string>("");
  const [floorToFloor, setFloorToFloor] = useState<string>("");
  const [availableRun, setAvailableRun] = useState<string>("");
  const [stairType, setStairType] = useState<string>("straight");
  const [targetRiser, setTargetRiser] = useState<string>("");
  const [targetTread, setTargetTread] = useState<string>("");
  const [unit, setUnit] = useState<string>("mm");
  const [headroomHeight, setHeadroomHeight] = useState<string>("2000");
  const [result, setResult] = useState<StairsCalculatorResult | null>(null);

  // Convert units to millimeters for calculation
  const convertToMm = (value: number): number => {
    return unit === "inches" ? value * 25.4 : value;
  };

  // Convert millimeters back to selected unit for display
  const convertFromMm = (value: number): number => {
    return unit === "inches" ? value / 25.4 : value;
  };

  // Calculate stairs dimensions
  const calculateStairs = () => {
    // Validate inputs
    if (!floorToFloor || !availableRun) {
      return;
    }

    // Convert inputs to numbers
    const rise = parseFloat(floorToFloor);
    const run = parseFloat(availableRun);
    
    // Set defaults for target dimensions
    let idealRiser = unit === "mm" ? 175 : 7; // Default ideal riser height
    let idealTread = unit === "mm" ? 275 : 11; // Default ideal tread depth
    
    // Use custom targets if provided
    if (targetRiser) {
      idealRiser = parseFloat(targetRiser);
    }
    
    if (targetTread) {
      idealTread = parseFloat(targetTread);
    }

    // Calculate number of risers
    let numRisers = Math.round(rise / idealRiser);
    
    // Ensure minimum number of risers
    if (numRisers < 2) numRisers = 2;
    
    // Calculate actual riser height
    const actualRiserHeight = rise / numRisers;
    
    // Calculate number of treads (always one less than risers)
    const numTreads = numRisers - 1;
    
    // Calculate tread depth
    let actualTreadDepth = run / numTreads;
    
    // Adjust if L-shaped or U-shaped stairs
    let actualTotalRun = run;
    if (stairType === "l-shaped" || stairType === "u-shaped") {
      // For L or U-shaped stairs, half treads are used at landings
      // This is a simplification - real designs need more detail
      actualTotalRun = actualTreadDepth * numTreads;
    }
    
    // Calculate stair angle in degrees
    const angleRadians = Math.atan(rise / actualTotalRun);
    const angleDegrees = angleRadians * (180 / Math.PI);
    
    // Calculate stringer length using Pythagorean theorem
    const stringerLength = Math.sqrt(Math.pow(rise, 2) + Math.pow(actualTotalRun, 2));
    
    // Prepare recommendations
    const recommendations: string[] = [];
    
    // Check if riser height is within comfortable range
    const minRiserHeight = unit === "mm" ? 150 : 6;
    const maxRiserHeight = unit === "mm" ? 200 : 8;
    
    if (actualRiserHeight < minRiserHeight) {
      recommendations.push(`Riser height (${actualRiserHeight.toFixed(1)} ${unit}) is too low. Consider reducing the number of steps.`);
    } else if (actualRiserHeight > maxRiserHeight) {
      recommendations.push(`Riser height (${actualRiserHeight.toFixed(1)} ${unit}) is too high. Consider adding more steps.`);
    }
    
    // Check if tread depth is within comfortable range
    const minTreadDepth = unit === "mm" ? 240 : 9.5;
    
    if (actualTreadDepth < minTreadDepth) {
      recommendations.push(`Tread depth (${actualTreadDepth.toFixed(1)} ${unit}) is too shallow. Consider increasing the run length or reducing steps.`);
    }
    
    // Check stair angle
    if (angleDegrees > 40) {
      recommendations.push(`Stair angle (${angleDegrees.toFixed(1)}°) is steep. Consider increasing the run length.`);
    }
    
    // Check "2R + T" rule (a comfort formula for stairs)
    const comfort = 2 * actualRiserHeight + actualTreadDepth;
    const idealComfort = unit === "mm" ? 630 : 25;
    
    if (Math.abs(comfort - idealComfort) > (unit === "mm" ? 30 : 1.2)) {
      recommendations.push(`The 2R+T value (${comfort.toFixed(1)}) is outside the ideal comfort range. Consider adjusting riser/tread dimensions.`);
    }
    
    // Set the results
    setResult({
      numberOfRisers: numRisers,
      numberOfTreads: numTreads,
      riserHeight: actualRiserHeight,
      treadDepth: actualTreadDepth,
      totalRun: actualTotalRun,
      stairAngle: angleDegrees,
      stringerLength: stringerLength,
      recommendations: recommendations
    });
  };

  // Reset the calculator
  const resetStairs = () => {
    setTotalRise("");
    setFloorToFloor("");
    setAvailableRun("");
    setTargetRiser("");
    setTargetTread("");
    setResult(null);
  };

  return {
    totalRise,
    setTotalRise,
    floorToFloor,
    setFloorToFloor,
    availableRun,
    setAvailableRun,
    stairType,
    setStairType,
    targetRiser,
    setTargetRiser,
    targetTread,
    setTargetTread,
    unit,
    setUnit,
    headroomHeight,
    setHeadroomHeight,
    result,
    calculateStairs,
    resetStairs
  };
};
