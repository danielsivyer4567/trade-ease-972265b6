import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Unit } from "../../hooks/useFencingCalculator";
import { useGateCalculator } from "../../hooks/useGateCalculator";
import { GateInputForm } from "./GateInputForm";
import { GateResultsDisplay } from "./GateResultsDisplay";

interface GateCalculatorProps {
  unit: Unit;
}

export const GateCalculator: React.FC<GateCalculatorProps> = ({ unit }) => {
  const {
    gateType,
    setGateType,
    gateCount,
    setGateCount,
    calculationResult,
    calculateGateMaterials
  } = useGateCalculator();

  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle className="text-xl">Gate Materials Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <GateInputForm
          gateType={gateType}
          setGateType={setGateType}
          gateCount={gateCount}
          setGateCount={setGateCount}
          onCalculate={calculateGateMaterials}
        />

        {calculationResult && (
          <GateResultsDisplay
            calculationResult={calculationResult}
            gateType={gateType}
            gateCount={gateCount}
          />
        )}

        <p className="text-xs text-gray-500 mt-2">
          Note: Gate calculations are based on standard gate dimensions. Additional materials may be required for custom gate sizes.
        </p>
      </CardContent>
    </Card>
  );
};
