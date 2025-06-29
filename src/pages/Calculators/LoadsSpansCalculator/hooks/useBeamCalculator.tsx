import { useState } from "react";
import { WOOD_TYPES, LOAD_TYPES } from "../constants";
import { useToast } from "@/hooks/use-toast";
import { useCalculationHistory } from "@/hooks/use-calculation-history";

export interface CalculationResult {
  maxLoad: number;
  safeLoad: number;
  deflection: number;
}

export const useBeamCalculator = () => {
  const [beamWidth, setBeamWidth] = useState("200");
  const [beamDepth, setBeamDepth] = useState("300");
  const [woodType, setWoodType] = useState("Pine");
  const [loadType, setLoadType] = useState("Residential - Light");
  const [span, setSpan] = useState("4");
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  
  const { toast } = useToast();
  const { addCalculation } = useCalculationHistory();

  const calculateStress = () => {
    if (!beamWidth || !beamDepth || !span) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic calculation variables
    const width = parseFloat(beamWidth);
    const depth = parseFloat(beamDepth);
    const spanLength = parseFloat(span);
    
    // Find wood and load factors
    const selectedWood = WOOD_TYPES.find(wood => wood.name === woodType) || WOOD_TYPES[0];
    const selectedLoad = LOAD_TYPES.find(load => load.name === loadType) || LOAD_TYPES[0];
    
    // Simple beam calculations (this is a simplified model)
    // Maximum distributed load (kg) = (width * depth² * strengthFactor) / (spanLength * 1000)
    const inertia = (width * Math.pow(depth, 3)) / 12;
    const maxLoad = (inertia * selectedWood.strengthFactor) / (spanLength * 1000);
    
    // Safe load is calculated with a safety factor of 2.5
    const safeLoad = maxLoad / 2.5;
    
    // Deflection in mm = (5 * loadFactor * span³) / (384 * E * I)
    // Using simplified approach
    const deflection = (5 * selectedLoad.factor * Math.pow(spanLength, 3)) / 
                      (384 * selectedWood.strengthFactor * inertia / 1000);
    
    const calculationResult = {
      maxLoad: Number(maxLoad.toFixed(2)),
      safeLoad: Number(safeLoad.toFixed(2)),
      deflection: Number(deflection.toFixed(2)),
    };

    setCalculatedResult(calculationResult);

    // Save calculation to history
    addCalculation(
      "Beam Calculator",
      {
        beamWidth: width,
        beamDepth: depth,
        woodType,
        loadType,
        span: spanLength
      },
      calculationResult
    );

    toast({
      title: "Calculation Complete", 
      description: "Load and span results have been calculated",
    });
  };

  return {
    beamWidth,
    setBeamWidth,
    beamDepth,
    setBeamDepth,
    woodType,
    setWoodType,
    loadType,
    setLoadType,
    span,
    setSpan,
    calculatedResult,
    setCalculatedResult,
    calculateStress
  };
};
