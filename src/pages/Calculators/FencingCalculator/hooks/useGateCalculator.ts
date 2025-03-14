
import { useState } from "react";
import { GateType } from "../types/gateTypes";
import { GATE_MATERIALS } from "../data/gateMaterials";

export const useGateCalculator = () => {
  const [gateType, setGateType] = useState<GateType>("1.8m x 1.5m Double Gate");
  const [gateCount, setGateCount] = useState<number>(1);
  const [calculationResult, setCalculationResult] = useState<Record<string, number | string> | null>(null);

  const calculateGateMaterials = () => {
    const gateMaterials = GATE_MATERIALS[gateType];
    
    if (!gateMaterials) {
      return;
    }

    // Calculate materials based on gate count
    setCalculationResult({
      palings: gateMaterials.palings * gateCount,
      adjustableGateStile: gateMaterials.adjustableGateStile * gateCount,
      nailHardend32mm: gateMaterials.nailHardend32mm * gateCount,
      hardwoodPostHeight: gateMaterials.hardwoodPostHeight,
      hardwoodPostQty: gateMaterials.hardwoodPostQty * gateCount,
      rapidSet30kg: gateMaterials.rapidSet30kg * gateCount,
      rapidSet20kg: gateMaterials.rapidSet20kg * gateCount,
      hinges: gateMaterials.hinges * gateCount,
      dLatch: gateMaterials.dLatch * gateCount,
      dropBolts: gateMaterials.dropBolts * gateCount,
      screws: gateMaterials.screws * gateCount
    });
  };

  return {
    gateType,
    setGateType,
    gateCount,
    setGateCount,
    calculationResult,
    calculateGateMaterials,
  };
};
